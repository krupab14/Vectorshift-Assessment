// draggableNode.js

import styled from 'styled-components';

const NodeButton = styled.div`
  cursor: grab;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(135deg, 
    rgba(20, 25, 40, 1) 0%,
    rgba(30, 35, 60, 1) 50%,
    rgba(255, 105, 180, 0.4) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 105, 180, 0.6);
  transition: all 0.3s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 105, 180, 0.4), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateX(3px) scale(1.02);
    background: linear-gradient(135deg, 
      rgba(30, 35, 60, 1) 0%,
      rgba(40, 45, 80, 1) 50%,
      rgba(255, 105, 180, 0.5) 100%
    );
    border-color: rgba(255, 105, 180, 0.8);
    box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    cursor: grabbing;
    transform: translateX(2px) scale(0.98);
  }
`;

const NodeLabel = styled.span`
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  text-align: center;
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;
`;

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <NodeButton
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        <NodeLabel>{label}</NodeLabel>
      </NodeButton>
    );
  };
  