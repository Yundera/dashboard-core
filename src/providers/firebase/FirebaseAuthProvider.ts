import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updatePassword,
  verifyBeforeUpdateEmail
} from "firebase/auth";


// Initialize Firebase
import {
  ExtendedAuthProviderInterface
} from '../../interface/ExtendedAuthProviderInterface';
import axios from "axios";
import {doc, getDoc, getFirestore} from 'firebase/firestore';
import {initFirebase} from "./FirebaseProvider";
import {ExtendedUserIdentity} from "../../interface/ExtendedUserIdentity";
import {USERS_RESOURCE} from "../../core/UsersResource";
import {FirebaseApp} from "firebase/app";
import {getConfig} from "../../core/configuration/getConfigFrontEnd";

let authProvider: ExtendedAuthProviderInterface;

function buildApiUrl(endpoint: string): string {
  const basePath = getConfig("BASE_PATH") || "/";
  return `${basePath.endsWith("/") ? basePath : basePath + "/"}${endpoint}`;
}

class FirebaseAuthProvider implements ExtendedAuthProviderInterface {
  app: FirebaseApp;

  private async getApp() {
    if (!this.app) {
      this.app = await initFirebase();
    }
    return this.app;
  }

  async login(params: { username: string; password: string }): Promise<any> {
    await this.getApp();
    await signInWithEmailAndPassword(getAuth(), params.username, params.password);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user is currently signed in.");
    }
  }

  async registerUser(email: string, password: string) {
    await this.getApp();
    const response = await axios.post(buildApiUrl("api/core/user/create"), {
      email,
      password
    });
    if (response.status != 200) {
      throw new Error(response.data.error);
    }
  }

  async getPermissions(): Promise<any> {
    return this.listPermissions();
  }

  async listPermissions(): Promise<Record<string, boolean>> {
    try {
      await this.getApp();
      const auth = getAuth();
      await auth.authStateReady();
      const user = auth.currentUser;

      if (!user || !user.email) {
        return {}; //no permissions
      }

      const response = await axios.post(buildApiUrl("api/core/user/permission"), {}, {
        headers: {
          Authorization: `Bearer ${await this.getIdToken()}`
        }
      });
      if (response.status != 200) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async hasPermission(permission: string): Promise<boolean> {
    try {
      await this.getApp();
      const permissions = await this.listPermissions() as Record<string, any>;
      return !!permissions[permission];
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async sendResetPasswordMail(email: string) {
    await this.getApp();
    const response = await axios.post(buildApiUrl("api/core/user/reset"), {
      email,
    });
    if (response.status != 200) {
      throw new Error(response.data.error);
    }
  }

  async deleteAccount(currentPassword: string) {
    await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No user is currently signed in.");
    }

    try {
      // Create credential with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);
      const response = await axios.post(buildApiUrl("api/core/user/delete"), {}, {
        headers: {
          Authorization: `Bearer ${await this.getIdToken()}`
        }
      });
      if (response.status != 200) {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        throw new Error("Incorrect password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("Too many attempts. Please try again later.");
      } else {
        throw new Error(error.message || "Failed to delete account.");
      }
    }
  }

  async updatePassword(newPassword: string) {
    await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    console.log("user", user);
    if (user) {
      return await updatePassword(user, newPassword);
    } else {
      throw new Error("No user is currently signed in.");
    }
  }

  async updateEmail(email: string, currentPassword: string) {
    await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, email);
      // Send verification email
      await sendEmailVerification(user);
    } else {
      throw new Error("No user is currently signed in.");
    }
  }

  async getIdToken(): Promise<string> {
    await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (user) {
      return user.getIdToken(true);
    } else {
      return "anonymous";
    }
  }

  async getIdentity(): Promise<ExtendedUserIdentity> {
    const app = await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
    const db = getFirestore(app);
    const docRef = doc(db, USERS_RESOURCE, user.uid);
    const docSnap = await getDoc(docRef);

    return {
      id: user.uid,
      email: user.email || "",
      emailVerified: user.emailVerified,
      fullName: docSnap.get("first_name"),
      avatar: docSnap.get("avatar"),
    };
  }

  async checkAuth(): Promise<void> {
    await this.getApp();
    const auth = getAuth();
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
  }

  async checkError(error: any): Promise<void> {
    console.error(error);
  }

  async logout(): Promise<void> {
    await this.getApp();
    const auth = getAuth();
    await auth.signOut();
  }
}

export const getAuthProvider: () => Promise<ExtendedAuthProviderInterface> = async () => {
  if (typeof window === 'undefined') {
    // Return a dummy provider for SSR
    return {} as ExtendedAuthProviderInterface;
  }
  if (!authProvider) {
    authProvider = new FirebaseAuthProvider();
  }

  return authProvider;
}