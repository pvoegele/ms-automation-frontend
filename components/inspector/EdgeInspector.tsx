'use client';

import { Edge } from 'reactflow';
import { EdgeConfig } from '@/types/flow';
import useFlowStore from '@/lib/store/flowStore';

interface EdgeInspectorProps {
  edge: Edge<EdgeConfig>;
}

export default function EdgeInspector({ edge }: EdgeInspectorProps) {
  const { updateEdgeData } = useFlowStore();

  const handleStoreEmailChange = (storeEmail: boolean) => {
    updateEdgeData(edge.id, { storeEmail });
  };

  const handleStoreAttachmentsChange = (storeAttachments: boolean) => {
    updateEdgeData(edge.id, { storeAttachments });
  };

  const handlePathTemplateChange = (pathTemplate: string) => {
    updateEdgeData(edge.id, { pathTemplate });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Storage Options</h3>
        
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={edge.data?.storeEmail ?? true}
            onChange={(e) => handleStoreEmailChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Store Email (.eml/.msg)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={edge.data?.storeAttachments ?? false}
            onChange={(e) => handleStoreAttachmentsChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Store Attachments</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Path Template</label>
        <input
          type="text"
          value={edge.data?.pathTemplate || '/{mailbox}/{yyyy}/{MM}/{from}/'}
          onChange={(e) => handlePathTemplateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          placeholder="/{mailbox}/{yyyy}/{MM}/{from}/"
        />
        <div className="text-xs text-gray-500 mt-1">
          Available variables: {'{mailbox}'}, {'{yyyy}'}, {'{MM}'}, {'{dd}'}, {'{from}'}, {'{subject}'}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="text-xs text-blue-800">
          <strong>Example:</strong> <br />
          <code className="text-xs">/{'{mailbox}'}/{'{yyyy}'}/{'{MM}'}/{'{from}'}/</code>
          <br />
          becomes:
          <br />
          <code className="text-xs">/work@company.com/2024/02/client@example.com/</code>
        </div>
      </div>
    </div>
  );
}
