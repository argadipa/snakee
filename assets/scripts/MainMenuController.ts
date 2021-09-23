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
import { ASSET_KEY } from './enum';
import { getSpriteFrameKey } from './helper/Spritesheet';
import { GlobalManager } from './manager/GlobalManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends Component {
  @property(RichText)
  highScore: RichText;

  @property(Button)
  playButton: Button;

  @property(Button)
  muteButton: Button;

  private defaultVolume: number;

  start() {
    this.setupEvent();
    this.showHighscore();
  }

  setupEvent() {
    this.defaultVolume = GlobalManager.globalAudioSource.volume;

    this.playButton?.node.on(Button.EventType.CLICK, () => {
      director.loadScene('Game');
    }, this);

    this.muteButton?.node.on(Button.EventType.CLICK, () => {
      const buttonSprite = this.muteButton.getComponent(Sprite);
      if(GlobalManager.globalAudioSource.volume > 0) {
        GlobalManager.globalAudioSource.volume = 0;
        // change sprite
        buttonSprite.spriteFrame = assetManager.assets.get(getSpriteFrameKey(ASSET_KEY.SPRITE_SOUND_OFF)) as SpriteFrame;
      } else {
        GlobalManager.globalAudioSource.volume = (this.defaultVolume === 0 ? 1: this.defaultVolume);
        // change sprite
        buttonSprite.spriteFrame = assetManager.assets.get(getSpriteFrameKey(ASSET_KEY.SPRITE_SOUND_ON)) as SpriteFrame;
      }
    }, this);
    
  }

  showHighscore() {
    this.highScore.string = localStorage.getItem('HIGH_SCORE') || '0';
  }
}
