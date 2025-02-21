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
  currentDate = new Date();
  valorCritico = 90;
  excedentes = 10_000_000_000;
  salarioMinimo = 1_423_500;
  multa = 200;
  impactoCalculado = 0;
  nProbabilidad = 0;
  _riesgoLegal = 0;
  scoring = 0;

  complianceData: ComplianceItem[] = [
    { riesgo: 'Incumplimientos específicos del Capítulo X', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Otros incumplimientos detectados', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos en la Debida Diligencia', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Incumplimientos en las Etapas del SAGRILAFT', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 },
    { riesgo: 'Violación de leyes y regulación', puntaje: 0, items: 0, preguntas: 0, nivelCumplimiento: 0, participacionW: 0, cumpleW: 0 }
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private pdf: PdfGeneratorService,
    private excel: ExportExcelService
  ) {}

  ngOnInit() {
    ['capituloX', 'ddi', 'leyes', 'ros', 'sagrilaft', 'otros'].forEach(type => {
      if (!this.dataService.hasData(type)) this.initializeMaxData();
    });
    this.updateAllComplianceData();
    this.cargarValorCritico();
    this.calcularImpacto();
    this.calcularRiesgoLegal();
  }

  private initializeMaxData() {
    this.complianceData = [
      { riesgo: 'Incumplimientos específicos del Capítulo X', puntaje: 13, items: 7, preguntas: 13, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 },
      { riesgo: 'Otros incumplimientos detectados', puntaje: 8, items: 4, preguntas: 8, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 },
      { riesgo: 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)', puntaje: 5, items: 2, preguntas: 5, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 },
      { riesgo: 'Incumplimientos en la Debida Diligencia', puntaje: 10, items: 5, preguntas: 10, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 },
      { riesgo: 'Incumplimientos en las Etapas del SAGRILAFT', puntaje: 8, items: 4, preguntas: 8, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 },
      { riesgo: 'Violación de leyes y regulación', puntaje: 18, items: 11, preguntas: 18, nivelCumplimiento: 100, participacionW: 1, cumpleW: 100 }
    ];
  }

  updateAllComplianceData() {
    ['capituloX', 'otros', 'ddi', 'leyes', 'ros', 'sagrilaft'].forEach(type => {
      const [puntaje, items, preguntas] = [this.dataService.getTotalCompliance(type), this.dataService.getGroupCount(type), this.dataService.getQuestionCount(type)];
      this.updateComplianceData(type, puntaje, items, preguntas);
    });
    this.recalculateParticipationAndScores();
    this.calcularScoring();
  }

  updateComplianceData(type: string, totalCompliance: number, groupCount: number, questionCount: number) {
    const item = this.complianceData.find(i => i.riesgo === this.getRiskName(type));
    if (item) {
      item.puntaje = totalCompliance || item.puntaje;
      item.items = groupCount || item.items;
      item.preguntas = questionCount || item.preguntas;
      item.nivelCumplimiento = this.calcNivel(item.puntaje, item.preguntas);
    }
  }

  recalculateParticipationAndScores() {
    const totalPreguntas = this.complianceData.reduce((sum, i) => sum + i.preguntas, 0);
    this.complianceData.forEach(item => {
      item.participacionW = totalPreguntas ? item.preguntas / totalPreguntas : 0;
      item.cumpleW = this.calcCumple(item.nivelCumplimiento, item.participacionW);
    });
  }

  private getRiskName(type: string) {
    return {
      'capituloX': 'Incumplimientos específicos del Capítulo X',
      'otros': 'Otros incumplimientos detectados',
      'ddi': 'Incumplimientos en la Debida Diligencia',
      'leyes': 'Violación de leyes y regulación',
      'ros': 'Incumplimientos relacionados con el Reporte de Operaciones Sospechosas (ROS)',
      'sagrilaft': 'Incumplimientos en las Etapas del SAGRILAFT'
    }[type] || '';
  }

  private calcNivel(puntaje: number, preguntas: number) {
    return preguntas ? (1 - ((puntaje - preguntas) / (preguntas * 4))) * 100 : 0;
  }

  private calcParticipacion(preguntas: number, total: number) {
    return total ? preguntas / total : 0;
  }

  private calcCumple(nivel: number, participacion: number) {
    return nivel * participacion;
  }

  calcularScoring() {
    this.cargarValorCritico();
    this.scoring = this.valorCritico === 100 
      ? (this.cumplimientoTotal === 100 ? 100 : 0) 
      : Math.max(0, ((this.cumplimientoTotal - this.valorCritico) / (100 - this.valorCritico)) * 100);
    localStorage.setItem('scoring', this.scoring.toString());
  }

  cargarValorCritico() {
    const saved = localStorage.getItem('valorCritico');
    this.valorCritico = saved ? parseInt(saved, 10) : 90;
  }

  calcularImpacto() {
    this.impactoCalculado = this.salarioMinimo * this.multa;
  }

  calcularProvisiónRecomendada() {
    this.impactoCalculado = 284_700_000;
  }

  actualizarValorCritico() {
    this.valorCritico = Math.max(0, Math.min(100, this.valorCritico));
    localStorage.setItem('valorCritico', this.valorCritico.toString());
    this.calcularScoring();
    this.calcularRiesgoLegal();
    this.currentDate = new Date();
  }

  validarInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let value = parseInt(input.value, 10);
      this.valorCritico = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
      input.value = this.valorCritico.toString();
      this.actualizarValorCritico();
    }, 50);
  }

  calcularProbImp() {
    if (this.probabilidad === 5) this.nProbabilidad = 1; // Probabilidad 5 (alto riesgo) directamente
    else if (this.probabilidad === 4) this.nProbabilidad = 0.8;
    else if (this.probabilidad === 3) this.nProbabilidad = 0.6;
    else if (this.probabilidad === 2) this.nProbabilidad = 0.4;
    else this.nProbabilidad = 0;
  }

  calcularRiesgoLegal() {
    this.calcularProbImp();
    this._riesgoLegal = this.nProbabilidad * this.impactoCalculado;
  }

  descargarInforme() {
    this.pdf.generarPDF(this.complianceData, {
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
    });
  }

  descargarIncumplimientos() {
    this.updateAllComplianceData();
    const filtered = [];
    for (const type in this.dataService.getAllComplianceData()) {
      for (const item of this.dataService.getAllComplianceData()[type]) {
        if (item.questions) for (const q of item.questions) if (this.getComplianceScore(q.compliance) >= 3)
          filtered.push({ Título: item.riesgo, Pregunta: q.text, Estado: q.compliance });
      }
    }
    if (!filtered.length) alert('No hay incumplimientos bajos');
    else this.excel.exportToExcel(filtered, 'Incumplimientos_' + new Date().toISOString().split('T')[0]);
  }

  descargarMetodologia() {
    const a = document.createElement('a');
    a.href = 'assets/metodologia.pdf';
    a.download = 'metodologia.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  descargarPresentacion() {
    const a = document.createElement('a');
    a.href = 'assets/presentacion.pdf';
    a.download = 'presentacion.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  get riesgoLegal() { return this.nProbabilidad ? this._riesgoLegal : 0; }
  get riesgoLegalA() { return this.nProbabilidad ? this._riesgoLegal * 1.65 + (this.nProbabilidad ? 0 : 0.5 * this.impactoCalculado) : 0.5 * this.impactoCalculado; }
  get riesgoLegalC() { return this.nProbabilidad ? this._riesgoLegal * 2.33 + (this.nProbabilidad ? 0 : 0.5 * 2 * this.impactoCalculado) : 0.5 * 2 * this.impactoCalculado; }
  get impactoExc() { return this.nProbabilidad ? this.riesgoLegal / this.excedentes * 100 : 0; }
  get impactoExcA() { return this.nProbabilidad ? this.riesgoLegalA / this.excedentes * 100 : 0.5 * this.impactoCalculado / this.excedentes * 100; }
  get impactoExcC() { return this.nProbabilidad ? this.riesgoLegalC / this.excedentes * 100 : 0.5 * 2 * this.impactoCalculado / this.excedentes * 100; }
  get totalPuntaje() { return this.complianceData.reduce((sum, i) => sum + i.puntaje, 0); }
  get totalPreguntas() { return this.complianceData.reduce((sum, i) => sum + i.preguntas, 0); }
  get probabilidad() { return this.scoring <= 20 ? 5 : this.scoring <= 40 ? 4 : this.scoring <= 60 ? 3 : this.scoring <= 80 ? 2 : 1; }
  get cumplimientoTotal() { 
    const total = this.complianceData.reduce((sum, i) => sum + i.nivelCumplimiento, 0);
    return this.complianceData.length ? Math.round(total / this.complianceData.length) : 0;
  }

  private getComplianceScore(compliance: string) { return { 'NO CUMPLE': 5, 'CUMPLIMIENTO BAJO': 4, 'CUMPLIMIENTO MODERADO': 3, 'CUMPLIMIENTO ALTO': 2, 'CUMPLIMIENTO TOTAL': 1 }[compliance.toUpperCase()] || 1; }
}