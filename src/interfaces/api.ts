export interface File {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
}

export interface UploadFilesRequest {
  files: File[];
}