# Dashboard Core

A modular dashboard library for Next.js applications with Firebase integration.

## Overview

Dashboard Core is a source library module that provides core dashboard functionality including API handling, authentication, and database integration. This library must be compiled within the parent project and cannot be used as a standalone package.

## Prerequisites

- Next.js application
- Firebase project with:
    - Authentication (Email/Password)
    - Firestore Database
    - Storage service account

## Installation

### 1. Next.js Configuration

Add the following configuration to your `next.config.js` file:

```javascript
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['dashboard-core'],
  /* config options here */
  typescript: {
    // WARNING: This allows production builds to successfully complete even if
    // your project has type errors. Use this option with caution.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
```

### 2. API Route Setup

Create the API handler file at `src/pages/api/core/[[...path]].ts`:

```typescript
// pages/api/core/[[...path]].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { coreApiHandler } from "dashboard-core/backend/CoreApiHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return coreApiHandler(req, res);
}
```

### 3. Firebase Setup

#### Prerequisites
1. Set up Firebase Authentication with Email/Password provider
2. Create a Firestore Database
3. Obtain the following files:
    - `storage-account.json` - Service account credentials
    - `integration.json` - Integration configuration

#### Firestore Security Rules

Apply the following security rules to your Firestore database:

```javascript
// https://firebase.google.com/docs/rules/rules-language
// when you change this rule file, you need to deploy it to firebase and save it in the backend repo
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // General user document rules
    match /users/{userId} {
      // Allow read and write access to the owner of the document
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // General user document rules
    match /permissions/{userId} {
      // readonly
      allow read;
    }

  }
}
```

## Configuration

### Environment Variables

Ensure the following environment variables are configured in your project:

```bash
NEXT_PUBLIC_BASE_PATH=your_base_path_here
# Add other required environment variables
```

### Firebase Configuration

Place your Firebase configuration files in the appropriate directory:
- `storage-account.json`
- `integration.json`

## Usage

Once configured, the dashboard core module will be available throughout your Next.js application. The API routes will be accessible at `/api/core/*` endpoints.

## Important Notes

- **Compilation Required**: This is a source library that must be compiled within your parent project
- **TypeScript Errors**: The configuration includes `ignoreBuildErrors: true` - use with caution in production
- **Security Rules**: Remember to deploy Firestore rules changes to Firebase and save them in your backend repository
- **Authentication**: Users can only access their own documents in the `/users/{userId}` collection
- **Permissions**: The `/permissions/{userId}` collection is read-only for all authenticated users

## Troubleshooting

### Common Issues

1. **Compilation Errors**: Ensure `dashboard-core` is included in `transpilePackages`
2. **API Route Not Found**: Verify the API route file is placed correctly at `src/pages/api/core/[[...path]].ts`
3. **Firebase Authentication**: Confirm Email/Password provider is enabled in Firebase Console
4. **Firestore Rules**: Ensure security rules are properly deployed to Firebase

## Contributing

When making changes to Firestore security rules:
1. Update the rules in Firebase Console
2. Test the changes thoroughly
3. Save the updated rules in the backend repository
4. Document any changes in your commit messages

## Support

For issues and questions related to this library, please refer to the project documentation or create an issue in the repository.