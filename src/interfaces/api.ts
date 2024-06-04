export interface File {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
}

export interface UploadFilesRequest {
  sasToken: string;
  files: File[];
}