import Scene from "@/lib/Scene";
import { Application, Ticker } from "pixi.js";

export default class SceneManager {
  app: Application;
  currentScene: Scene;
  currentUpdate: ((_time: Ticker) => void) | undefined;

  constructor(app: Application, CurrentScene: typeof Scene) {
    this.app = app;
    this.currentScene = new CurrentScene(this);
  }

  run() {
    // 現在のシーンを初期化して、updateをキック
    this.currentScene.init();

    // TODO: なんかもっといいやり方ある気がする
    this.currentUpdate = (time: Ticker) => this.currentScene.update(time);
    this.app.ticker.add(this.currentUpdate);
  }

  next(NextScene: typeof Scene) {
    // 現在のシーンを消して次のシーンへ
    this.app.stage.removeChildren();
    if (this.currentUpdate !== undefined) {
      this.app.ticker.remove(this.currentUpdate);
    }
    this.currentScene = new NextScene(this);
    this.run();
  }
}
