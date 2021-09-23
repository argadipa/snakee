import {
  _decorator,
  Component,
  SpriteFrame,
  math,
  macro,
  Prefab,
  instantiate,
  assetManager,
  Vec2,
  v2,
  v3,
  Vec3,
} from 'cc';
import { Board } from '../component/Board';
import { Tile, TileData } from '../component/Tile';
import {
  ASSET_KEY,
  CONTROLLER_EVENT,
  DIRECTION,
  SNAKE_PART_SPRITE,
  SNAKE_PART_STATE,
  TILE_CONTENT,
} from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
import { ILevelConfig, ISnakePart } from '../interface';
import { levels } from '../LevelConfigs';
import { KeypadManager } from './KeypadManager';
import { SnakePart } from '../component/SnakePart';
import { Vec2Helper } from '../helper/VectorDirection';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  private tiles: Tile[][];
  private snake: SnakePart[];
  private score = 0;
  private eatenTile = new Map<Tile, number>();
  private gameDirection = new Vec2();
  private prevDirection = new Vec2();
  private canMove: boolean;
  private beatRate = 0.5;

  @property(Number)
  level: 1;

  @property(Boolean)
  randomizeLevel = true;

  @property(Board)
  board: Board;

  @property(Prefab)
  foodPrefab: Prefab;

  @property(Prefab)
  snakePartPrefab: Prefab;

  @property(KeypadManager)
  keypadManager: KeypadManager;

  @property(UIManager)
  uIManager: UIManager;

  start() {
    const lvl = this.randomizeLevel
      ? Math.floor(Math.random() * Object.keys(levels).length) + 1
      : this.level;

    if (lvl < 0 || lvl > Object.keys(levels).length) return;

    const selectedLevel = levels[`${lvl}`] as ILevelConfig;
    this.setupBeat();
    this.setupController();

    this.tiles = this.board.initBoard(selectedLevel);
    this.setupSnakeFromConfig(selectedLevel.snakeConfig);
    this.spawnFood();
    this.uIManager.updateScore(this.score);
  }

  private setupBeat() {
    this.schedule(this.beatHandler, this.beatRate, macro.REPEAT_FOREVER, 1);
  }

  private stopBeat() {
    this.unschedule(this.beatHandler);
  }

  private beatHandler() {
    this.moveSnake();
    this.processFoodToTail();
  }

  private moveSnake() {
    if (!this.canMove) return;
    const newDirection = new Vec2();
    this.snake[0].prevIndex = this.snake[0].IndexPos;
    Vec2.add(newDirection, this.snake[0].IndexPos, this.gameDirection);
    this.snake[0].prevDir = this.gameDirection;
    this.snake[0].IndexPos = newDirection;

    this.prevDirection = this.gameDirection;

    this.checkSnekConsume(v2(newDirection.x, newDirection.y), newDirection);

    let x = 0;
    let y = 0;
    const pos = this.board.getTilePositionFromIndex(
      newDirection.x,
      newDirection.y
    );

    if (pos !== undefined) {
      x = pos.x;
      y = pos.y;
    } else {
      return;
    }

    this.snake[0].node.setPosition(x, y, 0);
    this.snake[0].node.setRotationFromEuler(
      0,
      0,
      -Vec2Helper.VecToAngle(this.gameDirection)
    );

    // handle other parts
    for (let i = 1; i < this.snake.length; i++) {
      this.snake[i].prevIndex = this.snake[i].IndexPos;
      this.snake[i].IndexPos = this.snake[i - 1].prevIndex;
      const { x: x1, y: y1 } = this.board.getTilePositionFromIndex(
        this.snake[i - 1].prevIndex.x,
        this.snake[i - 1].prevIndex.y
      );
      this.snake[i].node.setPosition(x1, y1, 0);

      // chek dir
      const dirDelta = new Vec2();
      Vec2.subtract(
        dirDelta,
        this.snake[i - 1].IndexPos,
        this.snake[i].IndexPos
      );
      this.snake[i].setDirection(dirDelta);

      //  if (i === this.snake.length - 1) {
      this.snake[i].node.setRotationFromEuler(
        0,
        0,
        -Vec2Helper.VecToAngle(dirDelta)
      );
      // }

      // change body parts sprite
      if (i < this.snake.length - 1) {
        if (
          (dirDelta.y === 0 &&
            this.snake[i - 1].IndexPos.y !== this.snake[i].prevIndex.y) ||
          (dirDelta.x === 0 &&
            this.snake[i - 1].IndexPos.x !== this.snake[i].prevIndex.x)
        ) {
          // change sprite
          this.snake[i].setSprite(SNAKE_PART_SPRITE.BODY_TURNING);

          let rotateTo = 0;

          let angle = Vec2Helper.VecToAngle(dirDelta);

          switch (angle) {
            case 0:
              rotateTo =
                this.snake[i + 1].IndexPos.x < this.snake[i].IndexPos.x
                  ? 180
                  : 90; // if from left
              break;
            case -90:
              rotateTo =
                this.snake[i + 1].IndexPos.y < this.snake[i].IndexPos.y
                  ? 180
                  : 270;
              break;
            case -180:
              rotateTo =
                this.snake[i + 1].IndexPos.x < this.snake[i].IndexPos.x
                  ? 270
                  : 0;
              break;
            case -270:
              rotateTo =
                this.snake[i + 1].IndexPos.y < this.snake[i].IndexPos.y
                  ? 90
                  : 0;
              break;

            default:
              break;
          }

          // rotate sprite
          this.snake[i].node.setRotationFromEuler(0, 0, rotateTo);
        } else {
          this.snake[i].setSprite(SNAKE_PART_SPRITE.BODY);
        }
      } else {
        this.snake[i].setSprite(SNAKE_PART_SPRITE.TAIL);
      }
    }
  }

  private processFoodToTail() {
    if (this.eatenTile.size <= 0) return;
    this.eatenTile.forEach((val, key, map) => {
      map.set(key, (val += 1));
      console.log(`'adding food ${key} to ${val}`);
      if (val > this.snake.length - 1) {
        key.setTileContent(TILE_CONTENT.NONE);
        const newPart = instantiate(this.snakePartPrefab);
        const snakePart = newPart.getComponent(SnakePart);
        snakePart.createPart(
          v2(key.getTileData().pos.x, key.getTileData().pos.y),
          key.getTileData().pos
        );
        snakePart.node.setPosition(key.getTileData().pos.x, key.getTileData().pos.y);
        snakePart.node.setParent(this.board.node);
        this.snake.push(snakePart);
        map.delete(key);
      }
    });
  }

  private setupSnakeFromConfig(snakeConfig: ISnakePart[]) {
    this.snake = snakeConfig.map((part) => {
      const newPart = instantiate(this.snakePartPrefab);
      const snakePart = newPart.getComponent(SnakePart);
      const { x, y } = this.board.getTilePositionFromIndex(
        part.posIndex.x,
        part.posIndex.y
      );
      snakePart.createPart(new Vec2(x, y), part.posIndex);
      snakePart.node.setPosition(x, y);
      snakePart.node.setParent(this.board.node);
      return snakePart;
    });

    if (this.snake.length > 2) {
      this.createSnake();
    }
  }

  private createSnake() {
    const { snake } = this;
    for (let i = 0; i < snake.length; i++) {
      if (i === 0) {
        // head
        let dir = new Vec2(0, 0);
        Vec2.subtract(dir, snake[i].IndexPos, snake[i + 1].IndexPos);
        snake[i].setSprite(SNAKE_PART_SPRITE.HEAD);
        snake[i].setDirection(dir);
      } else if (i > 0 && i < this.snake.length - 1) {
        //body
        let dir = new Vec2(0, 0);
        Vec2.subtract(dir, snake[i - 1].IndexPos, snake[i].IndexPos);
        snake[i].setDirection(dir);
        snake[i].setSprite(SNAKE_PART_SPRITE.BODY);
      } else if (i === snake.length - 1) {
        //tail
        let dir = new Vec2(0, 0);
        Vec2.subtract(dir, snake[i - 1].IndexPos, snake[i].IndexPos);
        snake[i].setSprite(SNAKE_PART_SPRITE.TAIL);
        snake[i].setDirection(dir);
      }
    }
    for (let j = 1; j < this.snake.length; j++) {
      if (j > 0 && j < this.snake.length - j) {
        if (!this.snake[j - 1].direction.equals(this.snake[j + 1].direction)) {
          this.snake[j].isTurning = true;
        }
      }
    }
  }

  private checkSnekConsume(pos: Vec2, dir: Vec2) {
    const { x, y } = pos;
    // if out of area
    if (this.checkOutOfArea(math.v2(x, y))) {
      this.setGameOver();
      return;
    }

    if (this.board.isTileWalled(x, y)) {
      console.log('nabrak wall');
      this.setGameOver();
      return;
    }

    this.getSnakeIndexPos().forEach((pos, i) => {
      if (i > 0 && this.snake[0].IndexPos.equals(pos)) {
        this.setGameOver();
        return;
      }
    })

    if (this.board.isTileFruit(x, y)) {
      this.board.clearTile(x, y);
      this.spawnFood();
      this.snakeEat(x, y, 0);
      this.uIManager.updateScore(++this.score);
    }
  }

  private getSnakeIndexPos() {
    return this.snake.map((part, i) => {
      return part.IndexPos;
    });
  }

  private getSnakeRealPosV2() {
    return this.snake.map((part, i) => {
      const {x, y} = part.node.position;
      const realPosV2 = new Vec2(x,y);
      return realPosV2;
    });
  }

  private getSnakeRealPosV3() {
    return this.snake.map((part, i) => {
      return part.node.position;
    });
  }

  private snakeEat(x: number, y: number, length: number) {
    const tile = this.board.getTileFromIndex(x, y);
    tile.changeFoodToSnakePart();
    this.eatenTile.set(tile, length);
  }

  private spawnFood() {
    const randomTile = this.board.getTileFromTilePosition(
      math.randomRangeInt(0, 12),
      math.randomRangeInt(0, 12)
    );
    const tileData = randomTile.getTileData();
    if (
      tileData.content === TILE_CONTENT.WALL ||
      this.isSnakePartByRealPos(randomTile.node.position)
    ) {
      return this.spawnFood();
    }
    randomTile.setTileContent(TILE_CONTENT.FRUIT);
  }

  private setupController() {
    const { keypadManager } = this;

    keypadManager.node.on(CONTROLLER_EVENT.FIRST_CLICK, () => {
      if (!this.canMove) {
        this.canMove = true;
        this.uIManager.hideInfoLabel();
        Vec2.subtract(
          this.gameDirection,
          this.snake[0].IndexPos,
          this.snake[1].IndexPos
        );
        console.log('first game direction ', this.gameDirection);
      }
    });

    keypadManager.node.on(CONTROLLER_EVENT.UP, () => {
      if (
        Vec2.equals(this.prevDirection, Vec2Helper.LEFT) ||
        Vec2.equals(this.prevDirection, Vec2Helper.RIGHT)
      ) {
        this.gameDirection = Vec2Helper.UP;
        console.log('this direction up ', this.gameDirection);
      }
    });
    keypadManager.node.on(CONTROLLER_EVENT.LEFT, () => {
      if (
        Vec2.equals(this.prevDirection, Vec2Helper.UP) ||
        Vec2.equals(this.prevDirection, Vec2Helper.DOWN)
      ) {
        this.gameDirection = Vec2Helper.LEFT;
        console.log('this direction left ', this.gameDirection);
      }
    });
    keypadManager.node.on(CONTROLLER_EVENT.DOWN, () => {
      if (
        Vec2.equals(this.prevDirection, Vec2Helper.LEFT) ||
        Vec2.equals(this.prevDirection, Vec2Helper.RIGHT)
      ) {
        this.gameDirection = Vec2Helper.DOWN;
      }
    });
    keypadManager.node.on(CONTROLLER_EVENT.RIGHT, () => {
      if (
        Vec2.equals(this.prevDirection, Vec2Helper.UP) ||
        Vec2.equals(this.prevDirection, Vec2Helper.DOWN)
      ) {
        this.gameDirection = Vec2Helper.RIGHT;
      }
    });
  }

  private checkOutOfArea(posIndex: Vec2) {
    const { x, y } = posIndex;
    if (x < 0 || x > 11 || y < 0 || y > 11) {
      console.log('out of area');
      return true;
    }
    return false;
  }

  private isSnakePartByIndex(pos: Vec2) {
    this.getSnakeIndexPos().forEach((part) => {
      if (part.equals(pos)) return true;
    });
    return false;
  }

  private isSnakePartByRealPos(pos: Vec3) {
    this.getSnakeRealPosV3().forEach((part) => {
      if (part.equals(pos)) return true;
    });
    return false;
  }

  private setGameOver() {
    this.uIManager.showPopUp();
    this.stopBeat();
  }
}
