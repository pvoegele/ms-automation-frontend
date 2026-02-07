'use client';

import { Node } from 'reactflow';
import { FilterNodeData } from '@/types/flow';
import useFlowStore from '@/lib/store/flowStore';

interface FilterInspectorProps {
  node: Node<FilterNodeData>;
}

export default function FilterInspector({ node }: FilterInspectorProps) {
  const { updateNodeData, deleteNode } = useFlowStore();

  const handleLabelChange = (label: string) => {
    updateNodeData(node.id, { label });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input
          type="text"
          value={node.data.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="My Filter"
        />
      </div>

      <div className="text-sm text-gray-600">
        Filter configuration coming soon. This node will allow you to filter emails by subject, sender, date, etc.
      </div>

      <button
        onClick={() => deleteNode(node.id)}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Delete Node
      </button>
    </div>
  );
}
