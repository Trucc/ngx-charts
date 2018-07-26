import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective, ColorHelper} from 'ngx-charts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("baseChart") chart:BaseChartDirective;
  datasets: Array<any> = [{ data: [ {x: "2018-01-29 10:08:00", y:21}, {x: "2018-01-29 13:08:00", y:121}],
  label: "Test2",type:'line'
}]
  labels: Array<any> = [];
  lineChartType = 'bar';

  options: any = {
    responsive: true,
    scales : {
      yAxes: [],
      xAxes: [{
        type: 'time'
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
        label: "Test2",type:'line',
        /* Attention à bien mettre une couleur */
        ...ColorHelper.getColors("line",2)
      }]))
    this.datasets[0].data[0].y = 100
    this.chart.update()
  }

  changeData():any{
    this.datasets[0].data = [{x:"2018-08-26T12:55:05.033Z", y:1},{x:"2018-09-26T12:55:05.033Z", y:52}]
    this.chart.update()
  }

  remove(){
    this.datasets.splice(this.datasets.length-1,1)
    this.chart.update()
  }
}
