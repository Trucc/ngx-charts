import {
  OnDestroy,
  OnInit,
  OnChanges,
  EventEmitter,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  Directive
} from '@angular/core';

import { Chart } from 'chart.js';
import { ColorHelper } from '../helpers/color';
import { Colors } from '../models/chartColor.model';

/* tslint:disable-next-line */
@Directive({
  selector: 'canvas[baseChart]',
  exportAs: 'base-chart'
})
export class BaseChartDirective implements OnDestroy, OnChanges, OnInit{

  public static defaultColors:Array<number[]> = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [231, 233, 237],
    [75, 192, 192],
    [151, 187, 205],
    [220, 220, 220],
    [247, 70, 74],
    [70, 191, 189],
    [253, 180, 92],
    [148, 159, 177],
    [77, 83, 96]
  ];

  @Input() public datasets:any[];
  @Input() public labels:Array<any> = [];
  @Input() public options:any = {};
  @Input() public chartType:string;
  @Input() public colors:Array<any>;
  @Input() public legend:boolean;

  @Output() public chartClick:EventEmitter<any> = new EventEmitter();
  @Output() public chartHover:EventEmitter<any> = new EventEmitter();

  public ctx:any;
  public chart:any;
  private cvs:any;
  private initFlag:boolean = false;

  private element:ElementRef;

  public constructor(element:ElementRef) {
    this.element = element;
  }

  public ngOnInit():any {
    this.ctx = this.element.nativeElement.getContext('2d');
    this.cvs = this.element.nativeElement;
    this.initFlag = true;
    if (this.datasets) {
      this.refresh();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.initFlag) {
      // Check if the changes are in the data or datasets
      //console.log(changes)
      if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
       /* if (changes['data']) {
          this.updateChartData(changes['data'].currentValue);
        } else {
          this.updateChartData(changes['datasets'].currentValue);
        }

        this.chart.update();*/
      } else {
      // otherwise rebuild the chart
        this.refresh();
      }
    }
  }

  public ngOnDestroy():any {
    if (this.chart) {
      this.chart.destroy();
      this.chart = void 0;
    }
  }

  public update():any{
    this.chart.update()
  }

  public getChartBuilder(ctx:any/*, data:Array<any>, options:any*/):any {
    console.log(this.datasets)
    this.prepareDatasets();
    console.log(this.datasets)
    let options:any = Object.assign({}, this.options);
    if (this.legend === false) {
      options.legend = {display: false};
    }
    // hock for onHover and onClick events
    options.hover = options.hover || {};
    if (!options.hover.onHover) {
      options.hover.onHover = (active:Array<any>) => {
        if (active && !active.length) {
          return;
        }
        this.chartHover.emit({active});
      };
    }

    if (!options.onClick) {
      options.onClick = (event:any, active:Array<any>) => {
        this.chartClick.emit({event, active});
      };
    }

    let opts = {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: options
    };

    return new Chart(ctx, opts);
  }

  /*private updateChartData(newDataValues: number[] | any[]): void {
    if (Array.isArray(newDataValues[0].data)) {
      this.datasets.forEach((dataset: any, i: number) => {
        dataset.data = newDataValues[i].data;

        if (newDataValues[i].label) {
          dataset.label = newDataValues[i].label;
        }
      });
    } else {
      this.datasets[0].data = newDataValues;
    }
  }*/

  private prepareDatasets():any {
    // in case if datasets is not provided

    if (!this.datasets) {
      throw new Error(`ng-charts configuration error,
      datasets field are required to render char ${this.chartType}, even if it's empty`);
    }
     // in case if datasets is provided and it's not empty
    if (this.datasets && this.datasets.length) {
      for(let i =0;i<this.datasets.length;i++){
        // If random color was triggered
        if( !(this.datasets[i].hasOwnProperty("randomizeColor") && !this.datasets[i].randomizeColor)){
          if (this.colors && this.colors.length) {
            Object.assign(this.datasets[i], this.colors[i]);
          } else {
            Object.assign(this.datasets[i], ColorHelper.getColors(this.chartType, i, this.datasets[i].data.length));
          }
        }

      }
    }
  }

  private refresh():any {
    // if (this.options && this.options.responsive) {
    //   setTimeout(() => this.refresh(), 50);
    // }
    // todo: remove this line, it is producing flickering
    this.ngOnDestroy();
    this.chart = this.getChartBuilder(this.ctx/*, data, this.options*/);
  }

}
