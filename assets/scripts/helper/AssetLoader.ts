import {
  _decorator,
  Component,
  resources,
  assetManager,
  Asset,
  ImageAsset,
  SpriteFrame,
  Texture2D,
  math,
} from 'cc';
import { getAssets } from '../config/Assets';
import { ASSET_EXTENSION, ASSET_LOADER_EVENT, ASSET_TYPE } from '../enum';
import { IAssetConfig, IAssetTypeConfig } from '../interface';
import { getAssetKey } from './Asset';
import { getSpriteFrameKey } from './Spritesheet';
const { ccclass } = _decorator;

@ccclass('AssetLoader')
export class AssetLoader extends Component {
  private assetsToLoad = new Array<IAssetConfig>();

  private loadCount = 0;

  private allowLocalAsset = true;

  constructor() {
    super('AssetLoader');
    this.assetsToLoad = getAssets();
  }

  public startAssetsLoad() {
    const { allowLocalAsset } = this;
    // this.node.emit(ASSET_LOADER_EVENT, this.getProgress());
    this.assetsToLoad.forEach((asset) => {
      const { key, type, url, ext, localUrl, config } = asset;
      if (allowLocalAsset && localUrl) {
        this.loadLocalAsset(key, type, localUrl, config);
      } else {
        this.loadRemoteAsset(key, type, url, ext, config);
      }
    });
  }

  private loadLocalAsset(
    key: string,
    type: ASSET_TYPE,
    url: string,
    config?: IAssetTypeConfig
  ) {
    resources.load(url, (e, data) => {
      this.handleLoadedAsset(key, type, url, e, data, config);

      if (e) {
        this.loadLocalAsset(key, type, url, config);
      }
    });
  }

  private loadRemoteAsset(
    key: string,
    type: ASSET_TYPE,
    url: string,
    ext?: ASSET_EXTENSION,
    config?: IAssetTypeConfig
  ) {
    assetManager.loadRemote(url, { ext }, (e, data) => {
      this.handleLoadedAsset(key, type, url, e, data, config);
    });
  }

  private handleLoadedAsset(
    key: string,
    type: ASSET_TYPE,
    url: string,
    e: Error | null,
    data: Asset,
    config?: IAssetTypeConfig
  ) {
    if (!e) {
      this.loadCount += 1;
      this.handleLoadedAssetByType(key, data._uuid, type, config);
      this.node.emit(
        ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
        this.getProgress(),
        key,
        url
      );
    } else {
      this.node.emit(
        ASSET_LOADER_EVENT.ASSET_LOAD_FAILURE,
        this.getProgress(),
        key,
        url
      );
    }

    if (this.loadCount === this.assetsToLoad.length) {
      this.node.emit(ASSET_LOADER_EVENT.COMPLETE, this.getProgress());
    }
  }

  private getProgress() {
    return this.loadCount / this.assetsToLoad.length;
  }

  private remapAssetManagerEntry(key: string, uuid: string) {
    const entry = assetManager.assets.get(uuid);

    if (!entry) return;

    assetManager.assets.add(key, entry);
    assetManager.assets.remove(uuid);
  }

  private handleLoadedAssetByType(
    key: string,
    uuid: string,
    type: ASSET_TYPE,
    config?: IAssetTypeConfig
  ) {
    switch (type) {
      case ASSET_TYPE.SPRITESHEET:
        this.remapAssetManagerEntry(getAssetKey(key), uuid);
        this.handleLoadedSpriteSheet(getAssetKey(key), key, config);
        break;
      case ASSET_TYPE.IMAGE:
        this.remapAssetManagerEntry(getAssetKey(key), uuid);
        this.handleLoadedImage(getAssetKey(key), key);
        break;
      case ASSET_TYPE.AUDIO:
        this.remapAssetManagerEntry(getAssetKey(key), uuid);
        break;
      default:
        this.remapAssetManagerEntry(getAssetKey(key), uuid);
        break;
    }
  }

  handleLoadedImage(assetKey: string, key: string) {
    const imageAsset = assetManager.assets.get(assetKey) as ImageAsset;

    if (!imageAsset) return;

    const spriteFrame = SpriteFrame.createWithImage(imageAsset);
    assetManager.assets.add(key, spriteFrame);
  }

  handleLoadedSpriteSheet(
    assetKey: string,
    key: string,
    config?: IAssetTypeConfig
  ) {
    const imageAsset = assetManager.assets.get(assetKey) as ImageAsset;
    const { width, height } = imageAsset || {};
    const { frameWidth, frameHeight, paddingX, paddingY } = {
      paddingX: 0,
      paddingY: 0,
      ...config,
    };

    if (!width || !height || !frameHeight || !frameWidth) return;

    const texture = new Texture2D();
    texture.image = imageAsset;

    let frameIndex = 0;
    for (let row = 0; row < height; row += (frameHeight + paddingY)) {
      for (let col = 0; col < width; col += (frameWidth + paddingX)) {
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        spriteFrame.rect = math.rect(col, row, frameWidth, frameHeight);
        assetManager.assets.add(getSpriteFrameKey(key, frameIndex++), spriteFrame);
      }
    }
  }  
}
