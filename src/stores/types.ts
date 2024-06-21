// Type of the slate
export type SlateType = "substrate" | "fishInverts";

// Recognition Status (OCR)
export type SlateRecognitionStatus =
  | "recognized"
  | "failed"
  | "unknown"
  | "processing"
  | "not processed";

export type EmailRole =
  | 'can edit'
  | 'admin';

// Each individual slate's state
export interface SlateState {
  type: SlateType;
  file: File | null;
  base64: string;
  status: SlateRecognitionStatus;
}

// Each individual row
export type FileRow = {
  id: string;
  substrate: SlateState;
  fishInverts: SlateState;
};

// Each individual roww
export interface EmailRow {
  email: string;
  role: EmailRole;
}

// NOTE: Maybe can just use EmailRole for the User's role
export type UserRole =
  | 'admin'
  | 'user';

export interface LoggedUser {
  // sessionId: string;
  email: string;
  role: UserRole;
  isOTPVerified: boolean;
}

export interface SlateUploadItem {
  id: string;
  file: File;
}

export interface UploadFilesResponse {
  id: string;
  filename: string;
  status: 'success' | 'failed';
  error?: Error;
}