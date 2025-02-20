import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generarPDF(complianceData: any[], resumen: any) {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Riesgo Legal', 14, 15);

    // Información de la empresa
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`PROBABILIDAD: ${resumen.probabilidad}`, 14, 35);
    doc.text(`IMPACTO: $ ${resumen.impactoCalculado.toLocaleString('es-CO')}`, 14, 45);
    doc.text(`VALOR CRITICO: ${resumen.valorCritico}`, 14, 55);
    doc.text(`SCORING: ${resumen.scoring.toFixed(2)}`, 14, 65);
    doc.text(`RIESGO LEGAL: $ ${Math.round(resumen.riesgoLegal).toLocaleString('es-CO')}`, 14, 75);

    // Tabla de resumen de escenarios
    doc.text('Resumen de Escenarios:', 14, 85);
    autoTable(doc, {
      startY: 90,
      head: [['VARIABLES', 'ESCENARIO ACTUAL', 'ESCENARIO ALTA AFECTACIÓN', 'ESCENARIO CATASTRÓFICO']],
      body: [
        [
          "RIESGO LEGAL",
          `$ ${Math.round(resumen.riesgoLegal).toLocaleString('es-CO')}`,
          `$ ${Math.round(resumen.riesgoLegalA).toLocaleString('es-CO')}`,
          `$ ${Math.round(resumen.riesgoLegalC).toLocaleString('es-CO')}`
        ],
        [
          "EXCEDENTES ÚLTIMO AÑO",
          `$ ${Math.round(resumen.excedentes).toLocaleString('es-CO')}`,
          `$ ${Math.round(resumen.excedentes).toLocaleString('es-CO')}`,
          `$ ${Math.round(resumen.excedentes).toLocaleString('es-CO')}`
        ],
        [
          "IMPACTO SOBRE EXCEDENTES",
          `${resumen.impactoExc.toFixed(2)} %`,
          `${resumen.impactoExcA.toFixed(2)} %`,
          `${resumen.impactoExcC.toFixed(2)} %`
        ]
      ],
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    // Espacio antes de la tabla
    doc.text('Detalles del Cumplimiento:', 14, 140);

    // Convertir datos en formato de tabla
    autoTable(doc, {
      startY: 150, // Para evitar superposición
      head: [['Riesgo', 'Puntaje', 'Ítems', 'Preguntas', 'Nivel Cumplimiento']],
      body: complianceData.map(item => [
        item.riesgo,
        { content: item.puntaje, styles: { halign: 'center' } },
        { content: item.items, styles: { halign: 'center' } },
        { content: item.preguntas, styles: { halign: 'center' } },
        { content: `${item.nivelCumplimiento.toFixed(2)}%`, styles: { halign: 'center' } }
      ]),
      theme: 'grid',
      styles: { fontSize: 10, halign: 'center' }, // Asegura alineación en general
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] } // Color de encabezado como en la imagen
    });


    // Guardar el PDF
    doc.save('Reporte_Riesgo_Legal.pdf');
  }
}
