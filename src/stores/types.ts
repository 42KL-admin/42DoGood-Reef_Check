// Type of the slate
export type SlateType = "substrate" | "fishInverts";

// Recognition Status (OCR)
export type SlateRecognitionStatus =
  | "recognized"
  | "failed"
  | "unknown"
  | "processing";

  export type EmailPermission = 
  | "can edit"
  | "admin";

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
export type EmailRow = {
  email: string;
  permission: EmailPermission;
};