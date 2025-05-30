import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';

export interface Pregunta {
  id: number;
  pregunta: string;
  tipo: 'multiple' | 'scale' | 'emoji' | 'radio';
  opciones?: (number |string)[] ;
}

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
})
export class EncuestasPage implements OnInit{
  encuesta = {
    preguntas: [
      { id: 1, pregunta: 'Califica la calidad de la comida', tipo: 'scale', opciones: [1, 2, 3, 4, 5] },
      { id: 2, pregunta: 'Califica la estética del establecimiento',tipo: 'multiple',opciones: ['Muy mala','Mala', 'Decente', 'Buena', 'Muy Buena'] },
      { id: 3, pregunta: 'Tuviste una buena atencion de los mozos?', tipo: 'radio',opciones: ['Si','No'] },
      { id: 4, pregunta: 'Califica el tiempo de espera', tipo: 'multiple', opciones: ['Muy malo','Malo', 'Decente', 'Bueno', 'Muy Bueno'] },
      { id: 5, pregunta: 'Califica el funcionamiento de la App', tipo: 'emoji', opciones: ['happy','sad'] },
      { id: 6, pregunta: 'Califica los precios de los productos',tipo: 'multiple', opciones: ['Muy malos','Malos', 'Decentes', 'Buenos', 'Muy Buenos']},
      
    ] as Pregunta[],
    respuestas: {} as Record<string, any>
  };

  ruta : string = "no";
  

  constructor(private alertController: AlertController, private route : ActivatedRoute,private router: Router, private dataService: DataService ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.ruta = params['pedidoRealizado'];
    });

  }

  async enviarRespuestas() {
    console.log(this.encuesta.respuestas);
    
    await this.dataService.guardarRespuestas(this.encuesta.respuestas);
    
    this.dataService.mandarToast("Respuestas enviadas", "success");
    this.router.navigate(['/qrs'], { queryParams: { pedidoRealizado: this.ruta } });
  }
  
  goBack(){
    this.router.navigate(['/qrs'], { queryParams: { pedidoRealizado: this.ruta } });
  }
}
