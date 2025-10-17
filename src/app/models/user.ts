export interface User {
      _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  code: string;
  codeExpiresAt: string;
  resetPasswordExpires: string | null;
  resetPasswordToken: string | null;
}
