import {PERMISSION_RESOURCE} from "../../core/UsersResource";
import {admin} from "./FirebaseAdminApi";

export async function addPermission(uid: string, permissionKey: string): Promise<void> {
  const docRef = admin.firestore()
  .collection(PERMISSION_RESOURCE)
  .doc(uid);

  // Check if document exists
  const doc = await docRef.get();

  if (!doc.exists) {
    // If document doesn't exist, create it with initial permission structure
    await docRef.set({
      permission: {
        [permissionKey]: true
      }
    });
  } else {
    // If document exists, update it
    await docRef.update({
      [`permission.${permissionKey}`]: true
    });
  }
}

export async function removePermission(uid: string, permissionKey: string): Promise<void> {
  const docRef = admin.firestore()
  .collection(PERMISSION_RESOURCE)
  .doc(uid);

  // Check if document exists
  const doc = await docRef.get();
  if (!doc.exists) {
    return; //nothing to update
  }

  // Proceed with update if document exists
  await docRef.update({
    [`permission.${permissionKey}`]: admin.firestore.FieldValue.delete()
  });
}

export async function hasPermission(uid: string, permissionKey: string): Promise<boolean> {
  const doc = await admin.firestore()
  .collection(PERMISSION_RESOURCE)
  .doc(uid)
  .get();

  return doc.exists && !!doc.data()?.permission[permissionKey];
}

export async function getPermissions(uid: string): Promise<Record<string, any>> {
  const doc = await admin.firestore()
  .collection(PERMISSION_RESOURCE)
  .doc(uid)
  .get();

  return doc.exists ? doc.data()?.permission : {};
}