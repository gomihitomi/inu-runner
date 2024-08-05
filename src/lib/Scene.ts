import SceneManager from "@/lib/SceneManager";
import { Application, Ticker } from "pixi.js";

export default class Scene {
  sceneManager: SceneManager;
  app: Application;
  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    this.app = sceneManager.app;
  }
  init() {}
  update(_time: Ticker) {}
  finish() {}
}
