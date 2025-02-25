import { Component, Inject, output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadedFile } from '../models/models';

@Component({
  selector: 'app-file-modal',
  template: `
    <h2>Archivos Subidos - {{ data.groupTitle }}</h2>
    <ul>
      <li *ngFor="let file of data.uploadedFiles">
        <div>
          <input type="checkbox" [checked]="isSelected(file.name)" (change)="toggleSelection(file.name)" />
          <a [href]="file.content" download="{{file.name}}">{{ file.name }}</a>
          <div class="upload-date">Subido el: {{ file.uploadDate }}</div>
        </div>
        <button (click)="deleteFile(file.name)" class="delete-button">Borrar</button>
      </li>
    </ul>
    <button *ngIf="selectedFiles.length > 0" (click)="deleteSelectedFiles()" class="delete-selected-button">
      Borrar Seleccionados ({{ selectedFiles.length }})
    </button>

    <div>
  <label *ngIf="selectedFiles.length > 0" for="email">Enviar a:</label>
  <input *ngIf="selectedFiles.length > 0" type="email" id="email" [(ngModel)]="email" placeholder="ejemplo@dominio.com" required />
  <button *ngIf="selectedFiles.length > 0" (click)="sendEmail()" [disabled]="!isEmailValid()">Enviar</button>
</div>

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
      .delete-selected-button {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
      .delete-selected-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      .delete-selected-button:hover:not(:disabled) {
        background-color: #cc0000;
      }
    </style>
  `,
})

export class FileModalComponent {
  // Usar output() y definir fileName como string[]
  fileDeleted = output<{ action: string; groupTitle: string; fileName: string[] }>();
  selectedFiles: string[] = [];
  email : string = '';

  constructor(
    public dialogRef: MatDialogRef<FileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupTitle: string; uploadedFiles: UploadedFile[] }
  ) {
    if (!this.data.uploadedFiles) {
      this.data.uploadedFiles = [];
    }
    console.log('Datos recibidos en el modal:', this.data);
  }

  isSelected(fileName: string): boolean {
    return this.selectedFiles.includes(fileName);
  }

  toggleSelection(fileName: string): void {
    if (this.isSelected(fileName)) {
      this.selectedFiles = this.selectedFiles.filter(name => name !== fileName);
    } else {
      this.selectedFiles.push(fileName);
    }
  }

  deleteFile(fileName: string): void {
    // Emitir un array con un solo archivo para mantener consistencia
    this.fileDeleted.emit({ action: 'delete', groupTitle: this.data.groupTitle, fileName: [fileName] });
    this.data.uploadedFiles = this.data.uploadedFiles.filter(file => file.name !== fileName);
    this.selectedFiles = this.selectedFiles.filter(name => name !== fileName);
  }

  deleteSelectedFiles(): void {
    if (this.selectedFiles.length > 0) {
      this.fileDeleted.emit({ action: 'delete', groupTitle: this.data.groupTitle, fileName: this.selectedFiles });
      this.data.uploadedFiles = this.data.uploadedFiles.filter(file => !this.selectedFiles.includes(file.name));
      this.selectedFiles = [];
    }
  }

  sendEmail(): void {
    if (this.isEmailValid()) {
      // Aquí puedes agregar la lógica para enviar el correo
      console.log(`Enviando correo a: ${this.email} con archivos: ${this.selectedFiles.join(', ')}`);
      alert(`Correo enviado a: ${this.email} con archivos: ${this.selectedFiles.join(', ')}`);
      this.email = ''; // Limpiar el campo de entrada
    } else {
      alert('Por favor, ingrese un correo electrónico válido.');
    }
  }

  isEmailValid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el
    return emailPattern.test(this.email);
  }

  close(): void {
    this.dialogRef.close();
  }
}