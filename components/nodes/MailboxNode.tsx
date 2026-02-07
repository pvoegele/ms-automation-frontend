import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MailboxNodeData } from '@/types/flow';

function MailboxNode({ data, selected }: NodeProps<MailboxNodeData>) {
  const getStatusColor = () => {
    if (data.authStatus === 'authorized') return 'bg-green-500';
    if (data.authStatus === 'error') return 'bg-red-500';
    return 'bg-gray-400';
  };

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg border-2 bg-white min-w-[200px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <div className="font-semibold text-sm">Mailbox</div>
      </div>
      <div className="text-xs text-gray-600 mb-1">{data.provider}</div>
      <div className="font-medium text-sm">{data.label}</div>
      {data.email && <div className="text-xs text-gray-500 mt-1">{data.email}</div>}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
}

export default memo(MailboxNode);
