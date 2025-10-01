// nodeConfigurations.js
// Configuration objects for all node types

import { Position } from 'reactflow';

export const nodeConfigurations = {
  customInput: {
    title: 'Input',
    width: 280,
    height: 160,
    backgroundColor: '#e1f5fe',
    borderColor: '#4682b4',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(70, 130, 180, 0.4)',
    fields: [
      {
        name: 'inputName',
        label: 'Input Name',
        type: 'text',
        defaultValue: 'input_1',
        placeholder: 'Enter input name',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px',
          fontWeight: '400'
        }
      },
      {
        name: 'inputType',
        label: 'Data Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px',
          fontWeight: '400'
        }
      }
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'value',
        style: { 
          background: '#4682b4',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(70, 130, 180, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      }
    ]
  },

  llm: {
    title: 'LLM',
    width: 280,
    height: 160,
    backgroundColor: '#f3e5f5',
    borderColor: '#9370db',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(147, 112, 219, 0.4)',
    description: 'Large Language Model processor',
    fields: [
      {
        name: 'model',
        label: 'AI Model',
        type: 'select',
        defaultValue: 'gpt-3.5-turbo',
        options: [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'claude-3', label: 'Claude 3' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'system',
        style: { 
          top: '40%',
          background: '#9370db',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          left: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(147, 112, 219, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      },
      {
        type: 'target',
        position: Position.Left,
        id: 'prompt',
        style: { 
          top: '60%',
          background: '#9370db',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          left: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(147, 112, 219, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'response',
        style: { 
          top: '50%',
          background: '#9370db',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          right: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(147, 112, 219, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      }
    ]
  },

  customOutput: {
    title: 'Output',
    width: 280,
    height: 160,
    backgroundColor: '#e8f5e8',
    borderColor: '#32cd32',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(50, 205, 50, 0.4)',
    fields: [
      {
        name: 'outputName',
        label: 'Output Name',
        type: 'text',
        defaultValue: 'output_',
        placeholder: 'Enter output name',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      },
      {
        name: 'outputType',
        label: 'Output Format',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
          { value: 'JSON', label: 'JSON' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'value',
        style: { 
          top: '50%',
          background: '#32cd32',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          left: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(50, 205, 50, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      }
    ]
  },

  text: {
    title: 'Text',
    width: 280,
    height: 200,
    backgroundColor: '#fff8e1',
    borderColor: '#ff8c00',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(255, 140, 0, 0.4)',
    hasDynamicHandles: true, // Flag for dynamic handle generation
    fields: [
      {
        name: 'text',
        label: 'Text Template',
        type: 'textarea',
        defaultValue: '{{input}}',
        placeholder: 'Enter text with variables like {{input}}...',
        rows: 2,
        style: { 
          width: '100%', 
          resize: 'vertical',
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px',
          fontFamily: 'inherit',
          minHeight: '50px'
        }
      }
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        style: { 
          top: '50%',
          background: '#ff8c00',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          right: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(255, 140, 0, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      }
    ]
  },

  // New node types to demonstrate abstraction
  filter: {
    title: 'Filter',
    width: 280,
    height: 160,
    backgroundColor: '#ffb6c1',
    borderColor: '#ff69b4',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
    fields: [
      {
        name: 'condition',
        label: 'Filter Condition',
        type: 'select',
        defaultValue: 'contains',
        options: [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
          { value: 'greater_than', label: 'Greater Than' },
          { value: 'less_than', label: 'Less Than' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      },
      {
        name: 'value',
        label: 'Filter Value',
        type: 'text',
        placeholder: 'Filter value',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'input',
        style: { 
          background: '#ff69b4',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        style: { 
          top: '40%',
          background: '#ff69b4',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'filtered',
        style: { 
          top: '60%',
          background: '#ff69b4',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      }
    ]
  },

  math: {
    title: 'Math',
    width: 280,
    height: 160,
    backgroundColor: '#e0f2f1',
    borderColor: '#20b2aa',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(32, 178, 170, 0.4)',
    fields: [
      {
        name: 'operation',
        label: 'Math Operation',
        type: 'select',
        defaultValue: 'add',
        options: [
          { value: 'add', label: 'Add' },
          { value: 'subtract', label: 'Subtract' },
          { value: 'multiply', label: 'Multiply' },
          { value: 'divide', label: 'Divide' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'a',
        style: { 
          top: '40%',
          background: '#20b2aa',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          left: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(32, 178, 170, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      },
      {
        type: 'target',
        position: Position.Left,
        id: 'b',
        style: { 
          top: '60%',
          background: '#20b2aa',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          left: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(32, 178, 170, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'result',
        style: { 
          top: '50%',
          background: '#20b2aa',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          right: '-6px',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(32, 178, 170, 0.4)',
          transition: 'all 0.2s ease',
          position: 'absolute'
        }
      }
    ]
  },

  timer: {
    title: 'Timer',
    width: 280,
    height: 160,
    backgroundColor: '#f0e68c',
    borderColor: '#daa520',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(218, 165, 32, 0.4)',
    fields: [
      {
        name: 'duration',
        label: 'Duration (ms)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 100,
        placeholder: 'Milliseconds',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'trigger',
        style: { 
          background: '#daa520',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'done',
        style: { 
          background: '#daa520',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      }
    ]
  },

  logger: {
    title: 'Logger',
    width: 280,
    height: 160,
    backgroundColor: '#ffa07a',
    borderColor: '#ff6347',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(255, 99, 71, 0.4)',
    fields: [
      {
        name: 'level',
        label: 'Log Level',
        type: 'select',
        defaultValue: 'info',
        options: [
          { value: 'debug', label: 'Debug' },
          { value: 'info', label: 'Info' },
          { value: 'warn', label: 'Warning' },
          { value: 'error', label: 'Error' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      },
      {
        name: 'message',
        label: 'Log Message',
        type: 'text',
        placeholder: 'Log message',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'data',
        style: { 
          background: '#ff6347',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
        style: { 
          background: '#ff6347',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      }
    ]
  },

  webhook: {
    title: 'Webhook',
    width: 280,
    height: 160,
    backgroundColor: '#d8bfd8',
    borderColor: '#9932cc',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(153, 50, 204, 0.4)',
    fields: [
      {
        name: 'url',
        label: 'Webhook URL',
        type: 'text',
        placeholder: 'https://api.example.com/webhook',
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      },
      {
        name: 'method',
        label: 'HTTP Method',
        type: 'select',
        defaultValue: 'POST',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ],
        style: { 
          padding: '8px 12px', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          fontSize: '12px'
        }
      }
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'payload',
        style: { 
          background: '#9932cc',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'response',
        style: { 
          background: '#9932cc',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }
      }
    ]
  }
};