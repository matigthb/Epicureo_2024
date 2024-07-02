import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../services/data.service';
import { Colors } from 'chart.js';
import { Router } from '@angular/router';

Chart.register(Colors);

Chart.register(...registerables);

interface Respuesta {
  [key: number]: any; // Define una interfaz para las respuestas
}

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements AfterViewInit {
  @ViewChild('chartCanvas1', { static: false }) chartCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas2', { static: false }) chartCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas3', { static: false }) chartCanvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas4', { static: false }) chartCanvas4!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas5', { static: false }) chartCanvas5!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas6', { static: false }) chartCanvas6!: ElementRef<HTMLCanvasElement>;
  // Agrega más ViewChild según sea necesario

  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;
  chart6: any;


  constructor(private dataService: DataService, private router: Router) {}

  ngAfterViewInit() {
    this.loadChart1();
    this.loadChart2();
    this.loadChart3();
    this.loadChart4();
    this.loadChart5();
    this.loadChart6();
    
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

  loadChart1() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      console.log(respuestas);
      const conteoRespuestas1: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      respuestas.forEach((respuesta: any) => {
        const respuestaId1 = respuesta[1];
        if (conteoRespuestas1[respuestaId1] !== undefined) {
          conteoRespuestas1[respuestaId1]++;
        }
      });

      const data1 = Object.values(conteoRespuestas1);

      this.chart1 = new Chart(this.chartCanvas1.nativeElement, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5'],
          datasets: [{
            label: '',
            data: data1,
            backgroundColor: [
              '#ff0000',
              '#ffe100',
              '#15ff00',
              '#001aff',
              '#ff00fb'
                
            ],
            borderColor: '#000000',
            borderWidth: 2
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

  loadChart2() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      
      const conteoRespuestas2: { [key: string]: number } = {
        'Muy mala': 0,
        'Mala': 0,
        'Decente': 0,
        'Buena': 0,
        'Muy Buena': 0
      };

      respuestas.forEach((respuesta: any) => {
        const respuestaId2 = respuesta[2];
        if (conteoRespuestas2[respuestaId2] !== undefined) {
          conteoRespuestas2[respuestaId2]++;
        }
      });

      const data2 = Object.values(conteoRespuestas2);

      this.chart2 = new Chart(this.chartCanvas2.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Muy mala', 'Mala', 'Decente', 'Buena', 'Muy Buena'],
          datasets: [{
            label: '',
            data: data2,
            backgroundColor: [
              '#ff0000',
              '#ffe100',
              '#15ff00',
              '#001aff',
              '#ff00fb'
                
            ],
            borderColor: '#000000',
            borderWidth: 2
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

  loadChart3() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      
      const conteoRespuestas3: { [key: string]: number } = {
        'Si': 0,
        'No': 0,
        
      };

      respuestas.forEach((respuesta: any) => {
        const respuestaId3 = respuesta[3];
        if (conteoRespuestas3[respuestaId3] !== undefined) {
          conteoRespuestas3[respuestaId3]++;
        }
      });

      const data3 = Object.values(conteoRespuestas3);

      this.chart3 = new Chart(this.chartCanvas3.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Si', 'No'],
          datasets: [{
            label: '',
            data: data3,
            backgroundColor: [
              '#ff0000',
              '#ffe100',
    
            ],
            borderColor: '#000000',
            borderWidth: 2
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

  loadChart4() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      
      const conteoRespuestas4: { [key: string]: number } = {
        'Muy malo': 0,
        'Malo': 0,
        'Decente': 0,
        'Bueno': 0,
        'Muy Bueno': 0
      };

      respuestas.forEach((respuesta: any) => {
        const respuestaId4 = respuesta[4];
        if (conteoRespuestas4[respuestaId4] !== undefined) {
          conteoRespuestas4[respuestaId4]++;
        }
      });

      const data4 = Object.values(conteoRespuestas4);

      this.chart4 = new Chart(this.chartCanvas4.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Muy malo', 'Malo', 'Decente', 'Bueno', 'Muy Bueno'],
          datasets: [{
            label: '',
            data: data4,
            backgroundColor: [
              '#ff0000',
              '#ffe100',
              '#15ff00',
              '#001aff',
              '#ff00fb'
                
            ],
            borderColor: '#000000',
            borderWidth: 2
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

  loadChart5() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      
      const conteoRespuestas5: { [key: string]: number } = {
        'happy': 0,
        'sad': 0,
        
      };

      respuestas.forEach((respuesta: any) => {
        const respuestaId5 = respuesta[5];
        if (conteoRespuestas5[respuestaId5] !== undefined) {
          conteoRespuestas5[respuestaId5]++;
        }
      });

      const data5 = Object.values(conteoRespuestas5);

      this.chart5 = new Chart(this.chartCanvas5.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Contento', 'Triste'],
          datasets: [{
            label: '',
            data: data5,
            backgroundColor: [
              '#48ff00',
              '#52ffd1',
    
            ],
            borderColor: '#000000',
            borderWidth: 2
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

  loadChart6() {
    this.dataService.getRespuestas().subscribe((respuestas: any[]) => {
      
      const conteoRespuestas6: { [key: string]: number } = {
        'Muy malos': 0,
        'Malos': 0,
        'Decente': 0,
        'Buenos': 0,
        'Muy Buenos': 0
      };

      respuestas.forEach((respuesta: any) => {
        const respuestaId6 = respuesta[6];
        if (conteoRespuestas6[respuestaId6] !== undefined) {
          conteoRespuestas6[respuestaId6]++;
        }
      });

      const data4 = Object.values(conteoRespuestas6);

      this.chart6 = new Chart(this.chartCanvas6.nativeElement, {
        type: 'line',
        data: {
          labels: ['Muy malos', 'Malos', 'Decentes', 'Buenos', 'Muy Buenos'],
          datasets: [{
            label: '',
            data: data4,
            backgroundColor: [
              '#ff0000',
              '#ffe100',
              '#15ff00',
              '#001aff',
              '#ff00fb'
                
            ],
            borderColor: '#000000',
            borderWidth: 2
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
