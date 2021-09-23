import {
  _decorator,
  Component,
  Node,
  Button,
  Sprite,
  assetManager,
  SpriteFrame,
  EventHandler,
  systemEvent,
  SystemEventType,
  EventKeyboard,
  macro,
} from 'cc';
import { ASSET_KEY, CONTROLLER_EVENT } from '../enum';
import { getSpriteFrameKey } from '../helper/Spritesheet';
const { ccclass, property } = _decorator;

@ccclass('KeypadManager')
export class KeypadManager extends Component {
  private firstClick = false;
  @property(Button)
  upButton: Button;

  @property(Button)
  leftButton: Button;

  @property(Button)
  downButton: Button;

  @property(Button)
  rightButton: Button;

  onLoad() {
    this.assignButtonSprite();
    this.assignButtonClickEvent();
    this.assignSystemKeyEvent();
  }

  private assignButtonSprite() {
    const upButtonSprite = this.upButton.getComponent(Sprite);
    const leftButtonSprite = this.leftButton.getComponent(Sprite);
    const downButtonSprite = this.downButton.getComponent(Sprite);
    const rightButtonSprite = this.rightButton.getComponent(Sprite);

    const upKey = assetManager.assets.get(
      getSpriteFrameKey(ASSET_KEY.KEYPAD, 1)
    ) as SpriteFrame;
    const leftKey = assetManager.assets.get(
      getSpriteFrameKey(ASSET_KEY.KEYPAD, 4)
    ) as SpriteFrame;
    const downKey = assetManager.assets.get(
      getSpriteFrameKey(ASSET_KEY.KEYPAD, 5)
    ) as SpriteFrame;
    const rightKey = assetManager.assets.get(
      getSpriteFrameKey(ASSET_KEY.KEYPAD, 6)
    ) as SpriteFrame;

    upButtonSprite.spriteFrame = upKey;
    leftButtonSprite.spriteFrame = leftKey;
    downButtonSprite.spriteFrame = downKey;
    rightButtonSprite.spriteFrame = rightKey;
  }

  private assignButtonClickEvent() {
    this.upButton.node.on(Button.EventType.CLICK, this.handleUpClick, this);
    this.leftButton.node.on(Button.EventType.CLICK, this.handleLeftClick, this);
    this.downButton.node.on(Button.EventType.CLICK, this.handleDownClick, this);
    this.rightButton.node.on(
      Button.EventType.CLICK,
      this.handleRightClick,
      this
    );
  }

  private assignSystemKeyEvent() {
    systemEvent.off(SystemEventType.KEY_DOWN, this.handleKeyDown, this);
    systemEvent.on(SystemEventType.KEY_DOWN, this.handleKeyDown, this);
  }

  handleKeyDown(event: EventKeyboard) {
    this.handleFirstClick();
    switch (event.keyCode) {
      case macro.KEY.up:
        this, this.handleUpClick();
        break;
      case macro.KEY.left:
        this, this.handleLeftClick();
        break;
      case macro.KEY.down:
        this, this.handleDownClick();
        break;
      case macro.KEY.right:
        this, this.handleRightClick();
        break;
      default:
        this, this.handleFirstClick();
        break;
    }
  }

  handleUpClick() {
    this.handleFirstClick();
    this.node.emit(CONTROLLER_EVENT.UP);
  }

  handleLeftClick() {
    this.handleFirstClick();
    this.node.emit(CONTROLLER_EVENT.LEFT);
  }

  handleDownClick() {
    this.handleFirstClick();
    this.node.emit(CONTROLLER_EVENT.DOWN);
  }

  handleRightClick() {
    this.handleFirstClick();
    this.node.emit(CONTROLLER_EVENT.RIGHT);
  }

  handleFirstClick() {
    if (!this.firstClick) {
        this.firstClick = true;
      this.node.emit(CONTROLLER_EVENT.FIRST_CLICK);
    }
  }
}
