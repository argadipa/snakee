import { math } from "cc";

// #region EVENTS
export enum GAME_EVENTS  {
    ASSET_LOADED = 'asset loaded',
    TOGGLE_MUSIC = 'toggle_music',
    UPDATE_MUSIC_STATE = 'update_music_state',
}

export enum ASSET_LOADER_EVENT {
    START = 'start',
    ASSET_LOAD_SUCCESS = 'asset_load_success',
    ASSET_LOAD_FAILURE = 'asset_load_failure',
    COMPLETE = 'complete',
}

export enum CONTROLLER_EVENT {
    LEFT = 'key_left',
    RIGHT = 'key_right',
    UP = 'key_up',
    DOWN = 'key_down',
    FIRST_CLICK = 'first_click',
}

// #endregion

// $region ASSET
export enum ASSET_EXTENSION {
    PNG = '.png',
}

export enum ASSET_TYPE {
    IMAGE = 'image',
    SPRITESHEET = 'spritesheet',
    AUDIO = 'audio',
}

export enum ASSET_KEY {
    // audio
    BG_MUSIC = 'bg-music',
    BUTTON_SFX = 'button-sfx',
    CRASH = 'crash',
    EAT = 'eat',
    TURN = 'turn',

    // sprite / texture
    KEYPAD = 'keypad',
    LOGO_SHOPEE_ULAR = 'logo_shopee_ular',
    SPRITE_APPLE = 'sprite_apple',
    SPRITE_SOUND_ON = 'sprite_sound_on',
    SPRITE_SOUND_OFF = 'sprite_sound_off',
    SPRITE_TILE = 'sprite_tile',
    SPRITE_TROPHY = 'sprite_trophy',
    SPRITE_WALL = 'sprite_wall',
    SPRITESHEET_ROUND = 'spritesheet_round',
    SPRITESHEET_SNAKE = 'spritesheet_snake',
    SPRITESHEET_SNAKE_ROUND = 'sprite_snake_round',
}

// #endregion

// #region TILE
export enum TILE_CONTENT {
    NONE = 0,
    WALL = 1,
    FRUIT = 2,
}
// #endregion

// #region GAME
export enum DIRECTION {
    UP = 0,
    LEFT = 90,
    DOWN = 180,
    RIGHT = 270,
}

export enum SNAKE_PART_STATE {
    NORMAL = 1,
    SWALLOW = 2,
}

export enum SNAKE_PART_SPRITE {
    HEAD = 0,
    BODY = 1,
    BODY_S = 2,
    TAIL = 3,
    BODY_TURNING = 4,
    BODTY_TURNING_S = 5
}
// #endregion

