declare module 'multiparty' {
    import { IncomingMessage } from 'http';
  
    interface Part {
      headers: { [key: string]: string };
      byteCount: number;
      byteOffset: number;
      hwm: number;
      readable: boolean;
      _read: any;
      _readableState: any;
      _events: any;
      _eventsCount: number;
      _maxListeners: any;
    }
  
    interface File extends Part {
      fieldName: string;
      originalFilename: string;
      path: string;
      headers: { [key: string]: string };
      size: number;
    }
  
    interface Fields {
      [key: string]: string[];
    }
  
    interface Files {
      [key: string]: File[];
    }
  
    interface FormOptions {
      maxFields?: number;
      maxFieldsSize?: number;
      uploadDir?: string;
      keepExtensions?: boolean;
      encoding?: string;
      hash?: boolean | 'sha1' | 'md5';
      multiples?: boolean;
    }
  
    class Form {
      constructor(options?: FormOptions);
      parse(req: IncomingMessage, callback: (err: any, fields: Fields, files: Files) => void): void;
      onPart(part: Part): void;
      handlePart(part: Part): void;
      _parseContentType: (string: string) => string;
      _fileName: (string: string) => string;
      _initMultipart: (any: any) => void;
      _initUrlencoded: (any: any) => void;
    }
  }
  