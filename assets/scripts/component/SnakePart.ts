import {
  _decorator,
  Component,
  math,
  Vec2,
  Sprite,
  SpriteFrame,
  v2,
  assetManager,
  Vec3,
} from 'cc';
import { ASSET_KEY, SNAKE_PART_SPRITE, SNAKE_PART_STATE } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
import { Vec2Helper } from '../helper/VectorDirection';
const { ccclass, property } = _decorator;

@ccclass('SnakePart')
export class SnakePart extends Component {
  private indexPos: Vec2;
  public direction: Vec2;
  public state: SNAKE_PART_STATE;
  public prevIndex: Vec2;
  public prevDir: Vec2;
  public isTail: boolean;
  public isTurning: boolean;

  @property(Sprite)
  sprite: Sprite;

  public createPart(pos: Vec2, index: Vec2) {
    this.indexPos = index;
    this.node.setPosition(pos.x, pos.y);
    this.state = SNAKE_PART_STATE.NORMAL;
    return this;
  }

  public get IndexPos() {
    return this.indexPos;
  }

  public set IndexPos(value: math.Vec2) {
    this.indexPos = value;
  }

  public setDirection(dir: Vec2) {
    this.direction = dir;
    this.node.setRotationFromEuler(0, 0, -Vec2Helper.VecToAngle(dir));
  }

  public setSprite(index: SNAKE_PART_SPRITE) {
    this.sprite.spriteFrame = assetManager.assets.get(getSpriteFrameKey(ASSET_KEY.SPRITESHEET_SNAKE, index)) as SpriteFrame;
  }

  public setSwallow(interval: number) {
    const currSprite = this.sprite.spriteFrame;
    if (this.state === SNAKE_PART_STATE.NORMAL) {
      this.state = SNAKE_PART_STATE.SWALLOW;
      // this.sprite.spriteFrame = assetManager.assets.get(getSpriteFrameKey(ASSET_KEY.SPRITESHEET_SNAKE,2)) as SpriteFrame;
      // console.log('swallow ', this);
    }
    this.scheduleOnce(() => {
      if (this.state === SNAKE_PART_STATE.SWALLOW) {
        console.log('swallow nim', this);
        this.state = SNAKE_PART_STATE.NORMAL;
        this.sprite.spriteFrame = currSprite;
      }
    }, interval);
  }

  public turnToBody() {
    this.sprite.spriteFrame = assetManager.assets.get(
        getSpriteFrameKey(ASSET_KEY.SPRITESHEET_SNAKE, 1)
      ) as SpriteFrame;
  }
}
