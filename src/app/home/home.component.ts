import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { group } from '@angular/animations';

interface ComplianceItem {
  riesgo: string;
  puntaje: number;
  items: number;
  preguntas: number;
  nivelCumplimiento: number;
  participacionW: number;
  cumpleW: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  valorCritico: number = 90;
  scoring: number = 0;
  salarioMinimo : number = 1423500;
  multa: number = 200;
  impactoCalculado = 0;

  complianceData: ComplianceItem[] = [
    {
      riesgo: 'Incumplimientos específicos del Capítulo X',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0,
      participacionW: 0,
      cumpleW: 0
    },
    {
      riesgo: 'Otros incumplimientos detectados',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0,
      participacionW: 0,
      cumpleW: 0
    },
    {
      riesgo: 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0.00,
      participacionW: 0,
      cumpleW: 0
    },
    {
      riesgo: 'Incumplimientos en la Debida Diligencia',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0.00,
      participacionW: 0,
      cumpleW: 0
    },
    {
      riesgo: 'Incumplimientos en las Etapas del SAGRILAFT',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0.00,
      participacionW: 0,
      cumpleW: 0
    },
    {
      riesgo: 'Violación de leyes y regulación',
      puntaje: 0,
      items: 0,
      preguntas: 0,
      nivelCumplimiento: 0.00,
      participacionW: 0,
      cumpleW: 0
    }
  ];
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.updateAllComplianceData(); // Cargar datos almacenados
    this.cargarValorCritico()
    this.calcularImpacto()
  }

  updateAllComplianceData(): void {
    const complianceTypes = ['capituloX', 'otros', 'ddi', 'leyes', 'ros', 'sagrilaft'];

    // Primero actualizamos complianceData con los valores correctos
    complianceTypes.forEach(type => {
      const totalCompliance = this.dataService.getTotalCompliance(type);
      const groupCount = this.dataService.getGroupCount(type);
      const questionCount = this.dataService.getQuestionCount(type);

      this.updateComplianceData(type, totalCompliance, groupCount, questionCount);
    });

    // 📌 Ahora que complianceData está actualizado, calculamos el total real
    const totalPreguntasActual = this.complianceData.reduce((sum, item) => sum + item.preguntas, 0);

    // 📌 Ahora recalculamos la participación y otros valores con el total correcto
    this.complianceData.forEach(item => {
      item.participacionW = this.calculateParticipacionW(item.preguntas, totalPreguntasActual);
      item.cumpleW = this.calculateCumpleW(item.nivelCumplimiento, item.participacionW)
    });
    this.calcularScoring();
  }

  updateComplianceData(type: string, totalCompliance: number, groupCount: number, questionCount: number): void {
    const specificItem = this.complianceData.find(item => item.riesgo === this.getRiskName(type));

    if (specificItem) {
      specificItem.puntaje = totalCompliance;
      specificItem.items = groupCount;
      specificItem.preguntas = questionCount;
      specificItem.nivelCumplimiento = this.calculateNivelCumplimiento(totalCompliance, questionCount);
    }
  }


  getRiskName(type: string): string {
    const riskNames: { [key: string]: string } = {
      'capituloX': 'Incumplimientos específicos del Capítulo X',
      'otros': 'Otros incumplimientos detectados',
      'ddi': 'Incumplimientos en la Debida Diligencia',
      'leyes': 'Violación de leyes y regulación',
      'ros': 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)',
      'sagrilaft': 'Incumplimientos en las Etapas del SAGRILAFT'
    };
    return riskNames[type] || '';
  }

  calculateNivelCumplimiento(totalCompliance: number, questionCount: number): number {
    if (questionCount === 0) return 0; // Evitar división por cero
    const maxCompliance = questionCount * 5; // Cumplimiento máximo
    return (1 - ((totalCompliance - questionCount) / (maxCompliance - questionCount))) * 100; // Calcular el porcentaje
  }

  calculateParticipacionW(questionCount: number, totalPreguntas: number) {
    return (questionCount / totalPreguntas);
  }

  calculateCumpleW(calculateParticipacionW: number, calculateNivelCumplimiento: number) {
    return calculateNivelCumplimiento * calculateParticipacionW
  }

  calcularScoring() {
    this.cargarValorCritico(); // Asegurar que valorCritico esté actualizado

    if (this.valorCritico === 100) {
      this.scoring = this.cumplimientoTotal === 100 ? 100 : 0;
    } else {
      this.scoring = ((this.cumplimientoTotal - this.valorCritico) / (100 - this.valorCritico)) * 100;
    }

    if (this.scoring < 0) {
      this.scoring = 0;
    }

    localStorage.setItem('scoring', this.scoring.toString());
  }

  cargarScoring() {
    const scoringGuardado = localStorage.getItem('scoring');
    if (scoringGuardado !== null) {
      this.scoring = parseFloat(scoringGuardado);
    }
  }

  calcularImpacto(){
    this.impactoCalculado = this.salarioMinimo * this.multa
  }

  // 📌 Guardar el valor en localStorage cuando cambie
  actualizarValorCritico() {
    if (this.valorCritico < 0) {
      this.valorCritico = 0;
    } else if (this.valorCritico > 100) {
      this.valorCritico = 100;
    }
    localStorage.setItem('valorCritico', this.valorCritico.toString());

    // Llama a las funciones que dependen de valorCritico
    this.calcularScoring();
  }

  //Valida el input cuando escribre en el valor
  validarInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let value = parseInt(input.value, 10);

      if (isNaN(value) || value < 0) {
        value = 0;
      } else if (value > 100) {
        value = 100;
      }

      this.valorCritico = value;
      input.value = value.toString(); // Asegurar que el input refleje el valor correcto
      this.actualizarValorCritico(); // Guardar el valor corregido
    }, 50);
  }

  // 📌 Cargar el valor desde localStorage al iniciar
  cargarValorCritico() {
    const valorGuardado = localStorage.getItem('valorCritico');
    if (valorGuardado !== null) {
      this.valorCritico = parseInt(valorGuardado, 10);
    }
  }

  //Consigue el total del puntaje sumando
  get totalPuntaje(): number {
    return this.complianceData.reduce((sum, puntaje) => sum + puntaje.puntaje, 0);
  }

  //Consigue el total de los porcentajes sumando
  get cumplimientoTotal(): number {
    return this.complianceData.reduce((sum, item) => sum + item.cumpleW, 0);
  }

  //Consigue el total de las preguntas sumando
  get totalPreguntas(): number {
    return this.complianceData.reduce((sum, pregunta) => sum + pregunta.preguntas, 0);
  }

  get probabilidad(): number {
    if (this.scoring < 20) return 5;
    if (this.scoring >= 20 && this.scoring < 40) return 4;
    if (this.scoring >= 40 && this.scoring < 60) return 3;
    if (this.scoring >= 60 && this.scoring < 80) return 2;
    return 1;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}