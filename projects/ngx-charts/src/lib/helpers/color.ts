import { BaseChartDirective } from "../directives/base-chart.directive";
import { Colors } from "../models/chartColor.model";

// @dynamic
export class Color {
  static rgba(colour:Array<number>, alpha:number):string {
    return 'rgba(' + colour.concat(alpha).join(',') + ')';
  }

  static getRandomInt(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static formatLineColor(colors:Array<number>):Color {
    return {
      backgroundColor: this.rgba(colors, 0.4),
      borderColor: this.rgba(colors, 1),
      pointBackgroundColor: this.rgba(colors, 1),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.rgba(colors, 0.8)
    };
  }

  static formatBarColor(colors:Array<number>):Color {
    return {
      backgroundColor: this.rgba(colors, 0.6),
      borderColor: this.rgba(colors, 1),
      hoverBackgroundColor: this.rgba(colors, 0.8),
      hoverBorderColor: this.rgba(colors, 1)
    };
  }

  static formatPieColors(colors:Array<number[]>):Colors {
    return {
      backgroundColor: colors.map((color:number[]) => this.rgba(color, 0.6)),
      borderColor: colors.map(() => '#fff'),
      pointBackgroundColor: colors.map((color:number[]) => this.rgba(color, 1)),
      pointBorderColor: colors.map(() => '#fff'),
      pointHoverBackgroundColor: colors.map((color:number[]) => this.rgba(color, 1)),
      pointHoverBorderColor: colors.map((color:number[]) => this.rgba(color, 1))
    };
  }

  static formatPolarAreaColors(colors:Array<number[]>):Color {
    return {
      backgroundColor: colors.map((color:number[]) => this.rgba(color, 0.6)),
      borderColor: colors.map((color:number[]) => this.rgba(color, 1)),
      hoverBackgroundColor: colors.map((color:number[]) => this.rgba(color, 0.8)),
      hoverBorderColor: colors.map((color:number[]) => this.rgba(color, 1))
    };
  }

  static getRandomColor():number[] {
    return [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
  }

  static generateColor(index:number):number[] {
    return BaseChartDirective.defaultColors[index] || this.getRandomColor();
  }

  static generateColors(count:number):Array<number[]> {
    let colorsArr:Array<number[]> = new Array(count);
    for (let i = 0; i < count; i++) {
      colorsArr[i] = BaseChartDirective.defaultColors[i] || this.getRandomColor();
    }
    return colorsArr;
  }

  static getColors(chartType:string, index:number, count:number):Color {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return this.formatPieColors(this.generateColors(count));
    }

    if (chartType === 'polarArea') {
      return this.formatPolarAreaColors(this.generateColors(count));
    }

    if (chartType === 'line' || chartType === 'radar') {
      return this.formatLineColor(this.generateColor(index));
    }

    if (chartType === 'bar' || chartType === 'horizontalBar') {
      return this.formatBarColor(this.generateColor(index));
    }
    return this.generateColor(index);
  }
}
