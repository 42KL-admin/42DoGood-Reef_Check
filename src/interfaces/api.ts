import { SlateUploadItem } from "@/stores/types";

export interface File {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
}

export interface UploadFilesReceivedItem {
  id?: string;
  file?: File;
}

export interface UploadFilesRequest {
  items: UploadFilesReceivedItem[];
}

export interface UploadFilesResponse {
  id: string;
  filename: string;
  status: 'success' | 'failed';
  error?: Error;
}