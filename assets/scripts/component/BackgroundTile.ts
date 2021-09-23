import { _decorator, Component, Sprite, assetManager, SpriteFrame } from 'cc';
import { ASSET_KEY } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
const { ccclass } = _decorator;

@ccclass('BackgroundTile')
export class BackgroundTile extends Component {
  sprite: Sprite;
  spriteKey = ASSET_KEY.SPRITE_TILE;

  start() {
    console.log('BACKGROUND TILE');
    this.sprite = this.getComponent(Sprite);
    this.sprite.spriteFrame = assetManager.assets.get(
      getSpriteFrameKey(this.spriteKey)
    ) as SpriteFrame;
    console.log('BGTILE SPRITE', this.sprite);
  }
}
