// models.ts
export interface Group {
    groupTitle: string;
    pdfUploaded: boolean;
    currentCompliance: string;
    questions: { text: string; compliance: string }[];
    uploadedFiles: UploadedFile[]; // Opcional para todos los componentes
  }
  
  export interface UploadedFile {
    name: string;
    content: string;
    uploadDate: Date | string;
  }