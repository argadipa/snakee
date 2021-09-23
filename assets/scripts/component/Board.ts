import {
  _decorator,
  Component,
  instantiate,
  Prefab,
  UITransform,
  math,
  randomRangeInt,
  v2,
} from 'cc';
import { Tile, TileData } from './Tile';
const { ccclass, property } = _decorator;
import { ILevelConfig } from '../interface';
import { TILE_CONTENT } from '../enum';

const tileWidth = 48;

@ccclass('Board')
export class Board extends Component {
  private tiles: Tile[][] = [];
  private tileDatas: TileData[][] = [];

  @property(Prefab)
  tile: Prefab;

  @property(UITransform)
  backgroundTile: UITransform;

  public initBoard(selectedLevel: ILevelConfig) {
    console.log('setup background tile');
    const { x, y } = this.backgroundTile.node.position;
    const { x: xScale, y: yScale } = this.backgroundTile.node.scale;
    this.node.setPosition(
      x - (this.backgroundTile.width / 2) * xScale,
      y + (this.backgroundTile.width / 2) * yScale
    );
    this.node.setScale(xScale, yScale);

    console.log('setup wall');
    
    this.drawBoard(selectedLevel.boardConfig);


    return this.tiles;
  }

  private drawBoard(data: number[][]) {
    this.tiles = data.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return this.generateTile(col, row, colIndex, rowIndex);
      });
    });

    this.tileDatas = this.tiles.map((row) => {
      return row.map((col) => {
        return col.getTileData();
      });
    });
  }

  private generateTile(
    col: number,
    row: number[],
    colIndex: number,
    rowIndex: number
  ) {
    const t = instantiate(this.tile);
    t.setParent(this.node);
    t.setPosition(colIndex * tileWidth + tileWidth / 2, -rowIndex * tileWidth - tileWidth / 2);
    const tile = t.getComponent(Tile);
    tile.setupTile(v2(colIndex, rowIndex), col);
    return tile;
  }

  public getTileDatas() {
    return this.tileDatas;
  }

  public getTileFromIndex(col:number, row:number){
    if(col < 0 || col > 11 || row < 0 || row > 11) return undefined;
    return this.tiles[row][col];
  }

  public getTilePositionFromIndex(col: number, row: number) {
    if(col < 0 || col > 11 || row < 0 || row > 11) return undefined;
    return this.tileDatas[row][col].pos;
  }

  public isTileWalled(col: number, row: number) {
    return (
      this.tileDatas[row][col] !== null &&
      this.tileDatas[row][col].content === TILE_CONTENT.WALL
    );
  }

  public isTileFruit(col: number, row: number) {
    return (
      this.tileDatas[row][col] !== null &&
      this.tileDatas[row][col].content === TILE_CONTENT.FRUIT
    );
  }

  public clearTile(col: number, row: number) {
    const tile = this.tiles[row][col];
    tile.setTileContent(TILE_CONTENT.NONE);
    tile.drawTileContent();
  }

  public getTileFromTilePosition(col: number, row: number) {
    return this.tiles[row][col];
  }

  public getClearRandomPosPosition() {
    const randomPos = math.v2(randomRangeInt(0, 12), randomRangeInt(0, 12));
    const {x, y} = randomPos;
    if (!this.isTileWalled(x, y)) {
      return this.getTilePositionFromIndex(x, y);
    }
    this.getClearRandomPosPosition();
  }

  public spawnFruit() {
    const tile = this.getTileFromTilePosition(math.randomRangeInt(0, 11), math.randomRangeInt(0, 11));
    if (tile && tile.getTileData().content === TILE_CONTENT.WALL) {
      this.spawnFruit();
    }
    tile.setTileContent(TILE_CONTENT.FRUIT);
    return tile.getTileData();
  }

}
