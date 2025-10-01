// BaseNode.js
// Base abstraction for all node types to reduce code duplication

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ 
  id, 
  data, 
  nodeConfig 
}) => {
  const [nodeState, setNodeState] = useState({});
  const [dynamicHandles, setDynamicHandles] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const deleteNode = useStore((state) => state.deleteNode);

  // Initialize state based on node configuration
  useEffect(() => {
    const initialState = {};
    if (nodeConfig.fields) {
      nodeConfig.fields.forEach(field => {
        initialState[field.name] = data?.[field.name] || field.defaultValue || '';
      });
    }
    setNodeState(initialState);
  }, [data, nodeConfig.fields]);

  // Extract variables from text for dynamic handles (text nodes only)
  const extractVariables = (inputText) => {
    if (!inputText) return [];
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

  // Update dynamic handles when text changes (for text nodes)
  useEffect(() => {
    if (nodeConfig.hasDynamicHandles && nodeState.text) {
      const variables = extractVariables(nodeState.text);
      console.log(`[BaseNode ${id}] Detected variables:`, variables);
      
      // Create invisible handles for variables (no visual circles but keep functionality)
      const newHandles = variables.map((variable, index) => ({
        type: 'target',
        position: Position.Left,
        id: variable,
        label: variable,
        style: {
          top: `${60 + (index * 30)}px`,
          background: 'transparent',
          border: 'none',
          width: '0px',
          height: '0px',
          left: '0px',
          display: 'none' // Hide the visual handle completely
        }
      }));
      
      setDynamicHandles(newHandles);
      
      // Update store with variables
      updateNodeField(id, 'variables', variables);
    }
  }, [nodeState.text, nodeConfig.hasDynamicHandles, nodeConfig.borderColor, id, updateNodeField]);

  const handleFieldChange = (fieldName, value) => {
    setNodeState(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Update the store as well
    updateNodeField(id, fieldName, value);
    
    // Log for debugging
    console.log(`[BaseNode ${id}] Field ${fieldName} changed to:`, value);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            key={field.name}
            type="text"
            value={nodeState[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{
              ...field.style,
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:focus': {
                outline: 'none',
                borderColor: nodeConfig.borderColor || '#007bff',
                boxShadow: `0 0 0 2px ${nodeConfig.borderColor || '#007bff'}20`,
                transform: 'scale(1.02)'
              }
            }}
            onFocus={(e) => {
              e.target.style.borderColor = nodeConfig.borderColor || '#007bff';
              e.target.style.boxShadow = `0 0 0 2px ${nodeConfig.borderColor || '#007bff'}20`;
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            key={field.name}
            value={nodeState[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{
              ...field.style,
              width: '100%',
              boxSizing: 'border-box',
              resize: 'none',
              overflow: 'hidden',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              transition: 'all 0.2s ease'
            }}
            rows={field.rows || 3}
            onFocus={(e) => {
              e.target.style.borderColor = nodeConfig.borderColor || '#007bff';
              e.target.style.boxShadow = `0 0 0 2px ${nodeConfig.borderColor || '#007bff'}20`;
              e.target.style.transform = 'scale(1.01)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          />
        );
      case 'select':
        return (
          <select
            key={field.name}
            value={nodeState[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{
              ...field.style,
              width: '100%',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = nodeConfig.borderColor || '#007bff';
              e.target.style.boxShadow = `0 0 0 2px ${nodeConfig.borderColor || '#007bff'}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            key={field.name}
            type="number"
            value={nodeState[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            style={{
              ...field.style,
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderHandle = (handle) => {
    // For input nodes, use the inputName as the handle id for source handles
    let handleId = handle.id;
    
    if (handle.type === 'source' && nodeState.inputName) {
      handleId = nodeState.inputName;
    }
    
    console.log(`[BaseNode ${id}] Rendering handle: type=${handle.type}, originalId=${handle.id}, finalId=${handleId}, inputName=${nodeState.inputName}`);
    
    return (
      <Handle
        key={`${handle.type}-${handleId}-${nodeState.inputName || 'default'}`}
        type={handle.type}
        position={handle.position}
        id={handleId}
        style={{
          ...handle.style,
          position: 'absolute',
          transition: 'all 0.2s ease',
          cursor: 'crosshair',
          zIndex: 1000,
        }}
        isConnectable={true}
      />
    );
  };

  // Combine static and dynamic handles
  const allHandles = [
    ...(nodeConfig.handles || []),
    ...dynamicHandles
  ];

  return (
    <div 
      style={{
        width: nodeConfig.width || 280,
        height: nodeConfig.height || 'auto',
        minHeight: nodeConfig.minHeight || 180,
        border: `2px solid ${nodeConfig.borderColor || '#ccc'}`,
        borderRadius: nodeConfig.borderRadius || '16px',
        backgroundColor: nodeConfig.backgroundColor || '#fff',
        padding: '12px',
        margin: '0',
        boxShadow: nodeConfig.boxShadow || '0 8px 32px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'visible',
        cursor: 'move',
        display: 'flex',
        flexDirection: 'column',
        ...nodeConfig.style
      }}
      className="base-node"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(0,0,0,0.2)`;
        e.currentTarget.style.borderColor = nodeConfig.borderColor ? 
          `color-mix(in srgb, ${nodeConfig.borderColor} 80%, white 20%)` : '#999';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = nodeConfig.boxShadow || '0 8px 32px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = nodeConfig.borderColor || '#ccc';
      }}
    >
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#333',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#000';
          e.target.style.transform = 'scale(1.2)';
          e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = '#333';
          e.target.style.transform = 'scale(1)';
          e.target.style.backgroundColor = 'transparent';
        }}
        title="Delete node"
      >
        ×
      </button>
      {/* Render input handles */}
      {allHandles.filter(h => h.type === 'target').map(renderHandle)}
      
      {/* Header */}
      {nodeConfig.title && (
        <div style={{
          fontWeight: '700',
          marginBottom: '8px',
          marginTop: '4px',
          color: '#333',
          fontSize: '14px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: `2px solid ${nodeConfig.borderColor || '#ccc'}30`,
          paddingBottom: '6px'
        }}>
          {nodeConfig.title}
        </div>
      )}

      {/* Fields */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        overflow: 'visible',
        width: '100%',
        flex: '1',
        padding: '0 4px'
      }}>
        {nodeConfig.fields?.map(field => (
          <div key={field.name} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'visible',
            width: '100%',
            gap: '2px'
          }}>
            {field.label && (
              <label style={{ 
                fontSize: '11px', 
                marginBottom: '2px', 
                fontWeight: '600',
                color: '#333',
                display: 'block',
                lineHeight: '1.2',
                whiteSpace: 'nowrap',
                overflow: 'visible'
              }}>
                {field.label}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Custom content */}
      {nodeConfig.customContent && nodeConfig.customContent(nodeState, handleFieldChange)}
      
      {/* Dynamic variables display for text nodes */}
      {nodeConfig.hasDynamicHandles && dynamicHandles.length > 0 && (
        <div style={{
          marginTop: '12px',
          borderTop: `1px solid ${nodeConfig.borderColor || '#ccc'}30`,
          paddingTop: '12px'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginBottom: '8px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Variables
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {dynamicHandles.map((handle) => (
              <span
                key={`var-${handle.id}`}
                style={{
                  background: `${nodeConfig.borderColor || '#ff8c00'}20`,
                  color: nodeConfig.borderColor || '#ff8c00',
                  border: `1px solid ${nodeConfig.borderColor || '#ff8c00'}60`,
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}
              >
                {handle.id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Render output handles */}
      {allHandles.filter(h => h.type === 'source').map(renderHandle)}
    </div>
  );
};