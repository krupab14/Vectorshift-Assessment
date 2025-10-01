// toolbar.js

import { DraggableNode } from './draggableNode';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 205px;
  background: rgba(20, 25, 40, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 105, 180, 0.3);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(20, 25, 40, 0.9) 0%,
      rgba(30, 35, 60, 0.8) 25%,
      rgba(40, 45, 80, 0.7) 50%,
      rgba(255, 105, 180, 0.1) 100%
    );
    pointer-events: none;
    z-index: -1;
  }
`;

const NodesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NodeCategory = styled.div`
  margin-bottom: 0.75rem;
`;

const CategoryTitle = styled.h4`
  color: rgba(255, 105, 180, 0.9);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 0.5rem 0;
  padding: 0.25rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export const PipelineToolbar = () => {
    return (
        <Sidebar>
            <NodesContainer>
                <NodeCategory>
                    <CategoryTitle>Core Nodes</CategoryTitle>
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                </NodeCategory>
                
                <NodeCategory>
                    <CategoryTitle>Processing</CategoryTitle>
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='math' label='Math' />
                </NodeCategory>
                
                <NodeCategory>
                    <CategoryTitle>Utilities</CategoryTitle>
                    <DraggableNode type='timer' label='Timer' />
                    <DraggableNode type='logger' label='Logger' />
                    <DraggableNode type='webhook' label='Webhook' />
                </NodeCategory>
            </NodesContainer>
        </Sidebar>
    );
};
