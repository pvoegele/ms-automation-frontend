'use client';

import { useState } from 'react';
import useFlowStore from '@/lib/store/flowStore';
import { saveFlow } from '@/lib/firebase/firestore';
import Link from 'next/link';

export default function FlowToolbar() {
  const { 
    flowName, 
    flowEnabled, 
    flowId,
    nodes, 
    edges,
    setFlowName,
    setFlowEnabled,
    setFlowId,
  } = useFlowStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showHealth, setShowHealth] = useState(false);

  const validateFlow = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check for at least one mailbox and one onedrive
    const hasMailbox = nodes.some(n => n.type === 'mailbox');
    const hasOneDrive = nodes.some(n => n.type === 'onedrive');
    
    if (!hasMailbox) errors.push('Flow needs at least one Mailbox node');
    if (!hasOneDrive) errors.push('Flow needs at least one OneDrive node');
    
    // Check all nodes are configured
    const unconfiguredNodes = nodes.filter(n => !n.data.configured);
    if (unconfiguredNodes.length > 0) {
      errors.push(`${unconfiguredNodes.length} node(s) not fully configured`);
    }
    
    // Check for connections
    if (edges.length === 0 && nodes.length > 1) {
      errors.push('No connections between nodes');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock user ID for demo
      const userId = 'demo_user';
      
      const savedFlowId = await saveFlow(userId, {
        id: flowId || undefined,
        name: flowName,
        enabled: flowEnabled,
        nodes,
        edges,
      });
      
      if (!flowId) {
        setFlowId(savedFlowId);
      }
      
      alert('Flow saved successfully!');
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('Error saving flow. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = () => {
    const validation = validateFlow();
    
    if (!validation.isValid) {
      alert('Cannot activate flow:\n' + validation.errors.join('\n'));
      return;
    }
    
    setFlowEnabled(!flowEnabled);
    alert(flowEnabled ? 'Flow deactivated' : 'Flow activated!');
  };

  const handleTest = () => {
    const validation = validateFlow();
    
    if (!validation.isValid) {
      alert('Cannot test flow:\n' + validation.errors.join('\n'));
      return;
    }
    
    alert('Test run simulated! In production, this would:\n- Verify OAuth tokens\n- Test OneDrive access\n- Write test file to target folder');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back
        </Link>
        
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md font-medium"
          placeholder="Flow name"
        />
        
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              flowEnabled ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {flowEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowHealth(!showHealth)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition-colors"
        >
          Health
        </button>
        
        <button
          onClick={handleTest}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          Test Run
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        
        <button
          onClick={handleActivate}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            flowEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {flowEnabled ? 'Deactivate' : 'Activate'}
        </button>
      </div>
      
      {showHealth && (
        <div className="absolute top-14 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64 z-50">
          <h3 className="font-semibold mb-2">Flow Health</h3>
          <div className="text-sm space-y-1">
            <div>Last Run: <span className="text-gray-600">Never</span></div>
            <div>Total Runs: <span className="text-gray-600">0</span></div>
            <div>Success Rate: <span className="text-gray-600">N/A</span></div>
            <div>Last Error: <span className="text-gray-600">None</span></div>
          </div>
          <button
            onClick={() => setShowHealth(false)}
            className="mt-3 w-full px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
