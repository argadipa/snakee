import {
  _decorator,
  Component,
  Sprite,
  math,
  assetManager,
  SpriteFrame,
  Node,
} from 'cc';
import { ASSET_KEY, TILE_CONTENT } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
const { ccclass, property } = _decorator;

export class TileData {
  index: math.Vec2;
  content: TILE_CONTENT;
  pos: math.Vec2;

  constructor(index: math.Vec2, content: TILE_CONTENT, pos: math.Vec2) {
    this.index = index;
    this.content = content;
    this.pos = pos;
  }
}

@ccclass('Tile')
export class Tile extends Component {
  @property(Node)
  child: Node;

  private sprite: Sprite;
  private tileData: TileData;

  public setupTile(pos: math.Vec2, content: TILE_CONTENT) {
    const { x, y } = this.node.position;
    this.tileData = new TileData(pos, content, math.v2(x, y));

    if (!this.sprite) {
      this.sprite = this.getComponent(Sprite);
      if (this.sprite === null) return;
      this.drawTileContent();
    }
  }

  public getStatusContent() {
    return this.tileData.content as TILE_CONTENT;
  }

  public getTileData() {
    return this.tileData;
  }

  public setTileContent(content: TILE_CONTENT) {
    this.tileData.content = content;
    this.drawTileContent();
  }

  public drawTileContent() {
    switch (this.tileData.content) {
      case TILE_CONTENT.NONE:
        this.sprite.spriteFrame = null;
        break;
      case TILE_CONTENT.WALL:
        this.sprite.spriteFrame = assetManager.assets.get(
          getSpriteFrameKey(ASSET_KEY.SPRITE_WALL)
        ) as SpriteFrame;
        break;
      case TILE_CONTENT.FRUIT:
        this.sprite.spriteFrame = assetManager.assets.get(
          getSpriteFrameKey(ASSET_KEY.SPRITE_APPLE)
        ) as SpriteFrame;
        break;

      default:
        this.sprite.spriteFrame = null;
        break;
    }
  }

  public changeFoodToSnakePart() {
    this.sprite.spriteFrame = assetManager.assets.get(
      getSpriteFrameKey(ASSET_KEY.SPRITESHEET_SNAKE_ROUND,0)
    ) as SpriteFrame;
    // this.node.setRotationFromEuler(0,0, -Vec2Helper.VecToAngle(dir));
  }
}
