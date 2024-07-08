declare namespace RequestBody {
  interface UploadTemplateFromBlobStorage {
    blobUrl: string;
    method: string;
    customHeader?: HeadersInit;
  }
  interface OcrProcessUrl {
    apiUrl: string;
    method: string;
    header: HeadersInit;
  }
}
