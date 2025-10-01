// store.js

import { createWithEqualityFn } from "zustand/traditional";
import {
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = createWithEqualityFn((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    deleteNode: (nodeId) => {
        const currentState = get();
        // Remove the node
        const newNodes = currentState.nodes.filter(node => node.id !== nodeId);
        // Remove any edges connected to this node
        const newEdges = currentState.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        );
        set({
            nodes: newNodes,
            edges: newEdges
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      console.log('🔗 ONCONNECT CALLED! Connection:', connection); 
      
      // Immediate state update to bypass any issues
      const currentState = get();
      console.log('� Current state before:', currentState.edges.length, 'edges');
      
      // Validate the connection parameters
      if (!connection.source || !connection.target) {
        console.error('❌ Invalid connection: missing source or target');
        return;
      }
      
      // Create edge with all required properties
      const newEdge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || null,
        targetHandle: connection.targetHandle || null,
        type: 'smoothstep', 
        animated: true, 
        markerEnd: { type: MarkerType.Arrow },
        style: { stroke: '#ffffff', strokeWidth: 2 }
      };
      
      // Direct state update
      const newEdges = [...currentState.edges, newEdge];
      console.log('✅ Creating new edge:', newEdge);
      console.log('📊 New edges array:', newEdges);
      
      // Force update state
      set({ edges: newEdges });
      
      // Verify state was updated
      setTimeout(() => {
        const updatedState = get();
        console.log('� State after update:', updatedState.edges.length, 'edges');
        console.log('📊 All edges:', updatedState.edges);
      }, 100);
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
      
      // Check for auto-connections when text is updated
      if (fieldName === 'text' || fieldName === 'inputName') {
        get().checkAutoConnections();
      }
    },
    
    // Auto-connection checker
    checkAutoConnections: () => {
      const nodes = get().nodes;
      const edges = get().edges;
      
      // Find input nodes and text nodes
      const inputNodes = nodes.filter(n => n.type === 'customInput');
      const textNodes = nodes.filter(n => n.type === 'text');
      
      inputNodes.forEach(inputNode => {
        const inputName = inputNode.data?.inputName || 'input_1';
        
        textNodes.forEach(textNode => {
          const textContent = textNode.data?.text || '';
          const variablePattern = `{{${inputName}}}`;
          
          // Check if text contains the variable and no connection exists
          if (textContent.includes(variablePattern)) {
            const existingConnection = edges.find(edge => 
              edge.source === inputNode.id && 
              edge.target === textNode.id &&
              edge.sourceHandle === inputName &&
              edge.targetHandle === inputName
            );
            
            if (!existingConnection) {
              console.log('🔗 Auto-connecting matching variable:', inputName);
              const autoEdge = {
                id: `auto-edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                source: inputNode.id,
                target: textNode.id,
                sourceHandle: inputName,
                targetHandle: inputName,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#f38ba8', strokeWidth: 2 }
              };
              
              set({ edges: [...get().edges, autoEdge] });
            }
          }
        });
      });
    },
    // Manual connection using proper ReactFlow onConnect call
    manualConnect: () => {
      const nodes = get().nodes;
      const state = get();
      
      if (nodes.length >= 2) {
        const sourceNode = nodes.find(n => n.type === 'customInput');
        const targetNode = nodes.find(n => n.type === 'text');
        
        if (sourceNode && targetNode) {
          const inputName = sourceNode.data?.inputName || 'input_1';
          
          // Simulate the connection object that ReactFlow would pass
          const connectionParams = {
            source: sourceNode.id,
            target: targetNode.id,
            sourceHandle: inputName,
            targetHandle: inputName
          };
          
          console.log('🔧 Manual connect with params:', connectionParams);
          
          // Call our own onConnect function
          state.onConnect(connectionParams);
        }
      }
    },
    // Force connection function that bypasses ReactFlow entirely
    forceConnection: () => {
      const nodes = get().nodes;
      console.log('🚀 Force connection - available nodes:', nodes.map(n => ({ id: n.id, type: n.type })));
      
      if (nodes.length >= 2) {
        // Find input node and text node
        const sourceNode = nodes.find(n => n.type === 'customInput');
        const targetNode = nodes.find(n => n.type === 'text');
        
        console.log('🎯 Source node:', sourceNode);
        console.log('🎯 Target node:', targetNode);
        
        if (sourceNode && targetNode) {
          // Get the input name for handle matching
          const inputName = sourceNode.data?.inputName || 'input_1';
          console.log('🔧 Using input name for handles:', inputName);
          
          // Check if text node contains the same variable
          const textContent = targetNode.data?.text || '';
          const variablePattern = `{{${inputName}}}`;
          
          console.log('🔍 Checking if text contains variable:', variablePattern, 'in:', textContent);
          
          if (textContent.includes(variablePattern)) {
            const forceEdge = {
              id: `force-edge-${Date.now()}`,
              source: sourceNode.id,
              target: targetNode.id,
              sourceHandle: inputName,
              targetHandle: inputName,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#f38ba8', strokeWidth: 3 },
              markerEnd: { type: MarkerType.Arrow }
            };
            
            const currentEdges = get().edges;
            set({ edges: [...currentEdges, forceEdge] });
            console.log('💪 Auto-connection created for matching variable:', forceEdge);
          } else {
            console.log('⚠️ Variables do not match - no auto-connection');
          }
        } else {
          console.error('❌ Could not find required nodes for force connection');
        }
      } else {
        console.error('❌ Need at least 2 nodes for force connection');
      }
    },
    // Debug function to show current state
    debugState: () => {
      const state = get();
      console.log('🐛 Current state:', {
        nodes: state.nodes.length,
        edges: state.edges.length,
        nodeDetails: state.nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edgeDetails: state.edges
      });
    },
  }), Object.is);
