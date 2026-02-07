'use client';

import { Node } from 'reactflow';
import { MailboxNodeData } from '@/types/flow';
import useFlowStore from '@/lib/store/flowStore';

interface MailboxInspectorProps {
  node: Node<MailboxNodeData>;
}

export default function MailboxInspector({ node }: MailboxInspectorProps) {
  const { updateNodeData, deleteNode } = useFlowStore();

  const handleProviderChange = (provider: 'microsoft365' | 'gmail' | 'imap') => {
    updateNodeData(node.id, { provider });
  };

  const handleLabelChange = (label: string) => {
    updateNodeData(node.id, { label });
  };

  const handleEmailChange = (email: string) => {
    updateNodeData(node.id, { email });
  };

  const handleConnect = () => {
    // Simulate OAuth connection
    updateNodeData(node.id, {
      authStatus: 'authorized',
      configured: true,
      connectionId: `mailbox_${Date.now()}`,
    });
    alert('OAuth connection simulated! In production, this would open OAuth flow.');
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
          placeholder="My Mailbox"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Provider</label>
        <select
          value={node.data.provider}
          onChange={(e) => handleProviderChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="microsoft365">Microsoft 365</option>
          <option value="gmail">Gmail (Coming soon)</option>
          <option value="imap">IMAP (Coming soon)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          value={node.data.email || ''}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="user@example.com"
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

      <button
        onClick={handleConnect}
        disabled={node.data.provider !== 'microsoft365'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        {node.data.authStatus === 'authorized' ? 'Reconnect' : 'Connect Mailbox'}
      </button>

      <button
        onClick={() => deleteNode(node.id)}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Delete Node
      </button>
    </div>
  );
}
