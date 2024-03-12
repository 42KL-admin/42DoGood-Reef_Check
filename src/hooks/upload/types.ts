export type SlateType = "substrate" | "fishInverts";

export type SlateRecognitionStatus =
  | "recognized"
  | "failed"
  | "unknown"
  | "processing";

export interface SlateState {
  type: SlateType;
  file: File | null;
  status: SlateRecognitionStatus;
}

export interface Row {
  substrate: SlateState;
  fishInverts: SlateState;
}
