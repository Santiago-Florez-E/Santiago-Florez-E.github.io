import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service'; // Añade SavedItems aquí

@Component({
  selector: 'app-ddi',
  templateUrl: './ddi.component.html',
  styleUrls: ['./ddi.component.css']
})
export class DdiComponent implements OnInit {
  originalCapituloData: any[] = [];

  /* ===============================
     Propiedades y Datos
     =============================== */
     
  // Donde la clave es una cadena y el valor es un número.
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
      groupTitle: '1. Verificación de identidad de contrapartes',
      pdfUploaded: false,
      currentCompliance: '',
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

  /* ===============================
     Métodos de Navegación y PDF
     =============================== */

  constructor(private router: Router, private dataService: DataService) {}

  // Al iniciar la página se aplica este método
  ngOnInit(): void {
    this.initializeComplianceMap();
    this.loadComplianceData();

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
    const groupCount = this.countGroups();
    const questionCount = this.countTotalQuestions();

    const savedItem: SavedItems = {
      riesgo: 'Incumplimientos en la Debida Diligencia',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0, // Puedes calcularlo si lo necesitas
      questions: this.capituloData.flatMap(group => group.questions) // Todas las preguntas
    };

    this.dataService.setComplianceData('ddi', [savedItem]);

    this.originalCapituloData = JSON.parse(JSON.stringify(this.capituloData));
    this.router.navigate(['']);
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