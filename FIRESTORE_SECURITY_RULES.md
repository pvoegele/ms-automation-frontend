# Firestore Security Rules

This document provides the security rules that should be configured in your Firebase project to secure the data for this application.

## Security Rules Configuration

Navigate to Firebase Console → Firestore Database → Rules and apply the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - only accessible by the user themselves
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Mailbox connections - user can only access their own connections
    match /connections/{userId}/mailboxes/{mailboxId} {
      allow read, write: if isOwner(userId);
    }
    
    // OneDrive connections - user can only access their own connections
    match /connections/{userId}/onedrives/{driveId} {
      allow read, write: if isOwner(userId);
    }
    
    // Flows - user can only access their own flows
    match /flows/{userId}/flows/{flowId} {
      allow read, write: if isOwner(userId);
    }
    
    // Flow runs - authenticated users can read and write runs
    // In production, you may want to restrict writes to server-side only
    match /flowRuns/{flowId}/runs/{runId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      // For production, consider:
      // allow write: if false; // Only allow server-side writes
    }
  }
}
```

## Security Considerations

### 1. Authentication Required
All operations require user authentication. Anonymous access is not allowed.

### 2. User Isolation
Each user can only access their own data:
- Connections (mailboxes and OneDrive)
- Flows
- User profile data

### 3. Flow Runs
Currently, authenticated users can read and write flow runs. In production, consider:
- Restricting writes to server-side only using Firebase Admin SDK
- Adding more granular permissions based on flow ownership

### 4. Audit Logging
For production deployments, consider implementing:
- Cloud Functions triggers for logging changes
- Monitoring for suspicious activities
- Rate limiting to prevent abuse

## Testing Security Rules

You can test these rules in the Firebase Console:

1. Go to Firestore Database → Rules
2. Click on "Rules Playground"
3. Test various operations with different user IDs

Example tests:
```javascript
// Should succeed
Operation: get
Path: /flows/user123/flows/flow456
Auth: { uid: 'user123' }

// Should fail
Operation: get
Path: /flows/user123/flows/flow456
Auth: { uid: 'user999' }
```

## Data Structure

### Collections Hierarchy

```
/users/{userId}
  - User profile data

/connections/{userId}/mailboxes/{mailboxId}
  - provider: string
  - displayName: string
  - email: string
  - authRef: string
  - createdAt: timestamp
  - status: string

/connections/{userId}/onedrives/{driveId}
  - tenantId: string
  - driveId: string
  - driveName: string
  - folderPath: string
  - folderId: string
  - authRef: string
  - createdAt: timestamp
  - status: string

/flows/{userId}/flows/{flowId}
  - name: string
  - enabled: boolean
  - nodes: array
  - edges: array
  - updatedAt: timestamp
  - createdAt: timestamp

/flowRuns/{flowId}/runs/{runId}
  - flowId: string
  - startedAt: timestamp
  - endedAt: timestamp
  - stats: object
  - error: string
  - status: string
```

## Production Recommendations

### 1. Token Management
- Never store OAuth tokens in Firestore
- Use Firebase Functions with Secret Manager for token refresh
- Implement short-lived tokens with automatic refresh

### 2. Rate Limiting
```javascript
// Add to security rules
function rateLimitCheck() {
  return request.time > resource.data.lastWrite + duration.value(1, 's');
}
```

### 3. Field Validation
Add validation for specific fields:
```javascript
match /flows/{userId}/flows/{flowId} {
  allow write: if isOwner(userId) 
    && request.resource.data.name is string
    && request.resource.data.name.size() > 0
    && request.resource.data.name.size() < 100
    && request.resource.data.enabled is bool;
}
```

### 4. Server-Side Operations
For sensitive operations, use Firebase Admin SDK on the server:
- Token refresh and storage
- Flow execution triggers
- Email processing
- Quota management

## Setup Instructions

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Apply the security rules provided above
4. Enable Authentication (Email/Password or Google Sign-In)
5. Update `.env.local` with your Firebase configuration

## Support

For issues with Firestore security rules, refer to:
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
