export type SlateType = "substrate" | "fishInverts";

export type SlateRecognitionStatus =
  | "recognized"
  | "failed"
  | "unknown"
  | "processing";

export interface SlateState {
  id: string;
  type: SlateType;
  file: File | null;
  base64: string;
  status: SlateRecognitionStatus;
}

export interface Row {
  substrate: SlateState;
  fishInverts: SlateState;
}
