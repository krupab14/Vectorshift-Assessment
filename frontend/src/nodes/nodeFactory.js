// nodeFactory.js
// Factory function to create nodes using BaseNode and configurations

import React from 'react';
import { BaseNode } from './BaseNode';
import { nodeConfigurations } from './nodeConfigurations';

export const createNode = (nodeType) => {
  return ({ id, data }) => {
    const config = nodeConfigurations[nodeType];
    
    if (!config) {
      console.warn(`No configuration found for node type: ${nodeType}`);
      return <div>Unknown node type: {nodeType}</div>;
    }

    return (
      <BaseNode
        id={id}
        data={data}
        nodeConfig={{
          ...config,
          border: `2px solid ${config.borderColor || '#ccc'}`,
          style: {
            ...config.style,
            transition: 'all 0.2s ease',
          }
        }}
      />
    );
  };
};

// Export all node types
export const InputNode = createNode('customInput');
export const LLMNode = createNode('llm');
export const OutputNode = createNode('customOutput');
export const TextNode = createNode('text');

// New node types
export const FilterNode = createNode('filter');
export const MathNode = createNode('math');
export const TimerNode = createNode('timer');
export const LoggerNode = createNode('logger');
export const WebhookNode = createNode('webhook');