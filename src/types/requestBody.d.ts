declare namespace RequestBody {
  interface UploadTemplateFromBlobStorage {
    blobUrl: string;
    method: string;
    customHeader?: HeadersInit;
  }
}
