import CustomText from "@/lib/CustomText";
import Scene from "@/lib/Scene";
import MainScene from "@/scenes/MainScene";
import { sound } from "@pixi/sound";
import { Container, Sprite, Texture } from "pixi.js";
import { BehaviorSubject } from "rxjs";

const JUMP_P = 30;
const GRAVITY = 1.8;
const GROUND_Y = 32 * 10;

export default class TitleScene extends Scene {
  jumpVelocity: number = 0;
  inuY: BehaviorSubject<number> = new BehaviorSubject(64);
  isJumping: boolean = false;

  init() {
    const container = new Container({
      cursor: "pointer",
      interactive: true,
      hitArea: this.app.screen,
    }).on("pointerdown", () => {
      if (this.isJumping) return;
      this.isJumping = true;
      this.jumpVelocity = -JUMP_P;
      sound.play("jump");
      inu.texture = Texture.from("inu_run_0");
    });
    this.app.stage.addChild(container);

    const title = new CustomText({
      text: "INU RUNNER",
      x: this.app.screen.width / 1.8,
      y: this.app.screen.height / 4,
    })
      .styleLarge()
      .setCenter();
    container.addChild(title);

    const inu = new Sprite(Texture.from("inu_stand"));
    inu.x = 64;
    inu.y = this.inuY.value;
    inu.texture.source.scaleMode = "nearest";
    inu.scale = 4;
    container.addChild(inu);
    this.inuY.subscribe((value) => {
      inu.y = value;
    });

    const info = new CustomText({
      text: "タッチ か クリック で開始",
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 1.3,
    })
      .styleSmall()
      .setCenter();
    container.addChild(info);

    const version = new CustomText({
      text: "ver 1.01",
      x: this.app.screen.width - 10,
      y: this.app.screen.height - 10,
    })
      .styleSmall()
      .setAnchor(1);
    container.addChild(version);
  }
  update() {
    if (!this.isJumping) return;

    this.jumpVelocity += GRAVITY;
    let nextY = this.inuY.value + this.jumpVelocity;
    if (nextY >= GROUND_Y) {
      nextY = GROUND_Y;
      this.isJumping = false;
      this.jumpVelocity = 0;
      this.finish();
    }
    this.inuY.next(nextY);
  }
  finish() {
    this.inuY.complete();
    this.sceneManager.next(MainScene);
  }
}
