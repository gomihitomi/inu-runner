import CustomText from "@/lib/CustomText";
import Scene from "@/lib/Scene";
import TitleScene from "@/scenes/TitleScene";
import { Assets, Container, ResolvedAsset } from "pixi.js";

const getSupportExt = () => {
  const audio = new Audio();
  if (audio.canPlayType("audio/mp3") === "maybe") {
    return "mp3";
  } else if (audio.canPlayType("audio/ogg") === "maybe") {
    return "ogg";
  } else if (audio.canPlayType("audio/wav") === "maybe") {
    return "wav";
  }
  return "";
};
const SUPPORT_EXT = getSupportExt();
const soundAssets = ["damage", "jump", "up"].map((name) => {
  return { alias: [name], src: `inu/${name}.${SUPPORT_EXT}` };
});

const assets: ResolvedAsset[] = [
  {
    alias: ["inu_sprites"],
    src: "inu/texture.json",
  },
  ...soundAssets,
];

export default class LoadingScene extends Scene {
  async init() {
    this.app.renderer.background.color = "#F5ECE6";
    const container = new Container();
    this.app.stage.addChild(container);

    const loadingText = new CustomText({
      text: "0%",
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
    })
      .setCenter()
      .styleSmall();
    container.addChild(loadingText);

    await Assets.load(assets, (p) => {
      loadingText.text = `${p * 100}%`;
    });
    this.finish();
  }
  finish() {
    this.sceneManager.next(TitleScene);
  }
}
