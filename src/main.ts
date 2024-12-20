import { Application, Assets, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";

import './style.css';

const WORLD_HEIGHT = 5000;
const WORLD_WIDTH = 5000;

async function setup() : Promise<[Application, Viewport]> {
  const app = new Application();

  await app.init({ background: '#000000', resizeTo: window, backgroundAlpha: 0 });
  document.getElementById("world-tree")?.appendChild(app.canvas);

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });

  app.stage.addChild(viewport);
  viewport.drag().pinch().wheel().decelerate();

  return [app, viewport];
}

async function setupTextures() {
  const assets = [
    { alias: 'fauna', src: 'Ceres-Fauna_pr-img_01.png' },
    { alias: 'smol-fauna', src: 'smol_fauna.png'}
  ];
  await Assets.load(assets);
}

void (async () =>
{
  const [app, viewport] = await setup();
  await setupTextures();

  const kirin = Sprite.from("fauna");
  kirin.anchor.set(0.5, 0.5);
  kirin.position.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  viewport.addChild(kirin);
  viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

  const smolKirin = Sprite.from("smol-fauna");
  smolKirin.anchor.set(0.5, 0.5);
  smolKirin.position.set(WORLD_WIDTH * 0.6, WORLD_HEIGHT * 0.6);
  smolKirin.scale.set(0.25);
  viewport.addChild(smolKirin);

  app.ticker.add(() => {
    kirin.rotation += 0.001;
  });
})();