import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { CustomNodeData, EdgeConfig, MailboxConnection, OneDriveConnection, FlowHealth } from '@/types/flow';

interface FlowStore {
  // React Flow state
  nodes: Node<CustomNodeData>[];
  edges: Edge<EdgeConfig>[];
  selectedNode: Node<CustomNodeData> | null;
  selectedEdge: Edge<EdgeConfig> | null;
  
  // Flow metadata
  flowId: string | null;
  flowName: string;
  flowEnabled: boolean;
  
  // Connections
  mailboxConnections: MailboxConnection[];
  oneDriveConnections: OneDriveConnection[];
  
  // Health status
  flowHealth: FlowHealth | null;
  
  // Actions
  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  setEdges: (edges: Edge<EdgeConfig>[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<CustomNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void;
  selectNode: (node: Node<CustomNodeData> | null) => void;
  selectEdge: (edge: Edge<EdgeConfig> | null) => void;
  updateEdgeData: (edgeId: string, data: Partial<EdgeConfig>) => void;
  
  // Flow management
  setFlowId: (id: string) => void;
  setFlowName: (name: string) => void;
  setFlowEnabled: (enabled: boolean) => void;
  loadFlowState: (flowId: string, flowName: string, nodes: Node[], edges: Edge[], enabled: boolean) => void;
  resetFlow: () => void;
  
  // Connections management
  setMailboxConnections: (connections: MailboxConnection[]) => void;
  setOneDriveConnections: (connections: OneDriveConnection[]) => void;
  addMailboxConnection: (connection: MailboxConnection) => void;
  addOneDriveConnection: (connection: OneDriveConnection) => void;
  
  // Health
  setFlowHealth: (health: FlowHealth) => void;
}

const useFlowStore = create<FlowStore>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  flowId: null,
  flowName: 'Untitled Flow',
  flowEnabled: false,
  mailboxConnections: [],
  oneDriveConnections: [],
  flowHealth: null,
  
  // React Flow actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    const edge = {
      ...connection,
      type: 'default',
      data: {
        storeEmail: true,
        storeAttachments: false,
        pathTemplate: '/{mailbox}/{yyyy}/{MM}/{from}/',
      } as EdgeConfig,
    };
    
    set({
      edges: addEdge(edge, get().edges),
    });
  },
  
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter(n => n.id !== nodeId),
      edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    });
  },
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map(node => 
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as CustomNodeData }
          : node
      ),
    });
  },
  
  selectNode: (node) => {
    set({ selectedNode: node, selectedEdge: null });
  },
  
  selectEdge: (edge) => {
    set({ selectedEdge: edge, selectedNode: null });
  },
  
  updateEdgeData: (edgeId, data) => {
    set({
      edges: get().edges.map(edge =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, ...data } as EdgeConfig }
          : edge
      ),
    });
  },
  
  // Flow management
  setFlowId: (id) => set({ flowId: id }),
  setFlowName: (name) => set({ flowName: name }),
  setFlowEnabled: (enabled) => set({ flowEnabled: enabled }),
  
  loadFlowState: (flowId, flowName, nodes, edges, enabled) => {
    set({
      flowId,
      flowName,
      nodes,
      edges,
      flowEnabled: enabled,
      selectedNode: null,
      selectedEdge: null,
    });
  },
  
  resetFlow: () => {
    set({
      flowId: null,
      flowName: 'Untitled Flow',
      nodes: [],
      edges: [],
      flowEnabled: false,
      selectedNode: null,
      selectedEdge: null,
    });
  },
  
  // Connections management
  setMailboxConnections: (connections) => set({ mailboxConnections: connections }),
  setOneDriveConnections: (connections) => set({ oneDriveConnections: connections }),
  addMailboxConnection: (connection) => {
    set({ mailboxConnections: [...get().mailboxConnections, connection] });
  },
  addOneDriveConnection: (connection) => {
    set({ oneDriveConnections: [...get().oneDriveConnections, connection] });
  },
  
  // Health
  setFlowHealth: (health) => set({ flowHealth: health }),
}));

export default useFlowStore;
