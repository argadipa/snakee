import { SpriteFrame, Vec2 } from "cc";
import { ASSET_EXTENSION, ASSET_TYPE, DIRECTION } from "../enum";

// #region Asset
/**
 * config for spritesheet type asset
 */
export interface IAssetTypeConfig {
  frameWidth?: number,
  frameHeight?: number,
  paddingX?: number,
  paddingY?: number,
}

export interface IAssetConfig {
  key: string,
  type: ASSET_TYPE,
  url: string,
  ext?: ASSET_EXTENSION,
  localUrl?: string,
  config?: IAssetTypeConfig,
}
// #endregion

// #region Level Config & Snake Config
export interface ILevelConfig {
  boardConfig: number[][];
  snakeConfig: ISnakePart[];
}

export interface ISnakePart {
  posIndex: Vec2;
}
// #endregion
