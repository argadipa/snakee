import {
  _decorator,
  Component,
  Button,
  RichText,
  director,
  Sprite,
  assetManager,
  SpriteFrame,
} from 'cc';
import { ASSET_KEY } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
import { GlobalManager } from '../manager/GlobalManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends Component {
  @property(RichText)
  highScore: RichText;

  @property(Button)
  playButton: Button;

  @property(Button)
  muteButton: Button;

  start() {
    this.setupEvent();
    this.showHighscore();
    this.renderButton();
  }

  setupEvent() {

    this.playButton?.node.on(Button.EventType.CLICK, () => {
      director.loadScene('Game');
    }, this);

    this.muteButton?.node.on(Button.EventType.CLICK, () => {
      GlobalManager.muteSound = !GlobalManager.muteSound;
        const status = GlobalManager.muteSound;
        GlobalManager.globalAudioSource.volume = status ? 0 : 1;
        this.renderButton();
    }, this);
    
  }

  showHighscore() {
    this.highScore.string = localStorage.getItem('HIGH_SCORE') || '0';
  }

  private renderButton() {
    const buttonSprite = this.muteButton.getComponent(Sprite);
    const status = GlobalManager.muteSound;
    if(status) {
        buttonSprite.spriteFrame = assetManager.assets.get(
            getSpriteFrameKey(ASSET_KEY.SPRITE_SOUND_OFF)
          ) as SpriteFrame;
    } else {
        buttonSprite.spriteFrame = assetManager.assets.get(
            getSpriteFrameKey(ASSET_KEY.SPRITE_SOUND_ON)
          ) as SpriteFrame;
    }
  }
}
