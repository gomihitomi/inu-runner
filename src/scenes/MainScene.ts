import CustomText from "@/lib/CustomText";
import Scene from "@/lib/Scene";
import { sound } from "@pixi/sound";
import {
  AnimatedSprite,
  Container,
  Graphics,
  Sprite,
  Texture,
  Ticker,
} from "pixi.js";
import { BehaviorSubject } from "rxjs";

const JUMP_P = 30;
const GRAVITY = 1.8;
const GROUND_Y = 32 * 10;
const INU_X = 32 * 2;
const GRID = 32 * 4;

const GROUND_LENGTH = 10;

export default class MainScene extends Scene {
  y: BehaviorSubject<number> = new BehaviorSubject(GROUND_Y);
  score: BehaviorSubject<number> = new BehaviorSubject(0);
  isJumping: BehaviorSubject<boolean> = new BehaviorSubject(false);
  jumpVelocity: number = 0;
  stones: Sprite[] = [];
  grounds: Sprite[] = [];
  isRun: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isUp: boolean = false;

  init() {
    const container = new Container({
      cursor: "pointer",
      interactive: true,
      hitArea: this.app.screen,
    }).on("pointerdown", () => {
      if (!this.isRun.value) return;
      if (!this.isJumping.value) {
        this.isJumping.next(true);
        this.jumpVelocity = -JUMP_P;
        sound.play("jump");
      }
    });
    this.app.stage.addChild(container);

    this.addGrounds(GROUND_LENGTH);

    const scoreText = new CustomText({
      x: this.app.screen.width - 10,
      y: 10,
      style: { fill: "#fff", fontSize: 39 },
    })
      .styleSmall()
      .setAnchor(1, 0);
    container.addChild(scoreText);

    const images = [...Array(3).keys()]
      .map((i) => `inu_run_${i}`)
      .map((v) => Texture.from(v));
    const runInu = new AnimatedSprite(images);
    runInu.x = INU_X;
    runInu.texture.source.scaleMode = "nearest";
    runInu.scale = 4;
    runInu.animationSpeed = 0.2;
    runInu.zIndex = 10;
    container.addChild(runInu);

    this.score.subscribe((value) => {
      const scoreNum = Math.floor(value / 6);

      if (!this.isUp) {
        scoreText.text = scoreNum.toString().padStart(6, "0");
      }

      const s = sound.find("up");
      if (scoreNum > 0 && scoreNum % 100 === 0 && !s.isPlaying) {
        s.play();
        this.isUp = true;
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 0;
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 1;
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 0;
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 1;
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 0;
          await new Promise((resolve) => setTimeout(resolve, 200));
          scoreText.alpha = 1;
          await new Promise((resolve) => setTimeout(resolve, 200));
          this.isUp = false;
        })();
      }
      if (value < 150 || value % 50 !== 0) return;

      this.addRandomStone();
    });

    this.y.subscribe((value) => {
      runInu.y = value;
    });

    this.isJumping.subscribe((value) => {
      if (value) {
        runInu.currentFrame = 0;
        runInu.stop();
      } else {
        runInu.currentFrame = 2;
        runInu.play();
      }
    });

    this.isRun.subscribe((value) => {
      if (value) return;
      scoreText.text = Math.floor(this.score.value / 6)
        .toString()
        .padStart(6, "0");
      this.handleEnd(runInu);
    });
  }

  async update(_time: Ticker) {
    if (!this.isRun.value) return;
    const nextScore = this.score.value + 1;
    this.score.next(nextScore);

    let inuY = this.y.value;
    if (this.isJumping.value) {
      this.jumpVelocity += GRAVITY;
      inuY = inuY + this.jumpVelocity;
      if (inuY >= GROUND_Y) {
        inuY = GROUND_Y;
        this.isJumping.next(false);
        this.jumpVelocity = 0;
      }
      this.y.next(inuY);
    }

    const removeStones: number[] = [];
    this.stones.forEach((s, i) => {
      s.x -= this.speed();

      const rect1 = {
        x: INU_X + 32,
        y: inuY + 24,
        width: GRID - 64,
        height: GRID - 72,
      };
      const rect2 = {
        x: s.x + 24,
        y: s.y + 16,
        width: s.width - 48,
        height: s.height - 32,
      };

      if (isColliding(rect1, rect2)) {
        this.isRun.next(false);
      }

      if (s.x < -(64 * 4)) {
        this.app.stage.children.at(0)?.removeChild(s);
        s.destroy;
        removeStones.push(i);
      }
    });
    removeStones.reverse().forEach((i) => this.stones.splice(i, 1));

    const removeGrounds: number[] = [];
    this.grounds.forEach((g, i) => {
      g.x -= this.speed();
      if (g.x < -(64 * 4)) {
        this.app.stage.children.at(0)?.removeChild(g);
        g.destroy;
        removeGrounds.push(i);
      }
    });
    removeGrounds.forEach((i) => this.grounds.splice(i, 1));
    const addGroundLength = GROUND_LENGTH - this.grounds.length;
    if (addGroundLength > 0) {
      this.addGrounds(addGroundLength);
    }
  }

  addRandomStone() {
    const per = Math.floor(Math.random() * 100);
    if (per < 50) return;

    const isBigStone = per > 90;
    const stone = Sprite.from(isBigStone ? "stone_1" : "stone_0");
    stone.x = this.app.screen.width;
    stone.y = GROUND_Y;
    stone.scale = 4;

    this.app.stage.children.at(0)?.addChild(stone);
    this.stones.push(stone);
  }

  addGrounds(len: number) {
    [...Array(len).keys()].forEach(() => {
      let key = 0;
      const isRare = Math.floor(Math.random() * 100) > 97;
      if (isRare) {
        key = Math.floor(Math.random() * 2);
      } else {
        key = Math.floor(Math.random() * 3) + 2;
      }

      const ground = Sprite.from(`ground_${key}`);
      const lastGround = this.grounds.at(-1);
      ground.x = !lastGround ? 0 : lastGround.x + 32 * 4;
      ground.y = GROUND_Y;
      ground.scale = 4;
      ground.zIndex = -1;
      this.app.stage.children.at(0)?.addChild(ground);
      this.grounds.push(ground);
    });
  }

  handleEnd(runInu: AnimatedSprite) {
    sound.play("damage");
    runInu.currentFrame = 0;
    runInu.stop();
    runInu.texture = Texture.from("inu_damage");

    const container = this.app.stage.children.at(0);
    if (!container) return;

    const gameover = new CustomText({
      text: "GAME OVER",
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 3,
    })
      .styleLarge()
      .setCenter();
    container.addChild(gameover);

    const retry = new CustomText({
      text: "🔄",
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 1.5,
      style: { fontSize: 90, fontWeight: "900", fill: "#FFF" },
    }).setCenter();
    retry.cursor = "pointer";
    retry.interactive = true;
    retry.on("pointerdown", () => {
      this.finish();
    });
    const retryBg = new Graphics()
      .roundRect(retry.x - 2, retry.y - 2, retry.width + 4, retry.height + 6)
      .fill(0x000000);
    retryBg.pivot.x = retry.width / 2;
    retryBg.pivot.y = retry.height / 2;
    container.addChild(retryBg);
    container.addChild(retry);
    container.cursor = "default";
  }

  speed() {
    return Math.floor(this.score.value / 200) + 15;
  }

  finish() {
    this.score.complete();
    this.y.complete();
    this.isJumping.complete();
    this.isRun.complete();
    this.sceneManager.next(MainScene);
  }
}

type Colision = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function isColliding(r1: Colision, r2: Colision): boolean {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
