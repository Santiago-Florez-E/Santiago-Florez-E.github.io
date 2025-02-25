import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SavedItems } from '../../services/data.service'; 

@Component({
  selector: 'app-leyes',
  templateUrl: './leyes.component.html',
  styleUrls: ['./leyes.component.css']
})
export class LeyesComponent implements OnInit {
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
      groupTitle: '1. Incumplimiento General de las Regulaciones',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Cumple la empresa con todas las regulaciones aplicables en relación con el lavado de activos y la financiación del terrorismo?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '2. Omisión de Control - Lavado de Activos (Art. 325 Código Penal Colombiano)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿La empresa cuenta con controles adecuados para prevenir el lavado de activos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se han identificado omisiones en el control de actividades relacionadas con el lavado de activos?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '3. Omisión de Reportes sobre transacciones en efectivo (Art. 325-A Código Penal Colombiano)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se reportan de manera oportuna y adecuada las transacciones en efectivo según lo establecido en el Artículo 325-A del Código Penal Colombiano?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Existen procedimientos claros para evitar la omisión en estos reportes?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '4. Incumplimiento de órdenes e instrucciones de la Superintendencia de Sociedades',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿La empresa cumple con todas las órdenes e instrucciones impartidas por la Superintendencia de Sociedades?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se implementan de manera efectiva las medidas indicadas por la Superintendencia?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '5. No implementar un Sistema de Prevención de Lavado de Activos y del Financiamiento del Terrorismo',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se ha implementado un sistema eficaz para la prevención del lavado de activos y la financiación del terrorismo?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿El sistema cumple con los estándares regulatorios vigentes?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '6. Falta de atención a tipologías y señales de alerta',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se identifican y gestionan de manera adecuada las tipologías y señales de alerta relacionadas con el lavado de activos y la financiación del terrorismo?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Existen protocolos establecidos para responder a estas señales?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '7. No denunciar delitos contra el orden económico y social (revisor fiscal)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿El revisor fiscal cumple con la obligación de denunciar delitos contra el orden económico y social?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se garantiza la independencia del revisor fiscal para realizar estas denuncias?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '8. Desarrollar actividades comerciales prohibidas  (ej. servicios financieros, captación de recursos del público)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿La empresa desarrolla actividades comerciales prohibidas, como servicios financieros o captación de recursos del público?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '9. Incumplimiento del plan de desmonte en operadoras de libranza (para actividades de administración de cartera realizadas antes de la Ley 1902 de 2018)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se ha cumplido con el plan de desmonte para actividades de administración de cartera realizadas antes de la Ley 1902 de 2018?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '10. No verificar la procedencia de los títulos que adquieran (sociedades que presten servicios de compra de cartera al descuento/factoring)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿Se verifica la procedencia de los títulos adquiridos por la empresa?',
          compliance: 'CUMPLIMIENTO TOTAL'
        },
        {
          text: '¿Se realizan controles específicos en las operaciones de compra de cartera al descuento o factoring?',
          compliance: 'CUMPLIMIENTO TOTAL'
        }
      ]
    },
    {
      groupTitle: '11. Incumplimiento de los mecanismos de control para la prevención del lavado de activos y financiación del terrorismo(sociedades que presten servicios de compra de cartera al descuento/factoring)',
      pdfUploaded: false,
      currentCompliance: '',
      questions: [
        {
          text: '¿La empresa ha implementado mecanismos de control efectivos para prevenir el lavado de activos y la financiación del terrorismo en operaciones de factoring?',
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
    this.loadComplianceData(); // Cargar datos desde localStorage
    this.loadPDFData();

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
      riesgo: 'Violación de leyes y regulación',
      puntaje: totalCompliance,
      items: groupCount,
      preguntas: questionCount,
      nivelCumplimiento: 0, // Puedes calcularlo si lo necesitas
      questions: this.capituloData.flatMap(group => group.questions) // Todas las preguntas
    };

    this.dataService.setComplianceData('leyes', [savedItem]);

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