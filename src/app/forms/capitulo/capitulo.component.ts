import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['./capitulo.component.css']
})
export class CapituloComponent implements OnInit {

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

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.initializeComplianceMap();
    this.loadComplianceData(); // Cargar datos desde localStorage
    this.loadPDFData(); // Cargar datos del PDF desde localStorage
  
    // Hacer una copia profunda de capituloData
    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
  }

  loadComplianceData(): void {
    const storedData = JSON.parse(localStorage.getItem('complianceData') || '{}');
    this.capituloData.forEach((group, groupIndex) => {
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
    this.capituloData.forEach((group, groupIndex) => {
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

  onPDFUpload(group: any, files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      group.pdfUploaded = true;
  
      // Leer el archivo como base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        // Guardar el PDF en localStorage
        const storedData = JSON.parse(localStorage.getItem('pdfData') || '{}');
        storedData[group.groupTitle] = base64String; // Guardar el PDF con el título del grupo como clave
        localStorage.setItem('pdfData', JSON.stringify(storedData));
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }

  loadPDFData(): void {
    const storedPDFData = JSON.parse(localStorage.getItem('pdfData') || '{}');
    this.capituloData.forEach(group => {
      if (storedPDFData[group.groupTitle]) {
        group.pdfUploaded = true; // Marcar como subido
        // Aquí podrías almacenar el base64 en una propiedad si necesitas mostrarlo
        // group.pdfBase64 = storedPDFData[group.groupTitle];
      }
    });
  }

  downloadPDF(group: any): void {
    const storedPDFData = JSON.parse(localStorage.getItem('pdfData') || '{}');
    const base64String = storedPDFData[group.groupTitle];
  
    if (base64String) {
      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = base64String; // URL de datos
      link.download = `${group.groupTitle}.pdf`; // Nombre del archivo
      document.body.appendChild(link);
      link.click(); // Simular clic para descargar
      document.body.removeChild(link); // Limpiar el DOM
    } else {
      alert('No se ha subido ningún PDF para este grupo.');
    }
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

  onSave(): void {
    const totalCompliance = this.calculateTotalCompliance();
    const groupCount = this.countGroups(); // Contar los grupos
    const questionCount = this.countTotalQuestions(); // Contar las preguntas

    this.dataService.setTotalCompliance('capituloX', totalCompliance);
    this.dataService.setGroupCount('capituloX', groupCount); // Almacenar la cantidad de grupos
    this.dataService.setQuestionCount('capituloX', questionCount); // Almacenar la cantidad de preguntas

    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData)); // Guardar como nueva versión original

    this.router.navigate(['']); // Asegúrate de que la ruta sea correcta
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
