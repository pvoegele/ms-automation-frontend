'use client';

import { useState } from 'react';
import { Node } from 'reactflow';
import { OneDriveNodeData } from '@/types/flow';
import useFlowStore from '@/lib/store/flowStore';

interface OneDriveInspectorProps {
  node: Node<OneDriveNodeData>;
}

export default function OneDriveInspector({ node }: OneDriveInspectorProps) {
  const { updateNodeData, deleteNode } = useFlowStore();
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  const handleLabelChange = (label: string) => {
    updateNodeData(node.id, { label });
  };

  const handleConnect = () => {
    // Simulate OAuth connection
    updateNodeData(node.id, {
      authStatus: 'authorized',
      configured: false, // Still needs folder selection
      driveId: `drive_${Date.now()}`,
    });
    alert('OAuth connection simulated! In production, this would open OAuth flow.');
  };

  const handleFolderSelect = (folderPath: string) => {
    updateNodeData(node.id, {
      folderPath,
      folderId: `folder_${Date.now()}`,
      configured: true,
    });
    setShowFolderPicker(false);
  };

  // Mock folder data
  const mockFolders = [
    '/Documents',
    '/Documents/Work',
    '/Documents/Personal',
    '/EmailArchive',
    '/EmailArchive/2024',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input
          type="text"
          value={node.data.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="My OneDrive"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Connection Status</label>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              node.data.authStatus === 'authorized'
                ? 'bg-green-500'
                : node.data.authStatus === 'error'
                ? 'bg-red-500'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-sm">
            {node.data.authStatus === 'authorized'
              ? 'Connected'
              : node.data.authStatus === 'error'
              ? 'Error'
              : 'Not connected'}
          </span>
        </div>
      </div>

      {!node.data.authStatus || node.data.authStatus !== 'authorized' ? (
        <button
          onClick={handleConnect}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Connect OneDrive
        </button>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Target Folder</label>
            <div className="text-sm text-gray-600 mb-2">
              {node.data.folderPath || 'No folder selected'}
            </div>
            <button
              onClick={() => setShowFolderPicker(!showFolderPicker)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
            >
              {node.data.folderPath ? 'Change Folder' : 'Select Folder'}
            </button>
          </div>

          {showFolderPicker && (
            <div className="border border-gray-300 rounded-md p-2 max-h-48 overflow-y-auto">
              <div className="text-sm font-medium mb-2">Available Folders:</div>
              {mockFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => handleFolderSelect(folder)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                >
                  📁 {folder}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={() => deleteNode(node.id)}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Delete Node
      </button>
    </div>
  );
}
