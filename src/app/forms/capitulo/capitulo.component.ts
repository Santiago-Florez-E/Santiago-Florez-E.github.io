import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FileModalComponent } from '../file-modal.component'; 

export interface UploadedFile {
  name: string;
  content: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['./capitulo.component.css']
})
export class CapituloComponent implements OnInit {

  selectedGroup: any = null;

  originalCapituloData: any[] = []

  /* ===============================
     Propiedades y Datos
     =============================== */

  complianceMap: { [key: string]: number } = {};

  complianceOptions: string[] = [
    'NO CUMPLE',
    'CUMPLIMIENTO BAJO',
    'CUMPLIMIENTO MODERADO',
    'CUMPLIMIENTO ALTO',
    'CUMPLIMIENTO TOTAL'
  ];



  //   // Datos estructurados en grupos: cada grupo tiene un título, un estado de PDF y preguntas.
  capituloData = [
    {
      groupTitle: '1. Sobre la aplicación del Capítulo X',
      pdfUploaded: false,
      currentCompliance: '',
      uploadedFiles: [] as UploadedFile[],
      questions: [
        {
          text: '¿Ha implementado la empresa todas las disposiciones del Capítulo X conforme a las normativas vigentes?',
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
          text: '¿Se han adoptado las medidas propuestas para la implementación del SAGRILAFT o del Régimen de Medidas Mínimas?',
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

  constructor(private router: Router, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeComplianceMap();
    this.loadComplianceData(); // Cargar datos desde localStorage
    this.loadPDFData(); // Cargar datos del PDF desde localStorage
    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
  }

  loadComplianceData(): void {
    const storedData = JSON.parse(localStorage.getItem('complianceData') || '{}');
    this.capituloData.forEach((group) => {
      group.questions.forEach((question, questionIndex) => {
        const key = `${group.groupTitle}_${questionIndex}`;
        if (storedData[key]) {
          question.compliance = storedData[key]; // Asignar el cumplimiento guardado
          this.complianceMap[key] = this.getNumericValue(question.compliance); // Actualizar complianceMap
        }
      });
    });
  }

  initializeComplianceMap(): void {
    this.capituloData.forEach((group) => {
      group.questions.forEach((question, questionIndex) => {
        const key = `${group.groupTitle}_${questionIndex}`;
        this.complianceMap[key] = this.getNumericValue(question.compliance);
      });
    });
  }

  navigateTo(route: string): void {
    if (this.hasChanges()) {
      const confirmacion = confirm('Es necesario guardar los cambios antes de salir. ¿Quieres guardar ahora?');

      if (confirmacion) {
        this.onSave();
        this.router.navigate([route]);
      }
      // Si elige "Cancelar", simplemente no hace nada y se queda en la página
    } else {
      this.router.navigate([route]);
    }
  }


  onSelectPDF(pdfInput: HTMLInputElement): void {
    pdfInput.click();
  }

  onFileUpload(group: any, files: FileList | null): void {
    if (files && files.length > 0) {
      if (!group.uploadedFiles) {
        group.uploadedFiles = []; // Inicializar si no existe
      }

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result;

          const newFile = {
            name: file.name,
            content: base64String,
            uploadDate: new Date().toLocaleString()
          };

          group.uploadedFiles.push(newFile); // Guardar en la lista de archivos del grupo

          // Guardar en localStorage
          const storedData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
          if (!storedData[group.groupTitle]) {
            storedData[group.groupTitle] = [];
          }
          storedData[group.groupTitle].push(newFile);
          localStorage.setItem('uploadedFilesData', JSON.stringify(storedData));
        };
        reader.readAsDataURL(file);
      });

      group.pdfUploaded = true; // Indicar que hay archivos subidos
    }
  }

  deleteFile(groupTitle: string, fileName: string): void {
    // Buscar el grupo en capituloData usando el groupTitle
    const group = this.capituloData.find(g => g.groupTitle === groupTitle);
    
    if (group) {
      // Filtrar el archivo que queremos eliminar de uploadedFiles
      group.uploadedFiles = group.uploadedFiles.filter((file: UploadedFile) => file.name !== fileName);
  
      // Actualizar el estado de pdfUploaded
      group.pdfUploaded = group.uploadedFiles.length > 0;
  
      // Actualizar localStorage
      const storedData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
      if (storedData[groupTitle]) {
        storedData[groupTitle] = group.uploadedFiles;
        localStorage.setItem('uploadedFilesData', JSON.stringify(storedData));
      }
  
      // Actualizar selectedGroup si está abierto
      if (this.selectedGroup && this.selectedGroup.groupTitle === groupTitle) {
        this.selectedGroup.uploadedFiles = group.uploadedFiles;
      }
  
      // Notificar a la ventana emergente para que se recargue o actualice
      if (window.opener) {
        // Intentar cerrar o recargar la ventana emergente
        const popup = window.open('', '_self');
        if (popup) {
          popup.close(); // Cerrar la ventana emergente actual
          // Volver a abrirla con los datos actualizados
          this.openFiles(group);
        }
      }
    } else {
      console.error('Grupo no encontrado:', groupTitle);
    }
  }

  loadPDFData(): void {
    const storedPDFData = JSON.parse(localStorage.getItem('uploadedFilesData') || '{}');
    this.capituloData.forEach(group => {
      if (storedPDFData[group.groupTitle]) {
        group.uploadedFiles = storedPDFData[group.groupTitle];
        group.pdfUploaded = group.uploadedFiles.length > 0;
      }
    });
  }

  downloadFile(group: any, fileName: string): void {
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

  openFiles(group: any): void {
    console.log('Datos enviados al modal:', { groupTitle: group.groupTitle, uploadedFiles: group.uploadedFiles });
    const dialogRef = this.dialog.open(FileModalComponent, {
      width: '600px',
      data: { groupTitle: group.groupTitle, uploadedFiles: group.uploadedFiles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteFile(result.groupTitle, result.fileName);
      }
    });
  }

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
        return 'green'; // Si no se ha seleccionado ninguna opción
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
        return 1; // Si no se ha seleccionado ninguna opción
    }
  }

  onComplianceChange(item: any, group: any, index: number): void {
    const numericValue = this.getNumericValue(item.compliance);
    const key = `${group.groupTitle}_${index}`;
    this.complianceMap[key] = numericValue;

    // Guardar en localStorage
    const storedData = JSON.parse(localStorage.getItem('complianceData') || '{}');
    storedData[key] = item.compliance; // Guardar el cumplimiento actual
    localStorage.setItem('complianceData', JSON.stringify(storedData));
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

  onSave(): void {
    const totalCompliance = this.calculateTotalCompliance();
    const groupCount = this.countGroups();
    const questionCount = this.countTotalQuestions();

    const savedItem: SavedItems = {
      riesgo: 'Incumplimientos específicos del Capítulo X',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0, // Puedes calcularlo si lo necesitas
      questions: this.capituloData.flatMap(group => group.questions) // Todas las preguntas
    };
    this.dataService.setComplianceData('capituloX', [savedItem]);
    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
    this.router.navigate(['']);

  }

  //Verifica si hay cambias respecto a lo orignial
  hasChanges(): boolean {
    return JSON.stringify(this.capituloData) !== JSON.stringify(this.originalCapituloData);
  }


  countGroups(): number {
    return this.capituloData.length;
  }

  countTotalQuestions(): number {
    let totalQuestions = 0;
    this.capituloData.forEach(group => {
      totalQuestions += group.questions.length; // Suma la cantidad de preguntas en cada grupo
    });
    return totalQuestions;
  }
}
