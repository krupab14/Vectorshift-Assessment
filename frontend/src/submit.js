// submit.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore } from './store';

const SubmitContainer = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(233, 69, 96, 0.3);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  flex-shrink: 0;
`;

const SubmitBtn = styled.button`
  background: linear-gradient(135deg, 
    rgba(20, 25, 40, 0.9) 0%,
    rgba(30, 35, 60, 0.8) 50%,
    rgba(255, 105, 180, 0.15) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 105, 180, 0.3);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
      rgba(255, 105, 180, 0.2), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-1px) scale(1.02);
    background: linear-gradient(135deg, 
      rgba(30, 35, 60, 0.9) 0%,
      rgba(40, 45, 80, 0.8) 50%,
      rgba(255, 105, 180, 0.25) 100%
    );
    border-color: rgba(255, 105, 180, 0.6);
    box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const AlertBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const AlertTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
`;

const AlertContent = styled.div`
  margin-bottom: 1.5rem;
  color: #666;
  line-height: 1.5;
`;

const AlertStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const DAGStatus = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
  background: ${props => props.$isDAG ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$isDAG ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.$isDAG ? '#c3e6cb' : '#f5c6cb'};
`;

const CloseButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

export const SubmitButton = () => {
    const { nodes, edges, forceConnection } = useStore(state => ({ 
        nodes: state.nodes, 
        edges: state.edges,
        forceConnection: state.forceConnection 
    }));
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        
        try {
            // Force connection before submitting if needed
            if (nodes.length >= 2 && edges.length === 0) {
                console.log('🔗 No connections found, attempting force connection before submit...');
                forceConnection();
            }

            // Log the data being sent for debugging
            const pipelineData = {
                nodes: nodes.map(node => ({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data || {}
                })),
                edges: edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle || null,
                    targetHandle: edge.targetHandle || null
                }))
            };

            console.log('Submitting pipeline data:', pipelineData);

            const response = await fetch(`${apiUrl}/pipelines/parse?v=${Date.now()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Pipeline analysis result:', result);
            setAlertData(result);
            setShowAlert(true);

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            // Show error alert
            const currentApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
            setAlertData({
                error: true,
                message: `Failed to submit pipeline: ${error.message}. Make sure the backend server is running on ${currentApiUrl}`
            });
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeAlert = () => {
        setShowAlert(false);
        setAlertData(null);
    };

    return (
        <>
            <SubmitContainer>
                <SubmitBtn 
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Submit Pipeline'}
                </SubmitBtn>
            </SubmitContainer>

            {showAlert && alertData && (
                <AlertOverlay onClick={closeAlert}>
                    <AlertBox onClick={e => e.stopPropagation()}>
                        <AlertTitle>
                            {alertData.error ? 'Error' : 'Pipeline Analysis'}
                        </AlertTitle>
                        
                        {alertData.error ? (
                            <AlertContent>
                                {alertData.message}
                            </AlertContent>
                        ) : (
                            <>
                                <AlertContent>
                                    Your pipeline has been successfully analyzed!
                                </AlertContent>
                                
                                <AlertStats>
                                    <StatItem>
                                        <StatValue>{alertData.num_nodes}</StatValue>
                                        <StatLabel>Nodes</StatLabel>
                                    </StatItem>
                                    <StatItem>
                                        <StatValue>{alertData.num_edges}</StatValue>
                                        <StatLabel>Edges</StatLabel>
                                    </StatItem>
                                </AlertStats>

                                <DAGStatus $isDAG={alertData.is_dag}>
                                    {alertData.is_dag 
                                        ? '✅ Valid DAG - No cycles detected' 
                                        : '❌ Invalid - Cycles detected'
                                    }
                                </DAGStatus>
                            </>
                        )}
                        
                        <CloseButton onClick={closeAlert}>
                            Close
                        </CloseButton>
                    </AlertBox>
                </AlertOverlay>
            )}
        </>
    );
};
