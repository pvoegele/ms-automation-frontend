'use client';

import { Node, Edge } from 'reactflow';
import { CustomNodeData, EdgeConfig, MailboxNodeData, OneDriveNodeData, FilterNodeData } from '@/types/flow';
import useFlowStore from '@/lib/store/flowStore';
import MailboxInspector from './MailboxInspector';
import OneDriveInspector from './OneDriveInspector';
import FilterInspector from './FilterInspector';
import EdgeInspector from './EdgeInspector';

export default function Inspector() {
  const { selectedNode, selectedEdge } = useFlowStore();

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Inspector</h2>
        <div className="text-sm text-gray-600">
          Select a node or connection to configure it
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Connection Settings</h2>
        <EdgeInspector edge={selectedEdge as Edge<EdgeConfig>} />
      </div>
    );
  }

  if (selectedNode) {
    const node = selectedNode as Node<CustomNodeData>;
    
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Node Settings</h2>
        
        {node.data.type === 'mailbox' && <MailboxInspector node={node as Node<MailboxNodeData>} />}
        {node.data.type === 'onedrive' && <OneDriveInspector node={node as Node<OneDriveNodeData>} />}
        {node.data.type === 'filter' && <FilterInspector node={node as Node<FilterNodeData>} />}
      </div>
    );
  }

  return null;
}
