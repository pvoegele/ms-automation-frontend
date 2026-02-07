'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useFlowStore from '@/lib/store/flowStore';
import NodePalette from '@/components/flow/NodePalette';
import Inspector from '@/components/inspector/Inspector';
import MailboxNode from '@/components/nodes/MailboxNode';
import OneDriveNode from '@/components/nodes/OneDriveNode';
import FilterNode from '@/components/nodes/FilterNode';
import { CustomNodeData } from '@/types/flow';
import FlowToolbar from '@/components/flow/FlowToolbar';

const nodeTypes: NodeTypes = {
  mailbox: MailboxNode,
  onedrive: OneDriveNode,
  filter: FilterNode,
};

function FlowEditorContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    selectEdge,
    flowName,
  } = useFlowStore();

  const [nodeCounter, setNodeCounter] = useState({
    mailbox: 0,
    onedrive: 0,
    filter: 0,
  });

  const handleAddNode = useCallback(
    (type: 'mailbox' | 'onedrive' | 'filter') => {
      const counter = nodeCounter[type] + 1;
      setNodeCounter({ ...nodeCounter, [type]: counter });

      let nodeData: CustomNodeData;
      const basePosition = {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
      };

      switch (type) {
        case 'mailbox':
          nodeData = {
            type: 'mailbox',
            label: `Mailbox ${counter}`,
            provider: 'microsoft365',
            configured: false,
            authStatus: 'pending',
          };
          break;
        case 'onedrive':
          nodeData = {
            type: 'onedrive',
            label: `OneDrive ${counter}`,
            configured: false,
            authStatus: 'pending',
          };
          break;
        case 'filter':
          nodeData = {
            type: 'filter',
            label: `Filter ${counter}`,
            configured: false,
            rules: [],
          };
          break;
      }

      const newNode: Node<CustomNodeData> = {
        id: `${type}_${Date.now()}`,
        type,
        position: basePosition,
        data: nodeData,
      };

      addNode(newNode);
    },
    [nodeCounter, addNode]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node);
    },
    [selectNode]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: any) => {
      selectEdge(edge);
    },
    [selectEdge]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  return (
    <div className="h-screen flex flex-col">
      <FlowToolbar />
      
      <div className="flex-1 flex">
        <NodePalette onAddNode={handleAddNode} />
        
        <div className="flex-1 bg-gray-100">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        
        <Inspector />
      </div>
    </div>
  );
}

export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
}
