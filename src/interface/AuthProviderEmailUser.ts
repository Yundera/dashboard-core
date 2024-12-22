export interface AuthProviderEmailUser {
  login(params: { username: string; password: string }): Promise<any>;

  registerUser(email: string, password: string): Promise<any>;

  deleteAccount(currentPassword: string): Promise<void>;

  updatePassword(newPassword: string): Promise<void>;

  sendResetPasswordMail(email: string): Promise<void>;

  updateEmail(email: string, currentPassword: string): Promise<void>;
}