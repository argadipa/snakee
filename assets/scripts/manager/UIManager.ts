
import { _decorator, Component, Node, director, Label, Button, Sprite, assetManager, SpriteFrame } from 'cc';
import { ASSET_KEY } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
import { GlobalManager } from './GlobalManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Node)
    popUp: Node;

    @property(Label)
    popUpScoreLabel: Label;

    @property(Node)
    gameInfo: Node;

    @property(Label)
    scoreLabel: Label;

    @property(Label)
    highScoreLabel: Label;

    @property(Node)
    textInfo: Node;

    @property(Button)
    cancelButton: Button;

    @property(Button)
    playAgainButton: Button;

    @property(Button)
    soundButton: Button;

    private defaultVolume;

    public showPopUp() {
        this.popUp.active = true;
    }

    public closePopUp() {
        // this.popUp.active = false;
        director.loadScene('MainMenu');
    }

    public hideInfoLabel() {
        this.textInfo.active = false;
    }

    public restartGame() {
        director.loadScene(director.getScene().name);
    }

    public updateScore(score: number) {
        const highScore = parseInt(localStorage.getItem('HIGH_SCORE')) || 0;
        this.highScoreLabel.string = highScore.toString();
        
        this.scoreLabel.string = score.toString();
        this.popUpScoreLabel.string = score.toString();
        
        if(score > highScore) {
            this.highScoreLabel.string = score.toString();
            localStorage.setItem('HIGH_SCORE', score.toString());
        }
    }

    onLoad() {
        this.setupListener();
        this.defaultVolume = GlobalManager.globalAudioSource.volume;
    }

    private setupListener() {
        this.cancelButton.node.on(Button.EventType.CLICK, this.closePopUp, this);
        this.playAgainButton.node.on(Button.EventType.CLICK, this.restartGame, this);
        this.soundButton.node.on(Button.EventType.CLICK, () => {
            const buttonSprite = this.soundButton.getComponent(Sprite);
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
}
