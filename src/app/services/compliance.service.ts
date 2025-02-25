// compliance.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from './data.service'; // Ajusta la ruta según tu estructura
import { MatDialog } from '@angular/material/dialog';
import { FileModalComponent } from '../forms/file-modal.component'; // Ajusta la ruta según tu estructura
import { UploadedFile, Group } from '../models/models'; // Importa las interfaces desde models.ts

@Injectable({
  providedIn: 'root' // Hacerlo disponible en toda la aplicación
})
export class ComplianceService {
  // Propiedades compartidas
  complianceMap: { [key: string]: number } = {};
  complianceOptions: string[] = [
    'NO CUMPLE',
    'CUMPLIMIENTO BAJO',
    'CUMPLIMIENTO MODERADO',
    'CUMPLIMIENTO ALTO',
    'CUMPLIMIENTO TOTAL'
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog // Inyectar MatDialog para FileModalComponent
  ) {}

  // Métodos comunes de cumplimiento
  loadComplianceData(capituloData: Group[]): void {
    const storedData = JSON.parse(localStorage.getItem('complianceData') || '{}');
    capituloData.forEach((group) => {
      group.questions.forEach((question, questionIndex) => {
        const key = `${group.groupTitle}_${questionIndex}`;
        if (storedData[key]) {
          question.compliance = storedData[key];
          this.complianceMap[key] = this.getNumericValue(question.compliance);
        }
      });
    });
  }

  initializeComplianceMap(capituloData: Group[]): void {
    capituloData.forEach((group) => {
      group.questions.forEach((question, questionIndex) => {
        const key = `${group.groupTitle}_${questionIndex}`;
        this.complianceMap[key] = this.getNumericValue(question.compliance);
      });
    });
  }

  navigateTo(route: string, capituloData: Group[], originalCapituloData: Group[]): void {
    if (this.hasChanges(capituloData, originalCapituloData)) {
      const confirmacion = confirm('Es necesario guardar los cambios antes de salir. ¿Quieres guardar ahora?');
      if (confirmacion) {
        this.onSave(capituloData); // Este método será genérico, pero los componentes lo personalizarán
        this.router.navigate([route]);
      }
    } else {
      this.router.navigate([route]);
    }
  }

  onSelectPDF(pdfInput: HTMLInputElement): void {
    pdfInput.click();
  }

  onPDFUpload(group: Group, files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      group.pdfUploaded = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result as string;
        const storedData = JSON.parse(localStorage.getItem('pdfData') || '{}');
        storedData[group.groupTitle] = base64String;
        localStorage.setItem('pdfData', JSON.stringify(storedData));
      };
      reader.readAsDataURL(file);
    }
  }

  loadPDFData(capituloData: Group[]): void {
    const storedPDFData = JSON.parse(localStorage.getItem('pdfData') || '{}');
    capituloData.forEach(group => {
      if (storedPDFData[group.groupTitle]) {
        group.pdfUploaded = true;
      }
    });
  }

  downloadPDF(group: Group): void {
    const storedPDFData = JSON.parse(localStorage.getItem('pdfData') || '{}');
    const base64String = storedPDFData[group.groupTitle];

    if (base64String) {
      const link = document.createElement('a');
      link.href = base64String;
      link.download = `${group.groupTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No se ha subido ningún PDF para este grupo.');
    }
  }

  // Métodos específicos de archivos (uploadedFiles y FileModalComponent)
  onFileUpload(group: Group, files: FileList | null): void {
    if (files && files.length > 0) {
      group.uploadedFiles = group.uploadedFiles || []; // Inicializar como array vacío si no existe

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result as string;
          const newFile: UploadedFile = {
            name: file.name,
            content: base64String,
            uploadDate: new Date().toLocaleString()
          };
          group.uploadedFiles.push(newFile);

          const storedData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
          if (!storedData[group.groupTitle]) {
            storedData[group.groupTitle] = [];
          }
          storedData[group.groupTitle].push(newFile);
          localStorage.setItem('uploadedFilesData', JSON.stringify(storedData));
        };
        reader.readAsDataURL(file);
      });

      group.pdfUploaded = true;
    }
  }

  deleteFile(groupTitle: string, fileNames: string[], capituloData: Group[]): void {
    const group = this.findGroupInData(groupTitle, capituloData);
    if (group) {
      group.uploadedFiles = group.uploadedFiles.filter((file: UploadedFile) => !fileNames.includes(file.name)); // No necesitamos el operador opcional
      group.pdfUploaded = group.uploadedFiles.length > 0;

      const storedData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
      if (storedData[groupTitle]) {
        storedData[groupTitle] = group.uploadedFiles;
        localStorage.setItem('uploadedFilesData', JSON.stringify(storedData));
      }
    } else {
      console.error('Grupo no encontrado:', groupTitle);
    }
  }

  loadUploadedFilesData(capituloData: Group[]): void {
    const storedPDFData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
    capituloData.forEach(group => {
      if (storedPDFData[group.groupTitle]) {
        group.uploadedFiles = storedPDFData[group.groupTitle];
        group.pdfUploaded = group.uploadedFiles.length > 0;
      } else {
        group.uploadedFiles = []; // Inicializar como array vacío si no hay datos
        group.pdfUploaded = false;
      }
    });
  }

  downloadFile(group: Group, fileName: string): void {
    const storedData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
    const groupFiles = storedData[group.groupTitle] || [];

    const file = groupFiles.find((f: any) => f.name === fileName);
    if (file) {
      const link = document.createElement('a');
      link.href = file.content;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Archivo no encontrado.');
    }
  }

  openFiles(group: Group, capituloData: Group[]): void {
    console.log('Datos enviados al modal:', { groupTitle: group.groupTitle, uploadedFiles: group.uploadedFiles });
    const dialogRef = this.dialog.open(FileModalComponent, {
      width: '600px',
      data: { groupTitle: group.groupTitle, uploadedFiles: group.uploadedFiles || [] }
    });

    dialogRef.componentInstance.fileDeleted.subscribe((result: { action: string; groupTitle: string; fileName: string[] }) => {
      if (result.action === 'delete') {
        this.deleteFile(result.groupTitle, result.fileName, capituloData);
        // Actualizar capituloData después de eliminar
        const updatedGroup = this.findGroupInData(result.groupTitle, capituloData);
        if (updatedGroup) {
          updatedGroup.uploadedFiles = updatedGroup.uploadedFiles || [];
        }
      }
    });
  }

  // Método auxiliar para encontrar un grupo en capituloData
  private findGroupInData(groupTitle: string, capituloData: Group[] = []): Group | undefined {
    return capituloData.find(g => g.groupTitle === groupTitle);
  }

  // Métodos de cumplimiento
  getColor(compliance: string): string {
    switch (compliance) {
      case 'NO CUMPLE':
        return '#a31818';
      case 'CUMPLIMIENTO BAJO':
        return 'red';
      case 'CUMPLIMIENTO MODERADO':
        return 'orange';
      case 'CUMPLIMIENTO ALTO':
        return 'yellow';
      case 'CUMPLIMIENTO TOTAL':
        return 'green';
      default:
        return 'green';
    }
  }

  getNumericValue(compliance: string): number {
    switch (compliance) {
      case 'NO CUMPLE':
        return 5;
      case 'CUMPLIMIENTO BAJO':
        return 4;
      case 'CUMPLIMIENTO MODERADO':
        return 3;
      case 'CUMPLIMIENTO ALTO':
        return 2;
      case 'CUMPLIMIENTO TOTAL':
        return 1;
      default:
        return 1;
    }
  }

  onComplianceChange(item: any, group: Group, index: number, capituloData: Group[]): void {
    const numericValue = this.getNumericValue(item.compliance);
    const key = `${group.groupTitle}_${index}`;
    this.complianceMap[key] = numericValue;

    const storedData = JSON.parse(localStorage.getItem('complianceData') || '{}');
    storedData[key] = item.compliance;
    localStorage.setItem('complianceData', JSON.stringify(storedData));

    console.clear();
    console.log('Estado actual de complianceMap:', this.complianceMap);
  }

  calculateTotalCompliance(): number {
    let total = 0;
    for (const key in this.complianceMap) {
      if (this.complianceMap.hasOwnProperty(key)) {
        total += this.complianceMap[key];
      }
    }
    return total;
  }

  onSave(capituloData: Group[]): void {
    const totalCompliance = this.calculateTotalCompliance();
    const groupCount = this.countGroups(capituloData);
    const questionCount = this.countTotalQuestions(capituloData);

    const savedItem: SavedItems = {
      riesgo: '', // Este valor debe ser especificado por cada componente
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0,
      questions: capituloData.flatMap(group => group.questions)
    };
    // Este método no se implementa aquí; los componentes lo personalizarán
  }

  hasChanges(capituloData: Group[], originalCapituloData: Group[]): boolean {
    return JSON.stringify(capituloData) !== JSON.stringify(originalCapituloData);
  }

  countGroups(capituloData: Group[]): number {
    return capituloData.length;
  }

  countTotalQuestions(capituloData: Group[]): number {
    let totalQuestions = 0;
    capituloData.forEach(group => {
      totalQuestions += group.questions.length;
    });
    return totalQuestions;
  }
}