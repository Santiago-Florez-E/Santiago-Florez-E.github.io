import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ComplianceService } from '../../services/compliance.service';
import { Group, UploadedFile } from '../../models/models';

@Component({
  selector: 'app-ddi',
  templateUrl: './ddi.component.html',
  styleUrls: ['./ddi.component.css']
})
export class DdiComponent implements OnInit {
  selectedGroup: any = null;
  originalCapituloData: Group[] = [];
  capituloData: Group[] = [
    {
      groupTitle: '1. Verificación de identidad de contrapartes',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Verifica la empresa la identidad de las contrapartes antes de iniciar cualquier relación comercial?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se asegura de que esta verificación esté documentada adecuadamente en los registros internos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '2. Aprobación para vinculación de Personas Expuestas Políticamente (PEP)',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Obtiene la empresa la aprobación de la alta gerencia antes de vincular a Personas Expuestas Políticamente (PEP)?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Cuenta con un procedimiento formal para documentar la aprobación de la alta gerencia en estos casos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '3. Establecimiento del origen de los recursos de las contrapartes',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Realiza la empresa un análisis para establecer el origen de los recursos de las contrapartes antes de iniciar relaciones comerciales?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Existen controles para garantizar la trazabilidad del origen de los recursos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '4. Monitoreo continuo e intensificado',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Realiza la empresa un monitoreo continuo e intensificado de las relaciones contractuales, especialmente con contrapartes de mayor riesgo?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Cuenta con herramientas o sistemas que permitan la supervisión constante de estas relaciones?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '5. Revisión de países de mayor riesgo en los listados del GAFI',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Revisa la empresa de manera permanente los países de mayor riesgo incluidos en los listados del GAFI?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se utilizan estos listados para ajustar las políticas y procedimientos de gestión de riesgos de LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    }
  ];

  // Exponer complianceOptions como propiedad pública (si no usas complianceService directamente en el template)
  get complianceOptions(): string[] {
    return this.complianceService.complianceOptions;
  }

  constructor(
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog, // Inyectar MatDialog para FileModalComponent
    public complianceService: ComplianceService // Inyectar ComplianceService
  ) {}

  ngOnInit(): void {
    this.complianceService.initializeComplianceMap(this.capituloData);
    this.complianceService.loadComplianceData(this.capituloData);
    this.complianceService.loadPDFData(this.capituloData);
    this.complianceService.loadUploadedFilesData(this.capituloData);
    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
  }

  navigateTo(route: string): void {
    this.complianceService.navigateTo(route, this.capituloData, this.originalCapituloData);
  }

  onSelectPDF(pdfInput: HTMLInputElement): void {
    this.complianceService.onSelectPDF(pdfInput);
  }

  onFileUpload(group: Group, files: FileList | null): void {
    this.complianceService.onFileUpload(group, files);
  }

  deleteFile(groupTitle: string, fileNames: string[]): void {
    this.complianceService.deleteFile(groupTitle, fileNames, this.capituloData);
  }

  loadPDFData(): void {
    this.complianceService.loadPDFData(this.capituloData);
  }

  loadUploadedFilesData(): void {
    this.complianceService.loadUploadedFilesData(this.capituloData);
  }

  downloadPDF(group: Group): void {
    this.complianceService.downloadPDF(group);
  }

  downloadFile(group: Group, fileName: string): void {
    this.complianceService.downloadFile(group, fileName);
  }

  openFiles(group: Group): void {
    this.complianceService.openFiles(group, this.capituloData);
  }

  onComplianceChange(item: any, group: Group, index: number): void {
    this.complianceService.onComplianceChange(item, group, index, this.capituloData);
  }

  calculateTotalCompliance(): number {
    return this.complianceService.calculateTotalCompliance();
  }

  onSave(): void {
    const totalCompliance = this.calculateTotalCompliance();
    const groupCount = this.complianceService.countGroups(this.capituloData);
    const questionCount = this.complianceService.countTotalQuestions(this.capituloData);

    const savedItem: SavedItems = {
      riesgo: 'Incumplimientos en la Debida Diligencia',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0,
      questions: this.capituloData.flatMap(group => group.questions)
    };

    this.dataService.setComplianceData('ddi', [savedItem]);
    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
    this.router.navigate(['']);
  }

  hasChanges(): boolean {
    return this.complianceService.hasChanges(this.capituloData, this.originalCapituloData);
  }

  countGroups(): number {
    return this.complianceService.countGroups(this.capituloData);
  }

  countTotalQuestions(): number {
    return this.complianceService.countTotalQuestions(this.capituloData);
  }

  getColor(compliance: string): string {
    return this.complianceService.getColor(compliance);
  }

  getNumericValue(compliance: string): number {
    return this.complianceService.getNumericValue(compliance);
  }
}