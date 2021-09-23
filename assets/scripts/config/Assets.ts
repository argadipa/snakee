import { ASSET_KEY, ASSET_TYPE } from "../enum";
import { IAssetConfig } from "../interface"

export const getAssets = () => {
  const assets = new Array<IAssetConfig>();

  // #region audio
  assets.push({
    key: ASSET_KEY.BG_MUSIC,
    type: ASSET_TYPE.AUDIO,
    url: '',
    localUrl: '/audios/bg-music'
  });

  assets.push({
    key: ASSET_KEY.BUTTON_SFX,
    type: ASSET_TYPE.AUDIO,
    url: '',
    localUrl: '/audios/button-sfx'
  });

  assets.push({
    key: ASSET_KEY.CRASH,
    type: ASSET_TYPE.AUDIO,
    url: '',
    localUrl: '/audios/crash'
  });

  assets.push({
    key: ASSET_KEY.EAT,
    type: ASSET_TYPE.AUDIO,
    url: '',
    localUrl: '/audios/eat'
  });

  assets.push({
    key: ASSET_KEY.TURN,
    type: ASSET_TYPE.AUDIO,
    url: '',
    localUrl: '/audios/turn'
  });
  // #endregion
  
  // #region texture
  assets.push({
    key: ASSET_KEY.KEYPAD,
    type: ASSET_TYPE.SPRITESHEET,
    url: '',
    localUrl: '/textures/keypad',
    config: { 
      frameWidth: 137,
      frameHeight: 132
     }
  });

  assets.push({
    key: ASSET_KEY.LOGO_SHOPEE_ULAR,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/keypad',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_APPLE,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_apple',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_SOUND_OFF,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_sound_off',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_SOUND_ON,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_sound_on',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_TILE,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_tile',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_TROPHY,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_trophy',
  });

  assets.push({
    key: ASSET_KEY.SPRITE_WALL,
    type: ASSET_TYPE.IMAGE,
    url: '',
    localUrl: '/textures/sprite_wall',
  });

  assets.push({
    key: ASSET_KEY.SPRITESHEET_SNAKE,
    type: ASSET_TYPE.SPRITESHEET,
    url: '',
    localUrl: '/textures/spritesheet_snake',
    config: {
      frameWidth: 96,
      frameHeight: 96,
    }
  });

  assets.push({
    key: ASSET_KEY.SPRITESHEET_SNAKE_ROUND,
    type: ASSET_TYPE.SPRITESHEET,
    url: '',
    localUrl: '/textures/sprite_snake_round',
    config: {
      frameWidth: 96,
      frameHeight: 96,
    }
  });
  // #endregion

  return assets;
};
