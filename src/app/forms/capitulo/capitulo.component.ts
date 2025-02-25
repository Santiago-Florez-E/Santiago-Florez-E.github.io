import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ComplianceService } from '../../services/compliance.service';
import { Group, UploadedFile } from '../../models/models';

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['./capitulo.component.css']
})
export class CapituloComponent implements OnInit {
  selectedGroup: any = null;
  originalCapituloData: Group[] = [];
  capituloData: Group[] = [
    {
      groupTitle: '1. Sobre la aplicación del Capítulo X',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Cómo evalúas el nivel de cumplimiento de tu entidad en relación con la implementación de las disposiciones sugeridas en el Capítulo X, conforme a las normativas vigentes?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '2. Sobre los plazos del SAGRILAFT o Régimen de Medidas Mínimas',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿En qué medida consideras que la empresa está cumpliendo con los plazos establecidos para la implementación del SAGRILAFT o del Régimen de Medidas Mínimas?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '3. Sobre la designación del Oficial de Cumplimiento',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Se ha designado un Oficial de Cumplimiento en la empresa?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Cumple el Oficial de Cumplimiento designado con los requisitos de idoneidad y experiencia establecidos por la normativa?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '4. Sobre los recursos proporcionados al Oficial de Cumplimiento',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Cuenta el Oficial de Cumplimiento con los recursos operativos, económicos, físicos y tecnológicos necesarios para desempeñar sus funciones de manera efectiva?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '5. Sobre incompatibilidades e inhabilidades',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Se ha designado como Oficial de Cumplimiento a alguien que tenga conflicto de funciones, como el revisor fiscal, auditor interno o representante legal?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '6. Probación del SAGRILAFT',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [],
      questions: [
        {
          text: '¿El SAGRILAFT ha sido formalmente aprobado por el máximo órgano social o la junta directiva, según la estructura de gobierno de la empresa?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Las actas de las reuniones del órgano social reflejan las discusiones y decisiones tomadas en relación con la aprobación del SAGRILAFT, incluyendo las versiones iniciales y sus actualizaciones?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿El SAGRILAFT aprobado incluye políticas, procedimientos y medidas que cumplen con las leyes, regulaciones y recomendaciones aplicables en materia de prevención del LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se han establecido mecanismos para la revisión y actualización periódica del SAGRILAFT, asegurando que se mantenga actualizado frente a los cambios en las regulaciones, los riesgos y las mejores prácticas en materia de prevención del LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '7. Código de Ética',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿El Código de Ética de la empresa articula explícitamente los principios de integridad, transparencia y cumplimiento normativo, con un enfoque específico en la prevención del LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿La empresa ha implementado un programa de capacitación y comunicación para asegurar que todos los empleados, contratistas y terceros relevantes conozcan y comprendan las políticas, manuales y el Código de Ética relacionados con la prevención del LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿La empresa mantiene registros documentales que evidencien la entrega y aceptación del Código de Ética por parte de todos los empleados, contratistas y terceros relevantes, incluyendo la fecha de recepción y la firma o confirmación electrónica del colaborador?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog,
    public complianceService: ComplianceService
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
      riesgo: 'Incumplimientos específicos del Capítulo X',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0,
      questions: this.capituloData.flatMap(group => group.questions)
    };

    this.dataService.setComplianceData('capituloX', [savedItem]);
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