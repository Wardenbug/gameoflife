export class Cell {
  public isAlive: boolean = false;
  x: number = -1;
  y: number = -1;
  public nextAlive: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isAlive = Math.random() > 0.5;
  }
}
