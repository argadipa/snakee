import {
  _decorator,
  Component,
  ProgressBar,
  RichText,
  director,
  assetManager,
  resources,
} from 'cc';
import { ASSET_LOADER_EVENT } from './enum';
import { AssetLoader } from './helper/AssetLoader';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {
  menuLoaded = false;
  gameLoaded = false;

  @property(AssetLoader)
  assetLoader: AssetLoader;

  @property(ProgressBar)
  progressBar: ProgressBar;

  @property(RichText)
  progressText: RichText;

  start() {
    this.startLoadingAssets();

    //   await this.showLoadProgress();
    //    this.schedule( () => {
    //        director.loadScene('MainMenu');
    //    }, 1.5)
  }

  startLoadingAssets() {
    const { assetLoader, progressBar, progressText } = this;
    if (!assetLoader || !progressBar || !progressText) return;

    assetLoader.node.on(
      ASSET_LOADER_EVENT.ASSET_LOAD_FAILURE,
      (progress, key, url) => {
        console.log('Failed to load asset', [progress, key, url]);
      }
    );

    assetLoader.node.on(
      ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
      (progress, key, url) => {
        this.progressBar.progress = progress;
        this.progressText.string = `${progress.toFixed(2) * 100}%`;
      }
    );

    assetLoader.node.on(
        ASSET_LOADER_EVENT.COMPLETE,
        (progress) => {
          if(progress >= 1) {
            console.log('loading complete');
            console.log('asset map : ', assetManager.assets);
            director.loadScene('MainMenu');
          }
        }
      );

    progressBar.progress = 0;
    progressText.string = '0%';

    assetLoader.startAssetsLoad();
  }

  async showLoadProgress(): Promise<void> {
    let progress1: number = 0;
    let progress2: number = 0;
    // preload all scene
    return new Promise((res, rej) => {
      director.preloadScene(
        'MainMenu',
        (completed, total) => {
          progress1 = completed / total / 2;
          this.progressBar.progress = progress1;
          this.progressText.string = `${(progress1 * 100).toString()} %`;
          console.log('progress ', progress1);
        },
        (err) => {
          if (err) {
            rej(err);
          }
          director.preloadScene(
            'Game',
            (completed, total) => {
              progress2 = completed / total / 2;
              this.progressBar.progress = progress1 + progress2;
              this.progressText.string = `${(
                (progress1 + progress1) *
                100
              ).toString()} %`;
              console.log('progress ', progress2);
            },
            (err) => {
              if (err) {
                rej(err);
              }
              console.log('scenes loaded');
              res();
            }
          );
        }
      );
    });
  }
}
