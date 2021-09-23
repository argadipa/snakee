
import { _decorator, Component, Node, game, AudioSource, assetManager, AudioClip, director } from 'cc';
import { ASSET_KEY, GAME_EVENTS } from '../enum';
import { getAssetKey } from '../helper/Asset';
const { ccclass, property } = _decorator;

@ccclass('GlobalManager')
export class GlobalManager extends Component {
    @property(AudioSource)
    gas : AudioSource

    private mute = false;

    public static globalAudioSource: AudioSource;

    onLoad() {
        // game.addPersistRootNode(this.node);
        this.setupGlobalNodes();
    }

    private setupGlobalNodes() {
        GlobalManager.globalAudioSource = this.gas;
        game.addPersistRootNode(this.node);
    }
}
