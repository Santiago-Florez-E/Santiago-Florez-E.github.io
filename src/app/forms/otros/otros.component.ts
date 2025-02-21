import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service'; // Añadimos SavedItems a la importación

@Component({
  selector: 'app-otros',
  templateUrl: './otros.component.html',
  styleUrls: ['./otros.component.css']
})
export class OtrosComponent implements OnInit {
  originalCapituloData: any[] = [];

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
      groupTitle: '1. Divulgación y capacitación del SAGRILAFT',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Ha sido divulgado el SAGRILAFT dentro de la empresa a todos los niveles organizacionales?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se realizan capacitaciones periódicas para los empleados sobre los riesgos relacionados con LA/FT/FPADM y las medidas de control del SAGRILAFT?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '2. Documentación de las actividades del SAGRILAFT',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se documentan adecuadamente las actividades del SAGRILAFT, incluyendo la información proporcionada por las contrapartes?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Están registrados los resultados de las verificaciones realizadas a las contrapartes?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '3. Cumplimiento de órdenes e instrucciones de la Superintendencia de Sociedades',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Cumple la empresa con todas las órdenes e instrucciones impartidas por la Superintendencia de Sociedades relacionadas con el SAGRILAFT?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Existe un procedimiento para garantizar que las órdenes e instrucciones regulatorias sean implementadas de manera oportuna?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '4. Consulta de listas vinculantes',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Consulta la empresa de forma periódica las listas vinculantes de la ONU relacionadas con personas o entidades sancionadas?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se reporta oportunamente a la UIAF y a la Fiscalía General de la Nación cualquier identificación de bienes, activos o fondos de titularidad de personas o entidades incluidas en estas listas?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
  ];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.initializeComplianceMap();
    this.loadComplianceData(); // Cargar datos desde localStorage

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
      group.pdfUploaded = true;
      // Aquí se podría manejar el archivo (por ejemplo, subirlo a un servidor)
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

    const savedItem: SavedItems = {
      riesgo: 'Otros incumplimientos detectados',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0, // Puedes calcularlo si lo necesitas
      questions: this.capituloData.flatMap(group => group.questions) // Todas las preguntas
    };

    this.dataService.setComplianceData('otros', [savedItem]);

    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData)); // Guardar como nueva versión original
    this.router.navigate(['']); // Asegúrate de que la ruta sea correcta
  }

  // Verifica si hay cambios respecto a lo original
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