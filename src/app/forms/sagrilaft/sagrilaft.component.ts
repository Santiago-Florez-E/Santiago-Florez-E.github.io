import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service'; // Añadimos SavedItems a la importación

@Component({
  selector: 'app-sagrilaft',
  templateUrl: './sagrilaft.component.html',
  styleUrls: ['./sagrilaft.component.css']
})
export class SagrilaftComponent implements OnInit {
  originalCapituloData: any[] = [];

  /* ===============================
     Propiedades y Datos
     =============================== */

  // Objeto para almacenar el valor numérico de cada pregunta,
  // donde la clave es una cadena y el valor es un número.
  complianceMap: { [key: string]: number } = {};

  // Opciones del desplegable
  complianceOptions: string[] = [
    'NO CUMPLE',
    'CUMPLIMIENTO BAJO',
    'CUMPLIMIENTO MODERADO',
    'CUMPLIMIENTO ALTO',
    'CUMPLIMIENTO TOTAL'
  ];

  // Datos estructurados en grupos: cada grupo tiene un título, un estado de PDF y preguntas.
  capituloData = [
    {
      groupTitle: '1. Identificación del Riesgo',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Ha identificado la empresa los factores de riesgo relacionados con LA/FT/FPADM y los riesgos asociados?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se han documentado adecuadamente los factores y riesgos identificados?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '2. Medición o Evaluación del Riesgo',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Evalúa la empresa la probabilidad de ocurrencia y el impacto de los riesgos relacionados con LA/FT/FPADM identificados?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se realizan análisis periódicos para actualizar la medición o evaluación de los riesgos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
      ]
    },
    {
      groupTitle: '3. Control del Riesgo',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Ha implementado la empresa políticas y procedimientos efectivos para mitigar los riesgos de LA/FT/FPADM identificados?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Existen controles específicos para cada riesgo identificado y evaluado?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
      ]
    },
    {
      groupTitle: '4. Monitoreo',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se supervisan y verifican regularmente la efectividad de las medidas de control implementadas?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Cuenta la empresa con un proceso formal de monitoreo continuo para garantizar la gestión adecuada del riesgo de LA/FT/FPADM?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
      ]
    }
  ];

  /* ===============================
     Métodos de Navegación y PDF
     =============================== */

  constructor(private router: Router, private dataService: DataService) {}

  // Al iniciar la página se aplica este método
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

  // El método recorre cada grupo y pregunta, luego utiliza (getNumericValue) para obtener el valor numérico y lo almacena
  initializeComplianceMap(): void {
    this.capituloData.forEach((group, groupIndex) => {
      group.questions.forEach((question, questionIndex) => {
        const key = `${group.groupTitle}_${questionIndex}`;
        // Inicializa complianceMap con el valor correspondiente
        this.complianceMap[key] = this.getNumericValue(question.compliance);
      });
    });
  }

  // Navegar a otra ruta
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

  // Abre el diálogo para seleccionar un archivo PDF
  onSelectPDF(pdfInput: HTMLInputElement): void {
    pdfInput.click();
  }

  // Maneja la carga del PDF para un grupo (cambia el estado para cambiar el color del botón)
  onPDFUpload(group: any, files: FileList | null): void {
    if (files && files.length > 0) {
      group.pdfUploaded = true;
      // Aquí se podría manejar el archivo (por ejemplo, subirlo a un servidor)
    }
  }

  /* ===============================
     Funciones de Ayuda para el Cumplimiento
     =============================== */

  /**
   * Devuelve el color que se usará según la opción de cumplimiento seleccionada.
   * "NO CUMPLE" → rojo, "CUMPLIMIENTO BAJO" → naranja,
   * "CUMPLIMIENTO MODERADO" → amarillo, "CUMPLIMIENTO ALTO" → yellowgreen,
   * "CUMPLIMIENTO TOTAL" → verde.
   */
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

  /**
   * Devuelve un valor numérico según la opción de cumplimiento:
   * "NO CUMPLE" → 5, "CUMPLIMIENTO BAJO" → 4,
   * "CUMPLIMIENTO MODERADO" → 3, "CUMPLIMIENTO ALTO" → 2,
   * "CUMPLIMIENTO TOTAL" → 1.
   */
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

  /**
   * Cada vez que cambia el valor del select:
   * 1) Se calcula y guarda el valor numérico en complianceMap.
   * 2) Se imprime en la consola el estado actual de complianceMap.
   */
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
      riesgo: 'Incumplimientos en las Etapas del SAGRILAFT',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0, // Puedes calcularlo si lo necesitas
      questions: this.capituloData.flatMap(group => group.questions) // Todas las preguntas
    };

    this.dataService.setComplianceData('sagrilaft', [savedItem]);

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