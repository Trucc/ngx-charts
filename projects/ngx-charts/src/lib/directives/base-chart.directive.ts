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
import { Color } from '../helpers/color';

/* tslint:disable-next-line */
@Directive({
  selector: 'canvas[baseChart]',
  exportAs: 'base-chart'
})
export class BaseChartDirective implements OnDestroy, OnChanges, OnInit {

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

  @Input() public data:number[] | any[];
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
    if (this.data || this.datasets) {
      this.refresh();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.initFlag) {
      // Check if the changes are in the data or datasets
      if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
        if (changes['data']) {
          this.updateChartData(changes['data'].currentValue);
        } else {
          this.updateChartData(changes['datasets'].currentValue);
        }

        this.chart.update();
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

  public getChartBuilder(ctx:any/*, data:Array<any>, options:any*/):any {
    let datasets:any = this.getDatasets();

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
        datasets: datasets
      },
      options: options
    };

    return new Chart(ctx, opts);
  }

  private updateChartData(newDataValues: number[] | any[]): void {
    if (Array.isArray(newDataValues[0].data)) {
      this.chart.data.datasets.forEach((dataset: any, i: number) => {
        dataset.data = newDataValues[i].data;

        if (newDataValues[i].label) {
          dataset.label = newDataValues[i].label;
        }
      });
    } else {
      this.chart.data.datasets[0].data = newDataValues;
    }
  }

  private getDatasets():any {
    let datasets:any = void 0;
    // in case if datasets is not provided, but data is present
    if (!this.datasets || !this.datasets.length && (this.data && this.data.length)) {
      if (Array.isArray(this.data[0])) {
        datasets = (this.data as Array<number[]>).map((data:number[], index:number) => {
          return {data, label: this.labels[index] || `Label ${index}`};
        });
      } else {
        datasets = [{data: this.data, label: `Label 0`}];
      }
    }

    if (this.datasets && this.datasets.length ||
      (datasets && datasets.length)) {
      datasets = (this.datasets || datasets)
      for(let i =0;i<datasets.lenght;i++)
        if (this.colors && this.colors.length) {
          Object.assign(datasets[i], this.colors[i]);
        } else {
          Object.assign(datasets[i], Color.getColors(this.chartType, i, datasets[i].data.length));
        }
        /*.map((elm:number, index:number) => {
          let newElm:any = Object.assign({}, elm);
          if (this.colors && this.colors.length) {
            Object.assign(newElm, this.colors[index]);
          } else {
            Object.assign(newElm, Color.getColors(this.chartType, index, newElm.data.length));
          }
          return newElm;
        });*/
    }

    /*if (!datasets) {
      throw new Error(`ng-charts configuration error,
      data or datasets field are required to render char ${this.chartType}`);
    }*/
    console.log(datasets)
    return datasets;
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
