// textNode.js
// Enhanced Text node with dynamic resizing and variable detection

import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(120);
  const textareaRef = useRef(null);
  
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Extract variables from text ({{variable}} pattern)
  const extractVariables = (inputText) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const foundVariables = [];
    let match;
    
    while ((match = regex.exec(inputText)) !== null) {
      const variableName = match[1].trim();
      if (variableName && !foundVariables.includes(variableName)) {
        foundVariables.push(variableName);
      }
    }
    
    return foundVariables;
  };

  // Update dynamic height based on content
  const updateHeight = () => {
    // Fixed height since we're using scrollable textarea
    const baseHeight = 140; // Fixed height for consistent sizing
    setDynamicHeight(baseHeight);
  };

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update variables
    const newVariables = extractVariables(newText);
    console.log('Text changed to:', newText);
    console.log('Detected variables:', newVariables); // Debug log
    setVariables(newVariables);
    
    // Update store with the new data
    updateNodeField(id, 'text', newText);
    updateNodeField(id, 'variables', newVariables);
    
    // Update height
    setTimeout(updateHeight, 0);
  };

  // Initialize variables and height on mount and data changes
  useEffect(() => {
    const initialVariables = extractVariables(text);
    console.log('Initial variables for node', id, ':', initialVariables); // Debug log
    console.log('Creating handles for variables:', initialVariables);
    setVariables(initialVariables);
    updateNodeField(id, 'variables', initialVariables);
    
    // Set initial height
    setTimeout(updateHeight, 0);
  }, [id, text, updateNodeField]);

  // Update height when text changes
  useEffect(() => {
    updateHeight();
  }, [text]);

  const nodeStyle = {
    width: 280,
    height: dynamicHeight,
    minHeight: 120,
    backgroundColor: '#fff3e0',
    border: '2px solid #f57c00',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(245, 124, 0, 0.15)',
    transition: 'height 0.2s ease',
    position: 'relative'
  };

  const headerStyle = {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
    fontSize: '14px',
    textAlign: 'center'
  };

  const textareaStyle = {
    width: '100%',
    resize: 'none',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '12px',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    overflowY: 'auto',
    maxHeight: '72px', // 3 lines * 24px line height
    minHeight: '48px', // 2 lines minimum
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word'
  };

  const variableListStyle = {
    marginTop: '8px',
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic'
  };

  return (
    <div style={nodeStyle}>
      {/* Input handles for variables - force re-render with key */}
      {variables.map((variable, index) => (
        <Handle
          key={`${id}-var-${variable}-${index}`}
          type="target"
          position={Position.Left}
          id={variable}
          isConnectable={true}
          style={{
            top: `${40 + (index * 25)}px`,
            background: '#f57c00',
            border: '2px solid #fff',
            width: '12px',
            height: '12px',
            left: '-6px'
          }}
        />
      ))}

      <div style={headerStyle}>Text</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
        <label style={{ fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>
          Text:
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text with variables like {{input}} or {{z}}..."
          style={textareaStyle}
          onFocus={(e) => e.target.style.borderColor = '#f57c00'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={true}
        style={{
          background: '#f57c00',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
          right: '-6px'
        }}
      />
    </div>
  );
};
