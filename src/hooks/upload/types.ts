export type SlateType = "substrate" | "fishInverts";

export interface FileUploadState {
  type: SlateType;
  file: File | null;
  error: string | null;
  setFile: (file: File) => void;
  clearFile: () => void;
}

export interface Row {
  substrate: FileUploadState;
  fishInverts: FileUploadState;
}
