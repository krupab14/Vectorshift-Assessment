// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ConnectionLineType, ConnectionMode } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/nodeFactory';
import { FilterNode, MathNode, TimerNode, LoggerNode, WebhookNode } from './nodes/nodeFactory';
import styled from 'styled-components';

import 'reactflow/dist/style.css';

const FlowContainer = styled.div`
  flex: 1;
  position: relative;
  margin: 0;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(233, 69, 96, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 90% 10%, rgba(243, 139, 168, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 10% 90%, rgba(116, 192, 252, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, 
      rgba(26, 26, 46, 0.95) 0%,
      rgba(30, 35, 60, 0.9) 25%,
      rgba(40, 45, 80, 0.85) 50%,
      rgba(26, 26, 46, 0.9) 75%,
      rgba(20, 25, 40, 0.95) 100%
    );
  
  /* Global animations */
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes handleGlow {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
  }
  
  /* Enhanced node styling */
  .base-node {
    &:hover .react-flow__handle {
      animation: handleGlow 1.5s ease-in-out infinite;
      transform: scale(1.1);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle ${props => 2 * props.$zoomLevel}px, rgba(255, 182, 193, 0.4) ${props => 2 * props.$zoomLevel}px, transparent ${props => 2 * props.$zoomLevel}px),
      radial-gradient(circle ${props => 1 * props.$zoomLevel}px, rgba(255, 182, 193, 0.2) ${props => 1 * props.$zoomLevel}px, transparent ${props => 1 * props.$zoomLevel}px);
    background-size: ${props => 40 * props.$zoomLevel}px ${props => 40 * props.$zoomLevel}px, ${props => 20 * props.$zoomLevel}px ${props => 20 * props.$zoomLevel}px;
    background-position: 0 0, ${props => 10 * props.$zoomLevel}px ${props => 10 * props.$zoomLevel}px;
    opacity: 0.6;
    pointer-events: none;
    z-index: 1;
    transition: all 0.2s ease;
  }
  
  .react-flow__edge {
    stroke: #f38ba8 !important;
    stroke-width: 2px !important;
    z-index: 100 !important;
    filter: drop-shadow(0 0 3px rgba(243, 139, 168, 0.6));
    
    &.selected {
      stroke: #e94560 !important;
      stroke-width: 3px !important;
      animation: pulse 1s ease-in-out infinite;
    }
  }
  
  .react-flow__edge-path {
    stroke: #f38ba8 !important;
    stroke-width: 2px !important;
  }
  
  .react-flow__connection-line {
    stroke: #e94560 !important;
    stroke-width: 3px !important;
    filter: drop-shadow(0 0 5px rgba(233, 69, 96, 0.8));
  }
  
  .react-flow__handle {
    cursor: crosshair !important;
    pointer-events: all !important;
    z-index: 200 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    
    &:hover {
      transform: scale(1.2) !important;
      filter: brightness(1.2) drop-shadow(0 0 8px currentColor) !important;
    }
    
    &.source {
      cursor: crosshair !important;
    }
    
    &.target {
      cursor: crosshair !important;
    }
  }
  
  .react-flow__controls {
    button {
      background: linear-gradient(135deg, 
        rgba(20, 25, 40, 0.9) 0%,
        rgba(30, 35, 60, 0.8) 50%,
        rgba(255, 105, 180, 0.15) 100%
      ) !important;
      backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 105, 180, 0.3) !important;
      color: white !important;
      border-radius: 0 !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
      position: relative !important;
      overflow: hidden !important;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 105, 180, 0.2), 
          transparent
        );
        transition: left 0.5s ease;
      }
      
      &:hover {
        background: linear-gradient(135deg, 
          rgba(30, 35, 60, 0.9) 0%,
          rgba(40, 45, 80, 0.8) 50%,
          rgba(255, 105, 180, 0.25) 100%
        ) !important;
        border-color: rgba(255, 105, 180, 0.6) !important;
        box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3) !important;
        transform: scale(1.02) !important;
        
        &::before {
          left: 100%;
        }
      }
      
      svg {
        fill: white !important;
        stroke: white !important;
        stroke-width: 2px !important;
        font-weight: 900 !important;
      }
      
      /* Make specific icons bolder */
      svg path {
        stroke-width: 2.5px !important;
        fill: white !important;
      }
      
      /* Specific styling for lock icon to make it look better */
      &[title*="lock"], &[title*="Lock"] {
        svg {
          stroke-width: 2.5px !important;
          fill: none !important;
          stroke: white !important;
          display: none !important;
        }
        
        svg path {
          stroke-width: 2.5px !important;
          fill: none !important;
          stroke: white !important;
        }
        
        svg rect {
          stroke-width: 2.5px !important;
          fill: none !important;
          stroke: white !important;
        }

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='white' viewBox='0 0 24 24'><path d='M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9zm-3 4h12v9H6z'></path></svg>");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }
  
  .react-flow__minimap {
    border: 1px solid rgba(233, 69, 96, 0.3) !important;
  }
  
  .react-flow__node {
    z-index: 10 !important;
  }
  
  .react-flow__node.selected {
    outline: none !important;
    box-shadow: none !important;
  }
  
  .react-flow__node:focus {
    outline: none !important;
  }
  
  .react-flow__node:focus-visible {
    outline: none !important;
  }
  
  .react-flow__node.selectable:focus,
  .react-flow__node.selectable.selected {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const EmptyStateMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(243, 139, 168, 0.8);
  text-align: center;
  font-size: 1.1rem;
  pointer-events: none;
  z-index: 1;
  
  div:first-child {
    background: linear-gradient(135deg, #f38ba8 0%, #74c0fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
  }
`;

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  math: MathNode,
  timer: TimerNode,
  logger: LoggerNode,
  webhook: WebhookNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Add connection validation to ensure connections are always allowed
    const isValidConnection = useCallback((connection) => {
        console.log('🔍 Validating connection:', connection);
        console.log('🔍 Source node:', nodes.find(n => n.id === connection.source));
        console.log('🔍 Target node:', nodes.find(n => n.id === connection.target));
        
        // Always allow connections for debugging
        const isValid = true;
        console.log('✅ Connection validation result:', isValid);
        return isValid;
    }, [nodes]);

    const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {
        console.log('🚀 Connection started:', { nodeId, handleId, handleType });
        console.log('🚀 Event details:', event);
        console.log('🚀 Available nodes:', nodes.map(n => ({ id: n.id, type: n.type })));
    }, [nodes]);

    const onConnectEnd = useCallback((event) => {
        console.log('🏁 Connection ended:', event);
        console.log('🏁 Event type:', event.type);
        console.log('🏁 Current edges count:', edges.length);
    }, [edges]);

    // Handle zoom changes to scale the dot grid
    const onMove = useCallback((event, viewport) => {
        setZoomLevel(viewport.zoom);
    }, []);

    return (
        <FlowContainer ref={reactFlowWrapper} $zoomLevel={zoomLevel}>
            {nodes.length === 0 && (
                <EmptyStateMessage>
                    <div>🎯 Drag nodes from the sidebar to start building your pipeline</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Connect nodes by dragging from output handles to input handles
                    </div>
                </EmptyStateMessage>
            )}
            
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onMove={onMove}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                isValidConnection={isValidConnection}
                connectOnClick={false}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                defaultEdgeOptions={{
                  style: { stroke: '#f38ba8', strokeWidth: 2 },
                  type: 'smoothstep',
                  animated: true,
                }}
            >
                <Background 
                  color="rgba(243, 139, 168, 0.05)" 
                  gap={gridSize} 
                  size={0.5}
                  style={{ 
                    backgroundColor: 'transparent',
                    opacity: 0.4
                  }}
                />
                <Controls 
                  style={{
                    background: 'rgba(26, 26, 46, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(233, 69, 96, 0.3)',
                    borderRadius: '12px',
                  }}
                />
                <MiniMap 
                  nodeColor={(node) => {
                    switch(node.type) {
                      case 'customInput': return '#4682b4'; // Sky blue for input nodes
                      case 'customOutput': return '#32cd32'; // Lime green for output nodes
                      case 'text': return '#ff8c00'; // Dark orange for text nodes
                      case 'llm': return '#9370db'; // Medium slate blue for LLM nodes
                      case 'filter': return '#ff69b4'; // Hot pink for filter nodes
                      case 'math': return '#20b2aa'; // Light sea green for math nodes
                      case 'timer': return '#daa520'; // Goldenrod for timer nodes
                      case 'logger': return '#ff6347'; // Tomato for logger nodes
                      case 'webhook': return '#9932cc'; // Dark orchid for webhook nodes
                      default: return '#ffffff'; // White for unknown types
                    }
                  }}
                  maskColor="rgba(26, 26, 46, 0.1)"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 25, 40, 0.9) 0%, rgba(30, 35, 60, 0.8) 50%, rgba(255, 105, 180, 0.15) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 105, 180, 0.3)',
                    borderRadius: '0',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  }}
                />
            </ReactFlow>
        </FlowContainer>
    )
}
