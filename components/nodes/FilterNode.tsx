import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FilterNodeData } from '@/types/flow';

function FilterNode({ data, selected }: NodeProps<FilterNodeData>) {
  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg border-2 bg-white min-w-[180px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="font-semibold text-sm">Filter/Rule</div>
      </div>
      <div className="font-medium text-sm">{data.label}</div>
      {data.rules && data.rules.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {data.rules.length} rule(s)
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
}

export default memo(FilterNode);
