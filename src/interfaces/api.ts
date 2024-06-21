export interface File {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
}

export interface UploadFilesRequest {
  files: File[];
}

export interface UploadFilesResponse {
  filename: string;
  status: 'success' | 'failed';
  error?: Error;
}