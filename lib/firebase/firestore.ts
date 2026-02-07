import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Flow, MailboxConnection, OneDriveConnection, FlowRun } from '@/types/flow';

// Helper to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Flow operations
export async function saveFlow(userId: string, flow: Partial<Flow>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const flowId = flow.id || doc(collection(db, 'flows')).id;
  const flowRef = doc(db, 'flows', userId, 'flows', flowId);
  
  const flowData = {
    ...flow,
    id: flowId,
    updatedAt: serverTimestamp(),
    createdAt: flow.createdAt || serverTimestamp(),
  };
  
  await setDoc(flowRef, flowData, { merge: true });
  return flowId;
}

export async function loadFlow(userId: string, flowId: string): Promise<Flow | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const flowRef = doc(db, 'flows', userId, 'flows', flowId);
  const flowSnap = await getDoc(flowRef);
  
  if (!flowSnap.exists()) {
    return null;
  }
  
  const data = flowSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Flow;
}

export async function loadFlows(userId: string): Promise<Flow[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const flowsRef = collection(db, 'flows', userId, 'flows');
  const flowsSnap = await getDocs(flowsRef);
  
  return flowsSnap.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Flow;
  });
}

export async function deleteFlow(userId: string, flowId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const flowRef = doc(db, 'flows', userId, 'flows', flowId);
  await deleteDoc(flowRef);
}

// Mailbox connection operations
export async function saveMailboxConnection(
  userId: string, 
  connection: Partial<MailboxConnection>
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const connId = connection.id || doc(collection(db, 'connections')).id;
  const connRef = doc(db, 'connections', userId, 'mailboxes', connId);
  
  const connData = {
    ...connection,
    id: connId,
    createdAt: connection.createdAt || serverTimestamp(),
  };
  
  await setDoc(connRef, connData, { merge: true });
  return connId;
}

export async function loadMailboxConnections(userId: string): Promise<MailboxConnection[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const connRef = collection(db, 'connections', userId, 'mailboxes');
  const connSnap = await getDocs(connRef);
  
  return connSnap.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as MailboxConnection;
  });
}

// OneDrive connection operations
export async function saveOneDriveConnection(
  userId: string,
  connection: Partial<OneDriveConnection>
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const connId = connection.id || doc(collection(db, 'connections')).id;
  const connRef = doc(db, 'connections', userId, 'onedrives', connId);
  
  const connData = {
    ...connection,
    id: connId,
    createdAt: connection.createdAt || serverTimestamp(),
  };
  
  await setDoc(connRef, connData, { merge: true });
  return connId;
}

export async function loadOneDriveConnections(userId: string): Promise<OneDriveConnection[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const connRef = collection(db, 'connections', userId, 'onedrives');
  const connSnap = await getDocs(connRef);
  
  return connSnap.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as OneDriveConnection;
  });
}

// Flow run operations
export async function createFlowRun(flowId: string, run: Partial<FlowRun>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const runId = doc(collection(db, 'flowRuns')).id;
  const runRef = doc(db, 'flowRuns', flowId, 'runs', runId);
  
  const runData = {
    ...run,
    id: runId,
    flowId,
    startedAt: serverTimestamp(),
  };
  
  await setDoc(runRef, runData);
  return runId;
}

export async function updateFlowRun(
  flowId: string,
  runId: string,
  updates: Partial<FlowRun>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const runRef = doc(db, 'flowRuns', flowId, 'runs', runId);
  await updateDoc(runRef, updates);
}

export async function loadFlowRuns(flowId: string, limit = 10): Promise<FlowRun[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const runsRef = collection(db, 'flowRuns', flowId, 'runs');
  const runsSnap = await getDocs(query(runsRef));
  
  const runs = runsSnap.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      startedAt: timestampToDate(data.startedAt),
      endedAt: data.endedAt ? timestampToDate(data.endedAt) : undefined,
    } as FlowRun;
  });
  
  // Sort by startedAt descending and limit
  return runs
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    .slice(0, limit);
}
