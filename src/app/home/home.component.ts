import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PdfGeneratorService } from '../services/pdf-generator.service';
import { DataService } from '../services/data.service';
import { ExportExcelService } from '../services/export-excel.service';

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
  currentDate: Date = new Date();
  valorCritico: number = 90;
  excedentes: number = 10000000000;
  salarioMinimo: number = 1423500;
  multa: number = 200;
  impactoCalculado: number = 0;
  nProbabilidad: number = 0;
  _riesgoLegal: number = 0;
  scoring: number = 0;

  complianceData: ComplianceItem[] = [
    { riesgo: 'Incumplimientos específicos del Capítulo X', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Otros incumplimientos detectados', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0.00, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos en la Debida Diligencia', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0.00, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos en las Etapas del SAGRILAFT', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0.00, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Violación de leyes y regulación', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0.00, participacionW: 0, cumpleW: 0 }
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private pdfGenerator: PdfGeneratorService,
    private exportExcelService: ExportExcelService
  ) {}

  ngOnInit(): void {
    this.updateAllComplianceData();
    this.cargarValorCritico();
    this.calcularImpacto();
    this.calcularRiesgoLegal();
  }

  updateAllComplianceData(): void {
    const complianceTypes = ['capituloX', 'otros', 'ddi', 'leyes', 'ros', 'sagrilaft'];
    complianceTypes.forEach(type => {
      const totalCompliance = this.dataService.getTotalCompliance(type);
      const groupCount = this.dataService.getGroupCount(type);
      const questionCount = this.dataService.getQuestionCount(type);
      this.updateComplianceData(type, totalCompliance, groupCount, questionCount);
    });
    this.recalculateParticipationAndScores();
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

  recalculateParticipationAndScores(): void {
    const totalPreguntasActual = this.complianceData.reduce((sum, item) => sum + item.preguntas, 0);
    this.complianceData.forEach(item => {
      item.participacionW = this.calculateParticipacionW(item.preguntas, totalPreguntasActual);
      item.cumpleW = this.calculateCumpleW(item.nivelCumplimiento, item.participacionW);
    });
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
    if (questionCount === 0) return 0;
    const maxCompliance = questionCount * 5;
    return (1 - ((totalCompliance - questionCount) / (maxCompliance - questionCount))) * 100;
  }

  calculateParticipacionW(questionCount: number, totalPreguntas: number): number {
    return totalPreguntas ? (questionCount / totalPreguntas) : 0;
  }

  calculateCumpleW(calculateParticipacionW: number, calculateNivelCumplimiento: number): number {
    return calculateNivelCumplimiento * calculateParticipacionW;
  }

  calcularScoring(): void {
    this.cargarValorCritico();
    if (this.valorCritico === 100) {
      this.scoring = this.cumplimientoTotal === 100 ? 100 : 0;
    } else {
      this.scoring = Math.max(0, ((this.cumplimientoTotal - this.valorCritico) / (100 - this.valorCritico)) * 100);
    }
    localStorage.setItem('scoring', this.scoring.toString());
  }

  cargarScoring(): void {
    const scoringGuardado = localStorage.getItem('scoring');
    if (scoringGuardado !== null) {
      this.scoring = parseFloat(scoringGuardado);
    }
  }

  calcularImpacto(): void {
    this.impactoCalculado = this.salarioMinimo * this.multa;
  }

  actualizarValorCritico(): void {
    this.valorCritico = Math.max(0, Math.min(100, this.valorCritico));
    localStorage.setItem('valorCritico', this.valorCritico.toString());
    this.calcularScoring();
    this.calcularRiesgoLegal();
    this.currentDate = new Date();
  }

  validarInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let value = parseInt(input.value, 10);
      this.valorCritico = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
      input.value = this.valorCritico.toString();
      this.actualizarValorCritico();
    }, 50);
  }

  cargarValorCritico(): void {
    const valorGuardado = localStorage.getItem('valorCritico');
    if (valorGuardado !== null) {
      this.valorCritico = parseInt(valorGuardado, 10);
    }
  }

  private calculateRiesgoLegalWithFactor(factor: number): number {
    const factorSqrt = Math.sqrt(this.complianceData.length);
    return this._riesgoLegal + factor * (this._riesgoLegal / factorSqrt);
  }

  calcularProbImp(): void {
    if (this.probabilidad === 5) {
      this.nProbabilidad = 1;
    } else if (this.probabilidad === 4) {
      this.nProbabilidad = 0.8;
    } else if (this.probabilidad === 3) {
      this.nProbabilidad = 0.6;
    } else if (this.probabilidad === 2) {
      this.nProbabilidad = 0.4;
    } else if (this.probabilidad === 1) {
      this.nProbabilidad = 0;
    }
  }

  calcularRiesgoLegal(): void {
    this.calcularProbImp();
    this._riesgoLegal = this.nProbabilidad * this.impactoCalculado;
  }

  descargarInforme() {
    const resumen = {
      probabilidad: this.probabilidad,
      impactoCalculado: this.impactoCalculado,
      valorCritico: this.valorCritico,
      scoring: this.scoring,
      riesgoLegal: this.riesgoLegal,
      riesgoLegalA: this.riesgoLegalA,
      riesgoLegalC: this.riesgoLegalC,
      excedentes: this.excedentes,
      impactoExc: this.impactoExc,
      impactoExcA: this.impactoExcA,
      impactoExcC: this.impactoExcC
    };
    this.pdfGenerator.generarPDF(this.complianceData, resumen);
  }

  descargarIncumplimientos(): void {
    this.updateAllComplianceData();

    const preguntasFiltradas: { Título: string; Pregunta: string; Estado: string }[] = [];
    const complianceData = this.dataService.getAllComplianceData();
    
    Object.keys(complianceData).forEach((type) => {
      const categoryData = complianceData[type];
      categoryData.forEach((item) => {
        if (item.questions) {
          item.questions.forEach((question) => {
            const score = this.getComplianceScore(question.compliance);
            if (score >= 3) {
              preguntasFiltradas.push({
                Título: item.riesgo,
                Pregunta: question.text,
                Estado: question.compliance,
              });
            }
          });
        }
      });
    });

    console.log('Preguntas filtradas:', preguntasFiltradas);

    if (preguntasFiltradas.length === 0) {
      console.warn('No hay incumplimientos con puntaje 3 o menor para exportar.');
      return;
    }

    this.exportExcelService.exportToExcel(preguntasFiltradas, 'Incumplimientos_' + new Date().toISOString().split('T')[0]);
  }

  getComplianceScore(compliance: string): number {
    const scores: { [key: string]: number } = {
      'NO CUMPLE': 5,
      'CUMPLIMIENTO BAJO': 4,
      'CUMPLIMIENTO MODERADO': 3,
      'CUMPLIMIENTO ALTO': 2,
      'CUMPLIMIENTO TOTAL': 1
    };
    return scores[compliance.toUpperCase()] || 1;
  }

  descargarMetodologia() {
    const link = document.createElement('a');
    link.href = 'assets/metodologia.pdf';
    link.setAttribute('download', 'metodologia.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  get totalPuntaje(): number {
    return this.complianceData.reduce((sum, item) => sum + item.puntaje, 0);
  }

  get cumplimientoTotal(): number {
    return this.complianceData.reduce((sum, item) => sum + item.cumpleW, 0);
  }

  get totalPreguntas(): number {
    return this.complianceData.reduce((sum, item) => sum + item.preguntas, 0);
  }

  get probabilidad(): number {
    if (this.scoring < 20) return 5;
    if (this.scoring < 40) return 4;
    if (this.scoring < 60) return 3;
    if (this.scoring < 80) return 2;
    return 1;
  }

  get riesgoLegal(): number {
    return this.nProbabilidad === 0 ? 0 : this._riesgoLegal;
  }

  get riesgoLegalA(): number {
    return this.nProbabilidad === 0 ? 0.5 * this.impactoCalculado : this.calculateRiesgoLegalWithFactor(1.65);
  }

  get riesgoLegalC(): number {
    return this.nProbabilidad === 0 ? 0.5 * 2 * this.impactoCalculado : this.calculateRiesgoLegalWithFactor(2.33);
  }

  get impactoExc(): number {
    return this.nProbabilidad === 0 ? 0 : this.riesgoLegal / this.excedentes * 100;
  }

  get impactoExcA(): number {
    return this.nProbabilidad === 0 ? 0.5 * this.impactoCalculado / this.excedentes * 100 : this.riesgoLegalA / this.excedentes * 100;
  }

  get impactoExcC(): number {
    return this.nProbabilidad === 0 ? 0.5 * 2 * this.impactoCalculado / this.excedentes * 100 : 0.5 * 2 * this.riesgoLegalC / this.excedentes * 100;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}