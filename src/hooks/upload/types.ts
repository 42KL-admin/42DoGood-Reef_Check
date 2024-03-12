export type SlateType = "substrate" | "fishInverts";

export interface SlateState {
  type: SlateType;
  file: File | null;
  error: string | null;
}

export interface Row {
  substrate: SlateState;
  fishInverts: SlateState;
}
