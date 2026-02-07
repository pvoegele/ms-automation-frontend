// Node types for React Flow
export type NodeType = 'mailbox' | 'onedrive' | 'filter' | 'transform';

export interface BaseNodeData {
  label: string;
  configured: boolean;
  status?: 'idle' | 'connected' | 'error';
}

export interface MailboxNodeData extends BaseNodeData {
  type: 'mailbox';
  provider: 'microsoft365' | 'gmail' | 'imap';
  email?: string;
  connectionId?: string;
  authStatus?: 'pending' | 'authorized' | 'error';
}

export interface OneDriveNodeData extends BaseNodeData {
  type: 'onedrive';
  driveId?: string;
  folderPath?: string;
  folderId?: string;
  authStatus?: 'pending' | 'authorized' | 'error';
}

export interface FilterNodeData extends BaseNodeData {
  type: 'filter';
  rules?: FilterRule[];
}

export interface FilterRule {
  field: 'subject' | 'from' | 'to' | 'date';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
}

export interface TransformNodeData extends BaseNodeData {
  type: 'transform';
  operations?: TransformOperation[];
}

export interface TransformOperation {
  type: 'rename' | 'addPrefix' | 'addSuffix';
  value: string;
}

export type CustomNodeData = MailboxNodeData | OneDriveNodeData | FilterNodeData | TransformNodeData;

// Edge configuration
export interface EdgeConfig {
  storeEmail: boolean;
  storeAttachments: boolean;
  pathTemplate?: string;
}

// Firestore data models
export interface MailboxConnection {
  id: string;
  provider: string;
  displayName: string;
  email: string;
  authRef: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'error';
  lastError?: string;
}

export interface OneDriveConnection {
  id: string;
  tenantId: string;
  driveId: string;
  driveName: string;
  folderPath: string;
  folderId: string;
  authRef: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'error';
  lastError?: string;
}

export interface Flow {
  id: string;
  name: string;
  enabled: boolean;
  nodes: any[]; // React Flow nodes
  edges: any[]; // React Flow edges with EdgeConfig in data
  updatedAt: Date;
  createdAt: Date;
}

export interface FlowRun {
  id: string;
  flowId: string;
  startedAt: Date;
  endedAt?: Date;
  stats: {
    emailsProcessed: number;
    attachmentsStored: number;
    errors: number;
  };
  error?: string;
  status: 'running' | 'completed' | 'failed';
}

export interface FlowHealth {
  lastRunAt?: Date;
  lastError?: string;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
}
