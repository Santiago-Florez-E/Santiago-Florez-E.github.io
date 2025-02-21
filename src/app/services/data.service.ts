import { Injectable } from '@angular/core';

export interface SavedItems {
  riesgo: string;
  puntaje: number;
  items: number;
  preguntas: number;
  nivelCumplimiento: number;
  questions: { text: string; compliance: string }[]; 
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private complianceData: { [key: string]: SavedItems[] } = {
    'capituloX': [],
    'otros': [],
    'ddi': [],
    'leyes': [],
    'ros': [],
    'sagrilaft': []
  };

  private totalCompliance: { [key: string]: number } = {
    'capituloX': 0,
    'otros': 0,
    'ddi': 0,
    'leyes': 0,
    'ros': 0,
    'sagrilaft': 0
  };

  private groupCount: { [key: string]: number } = {
    'capituloX': 0,
    'otros': 0,
    'ddi': 0,
    'leyes': 0,
    'ros': 0,
    'sagrilaft': 0
  };

  private questionCount: { [key: string]: number } = {
    'capituloX': 0,
    'otros': 0,
    'ddi': 0,
    'leyes': 0,
    'ros': 0,
    'sagrilaft': 0
  };

  constructor() {
    this.loadDataFromLocalStorage(); // Cargar datos almacenados al iniciar el servicio
  }

  hasData(type: string): boolean {
    return this.totalCompliance[type] !== 0 || this.groupCount[type] !== 0 || this.questionCount[type] !== 0 || this.complianceData[type].length > 0;
  }

  /* ===============================
       Métodos para manejar complianceData
  =============================== */

  setComplianceData(type: string, data: SavedItems[]): void {
    this.complianceData[type] = data;

    //Recalcular totalCompliance, groupCount, y questionCount basados en los datos de SavedItems
    this.totalCompliance[type] = data.reduce((sum, item) => sum + item.puntaje, 0);
    this.groupCount[type] = data.reduce((sum, item) => sum + item.items, 0);
    this.questionCount[type] = data.reduce((sum, item) => sum + item.preguntas, 0);

    localStorage.setItem(`complianceData_${type}`, JSON.stringify(data));
    localStorage.setItem(`totalCompliance_${type}`, this.totalCompliance[type].toString());
    localStorage.setItem(`groupCount_${type}`, this.groupCount[type].toString());
    localStorage.setItem(`questionCount_${type}`, this.questionCount[type].toString());
  }
  
  getAllComplianceData(): { [key: string]: SavedItems[] } {
    return this.complianceData;
  }
  
  getComplianceData(type: string): SavedItems[] {
    return this.complianceData[type];
  }

  setTotalCompliance(type: string, total: number): void {
    this.totalCompliance[type] = total;
    localStorage.setItem(`totalCompliance_${type}`, total.toString());
  }

  getTotalCompliance(type: string): number {
    return this.totalCompliance[type];
  }

  setGroupCount(type: string, count: number): void {
    this.groupCount[type] = count;
    localStorage.setItem(`groupCount_${type}`, count.toString());
  }

  getGroupCount(type: string): number {
    return this.groupCount[type];
  }

  setQuestionCount(type: string, count: number): void {
    localStorage.setItem(`questionCount_${type}`, count.toString());
  }

  getQuestionCount(type: string): number {
    return this.questionCount[type];
  }
  
  private loadDataFromLocalStorage(): void {
    ['capituloX', 'otros', 'ddi', 'leyes', 'ros', 'sagrilaft'].forEach(type => {
      const storedCompliance = localStorage.getItem(`totalCompliance_${type}`);
      const storedGroups = localStorage.getItem(`groupCount_${type}`);
      const storedQuestions = localStorage.getItem(`questionCount_${type}`);
      const storedData = localStorage.getItem(`complianceData_${type}`);
  
      if (storedCompliance) {
        this.totalCompliance[type] = Number(storedCompliance);
      }
      if (storedGroups) {
        this.groupCount[type] = Number(storedGroups);
      }
      if (storedQuestions) {
        this.questionCount[type] = Number(storedQuestions);
      }
      if (storedData) {
        this.complianceData[type] = JSON.parse(storedData);
      }
    });
  }
}