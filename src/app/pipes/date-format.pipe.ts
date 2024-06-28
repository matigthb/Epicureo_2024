import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(milliseconds: string): string {
    const fecha = new Date(Number(milliseconds));
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const dia = fecha.getDate().toString();
    const mes = (fecha.getMonth() + 1).toString(); // Los meses comienzan desde 0, por lo que sumamos 1
    const anio = fecha.getFullYear().toString();
    
    return `${horas}:${minutos}-${dia}/${mes}/${anio}`;
  }

}
