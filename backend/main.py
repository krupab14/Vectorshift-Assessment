from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    """
    Parse pipeline data and return statistics including DAG validation
    """
    try:
        nodes = pipeline.nodes
        edges = pipeline.edges
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Check if the graph is a DAG (Directed Acyclic Graph)
        is_dag = is_directed_acyclic_graph(nodes, edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing pipeline: {str(e)}")

def is_directed_acyclic_graph(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)
    using DFS-based cycle detection
    """
    if not nodes:
        return True
    
    # Build adjacency list
    graph = {}
    node_ids = {node.id for node in nodes}
    
    # Initialize graph with all nodes
    for node in nodes:
        graph[node.id] = []
    
    # Add edges to graph
    for edge in edges:
        source = edge.source
        target = edge.target
        
        # Only add edge if both nodes exist
        if source in node_ids and target in node_ids:
            graph[source].append(target)
    
    # Use DFS to detect cycles
    # 0: unvisited, 1: visiting (in current path), 2: visited (completely processed)
    state = {node_id: 0 for node_id in node_ids}
    
    def has_cycle(node_id: str) -> bool:
        if state[node_id] == 1:  # Found a back edge (cycle)
            return True
        if state[node_id] == 2:  # Already processed
            return False
        
        state[node_id] = 1  # Mark as visiting
        
        # Check all neighbors
        for neighbor in graph[node_id]:
            if has_cycle(neighbor):
                return True
        
        state[node_id] = 2  # Mark as completely processed
        return False
    
    # Check for cycles starting from each unvisited node
    for node_id in node_ids:
        if state[node_id] == 0:
            if has_cycle(node_id):
                return False
    
    return True

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
