import SceneManager from "@/lib/SceneManager";
import LoadingScene from "@/scenes/LoadingScene";
import { Application } from "pixi.js";

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 540;

(async () => {
  const app = new Application();
  await app.init({
    background: "#F5ECE6",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  document.body.appendChild(app.canvas);

  resize(app);
  window.addEventListener("resize", () => resize(app));

  const manager = new SceneManager(app, LoadingScene);
  manager.run();
})();

function resize(app: Application) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const scale = Math.min(w / SCREEN_WIDTH, h / SCREEN_HEIGHT);
  const newWidth = Math.floor(SCREEN_WIDTH * scale);
  const newHeight = Math.floor(SCREEN_HEIGHT * scale);

  const scaleToFit = Math.min(scale, scale);

  app.canvas.style.transformOrigin = "0 0";
  app.canvas.style.transform = `scale(${scaleToFit})`;

  app.canvas.style.position = "absolute";
  app.canvas.style.left = `${(w - newWidth) * 0.5}px`;
  app.canvas.style.top = `${(h - newHeight) * 0.5}px`;
}
