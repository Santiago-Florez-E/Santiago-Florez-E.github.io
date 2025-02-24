import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadedFile } from './capitulo/capitulo.component';

@Component({
  selector: 'app-file-modal',
  template: `
    <h1>Archivos Subidos - {{ data.groupTitle }}</h1>
    <ul>
      <li *ngFor="let file of data.uploadedFiles">
        <div>
          <a [href]="file.content" download="{{file.name}}">{{ file.name }}</a>
          <div class="upload-date">Subido el: {{ file.uploadDate}}</div> <!-- Añade pipe date para formatear -->
        </div>
        <button (click)="deleteFile(file.name)" class="delete-button">Borrar</button>
      </li>
    </ul>
    <button (click)="close()">Cerrar</button>

    <style>
      :host {
        display: block;
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .upload-date {
        font-size: 0.9em;
        color: #666;
      }
      .delete-button {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
      }
      .delete-button:hover {
        background-color: #cc0000;
      }
    </style>
  `,
})
export class FileModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupTitle: string, uploadedFiles: UploadedFile[] }
  ) {
    if (!this.data.uploadedFiles) {
      this.data.uploadedFiles = [];
    }
    console.log('Datos recibidos en el modal:', this.data);
  }

  deleteFile(fileName: string): void {
    this.dialogRef.close({ action: 'delete', groupTitle: this.data.groupTitle, fileName });
  }

  close(): void {
    this.dialogRef.close();
  }
}