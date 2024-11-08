This is a direct src lib module, the file must be compiled in the parent project
# 1
```bash

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

```

# 2
you also need to add the following to the src/pages/api/core/[[path]].ts file
```typescript
// pages/api/core/[[...path]].ts
import { NextApiRequest, NextApiResponse } from 'next';
import {coreApiHandler} from "dashboard-core/backend/CoreApiHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return coreApiHandler(req, res);
}
    
```

# 3
Setup firebase
1 - Authentication email/password
2 - Firestore database
3 - Get a storage account.json and integration.json
```bash
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
