import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ngx-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("baseChart") chart:BaseChartDirective;
  datasets: Array<any> = []
  labels: Array<any> = [];
  lineChartType = 'line';

  options: any = {
    responsive: true,
    scales : {
      yAxes: [],
      xAxes: [{
        min: '2018-01-29 10:08:00', // how to?
      //  max: '2018-01-29 10:48:00', // how to?
        type: 'time',
        time: {
          unit: 'minute',
          unitStepSize: 10,
          displayFormats: {
            'second': 'HH:mm:ss',
            'minute': 'HH:mm:ss',
            'hour': 'HH:mm',
          },
        },
        }],
    },
  }

  constructor(){ }

  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  update():any{
    this.datasets.push(...([
      { data: [ {x: "2018-01-29 10:08:00", y:121}, {x: "2018-01-29 13:08:00", y:11}],
        label: "Test2"
      }]))
    this.datasets[0].borderColor="#00FF00"
    this.datasets[0].data[0].y = 100
    this.chart.chart.update()
  }
}
