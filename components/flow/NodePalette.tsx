'use client';

import { useState } from 'react';

interface NodePaletteProps {
  onAddNode: (type: 'mailbox' | 'onedrive' | 'filter') => void;
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const nodeTypes = [
    {
      type: 'mailbox' as const,
      label: 'Mailbox',
      icon: '📧',
      description: 'Email account source',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      type: 'onedrive' as const,
      label: 'OneDrive',
      icon: '☁️',
      description: 'Storage destination',
      color: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      type: 'filter' as const,
      label: 'Filter/Rule',
      icon: '🔍',
      description: 'Filter or transform',
      color: 'bg-green-100 hover:bg-green-200',
    },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Node Palette</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2 flex-1">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              className={`w-full p-3 rounded-lg border border-gray-300 transition-colors ${nodeType.color} text-left`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{nodeType.icon}</span>
                <span className="font-semibold text-sm">{nodeType.label}</span>
              </div>
              <div className="text-xs text-gray-600">{nodeType.description}</div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs text-blue-800">
          <strong>Tip:</strong> Click on a node to add it to the canvas, then connect nodes by dragging from output to input ports.
        </div>
      </div>
    </div>
  );
}
