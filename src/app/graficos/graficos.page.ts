import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../services/data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {
  @ViewChild('chartCanvas', { static: true }) private chartCanvas!: ElementRef;
  chart: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadChart();
  }

  loadChart() {
    this.dataService.getRespuestas().subscribe(respuestas => {
      const labels = Object.keys(respuestas);
      const data = Object.values(respuestas);

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Resultados de la pregunta',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              type: 'linear'
            }
          }
        }
      });
    });
  }
}
