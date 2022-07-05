import { Cell } from "./Cell";

export class Game {
  static cellSize = 10;
  public width: number = 0;
  public height: number = 0;
  private grid: Cell[] = [];
  private hasMouseDown = false;

  private context: CanvasRenderingContext2D | null;

  private createContext() {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = this.width * Game.cellSize;
    canvas.height = this.height * Game.cellSize;

    const mousedown = (event: any) => {
      this.hasMouseDown = true;
    };

    const mousemove = (event: any) => {
      if (this.hasMouseDown) {
        this.grid.forEach((element) => {
            if(element.x === Math.floor(event.clientX / Game.cellSize) && element.y ===  Math.floor(event.clientY / Game.cellSize)){
                element.isAlive = true;
            }
        })
      }
    };

    const mouseup = (event: any) => {
      this.hasMouseDown = false;
    };
    canvas.addEventListener("mousedown", mousedown);
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mouseup", mouseup);

    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    this.context = context;
  }

  private draw() {
    this.grid.forEach((cell) => {
      this.context.fillRect(
        cell.x * Game.cellSize,
        cell.y * Game.cellSize,
        Game.cellSize,
        Game.cellSize
      );
      this.context.fillStyle = cell.isAlive ? "#FB8B24" : "#2B2D42";
    });
  }
  private createGrid() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = new Cell(i, j);
        this.grid.push(cell);
        this.context.fillRect(i, j, Game.cellSize, Game.cellSize);
        this.context.fillStyle = cell.isAlive ? "#FB8B24" : "#2B2D42";
      }
    }
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.createContext();
    this.createGrid();
  }

  gridToIndex(x, y) {
    return x + y * this.width;
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }

    return this.grid[this.gridToIndex(x, y)].isAlive ? 1 : 0;
  }

  private checkAlive() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);

        let centerIndex = this.gridToIndex(x, y);

        if (numAlive == 2) {
          // Do nothing
          this.grid[centerIndex].nextAlive = this.grid[centerIndex].isAlive;
        } else if (numAlive == 3) {
          // Make alive
          this.grid[centerIndex].nextAlive = true;
        } else {
          // Make dead
          this.grid[centerIndex].nextAlive = false;
        }
      }
    }

    this.grid.forEach((element) => (element.isAlive = element.nextAlive));
  }

  public gameLoop() {
    this.checkAlive();
    this.context.clearRect(0, 0, this.width, this.height);

    this.draw();
    // The loop function has reached it's end, keep requesting new frames
    setTimeout(() => {
      this.start();
    }, 100); // The delay will make the game easier to follow
  }

  public start() {
    window.requestAnimationFrame(() => this.gameLoop());
  }
}
