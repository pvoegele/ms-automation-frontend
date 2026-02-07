import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { OneDriveNodeData } from '@/types/flow';

function OneDriveNode({ data, selected }: NodeProps<OneDriveNodeData>) {
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
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <div className="font-semibold text-sm">OneDrive</div>
      </div>
      <div className="font-medium text-sm">{data.label}</div>
      {data.folderPath && (
        <div className="text-xs text-gray-500 mt-1 break-all">{data.folderPath}</div>
      )}
    </div>
  );
}

export default memo(OneDriveNode);
