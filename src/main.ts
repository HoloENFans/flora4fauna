import './style.css';

import { Application, Assets, Sprite } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { initDevtools } from '@pixi/devtools';
import { WORLD_HEIGHT, WORLD_WIDTH } from './PixiConfig.ts';

async function setup(): Promise<[Application, Viewport]> {
	const app = new Application();

	await app.init({
		background: '#000000',
		resizeTo: window,
		backgroundAlpha: 0,
	});
	document.getElementById('app')?.appendChild(app.canvas);

	// ! Should be removed in prod
	void initDevtools({ app });

	const viewport = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		worldWidth: WORLD_WIDTH,
		worldHeight: WORLD_HEIGHT,
		events: app.renderer.events,
	});

	window.addEventListener('resize', () => {
		viewport.resize(window.innerWidth, window.innerHeight);
	});

	viewport
		.drag()
		.pinch()
		.decelerate()
		.wheel()
		.bounce({
			// @ts-expect-error this is enough for the bounce box
			bounceBox: {
				x: -viewport.worldWidth,
				width: viewport.worldWidth * 2,
				y: -viewport.worldHeight,
				height: viewport.worldHeight * 2,
			},
		})
		.clamp({
			left: -(viewport.worldWidth / 2),
			right: viewport.worldWidth * 1.5,
			top: -(viewport.worldHeight / 2),
			bottom: viewport.worldHeight * 1.5,
			underflow: 'none',
		})
		.clampZoom({ minScale: 0.2, maxScale: 10 });

	app.stage.addChild(viewport);

	return [app, viewport];
}

async function setupTextures() {
	await Assets.init({
		basePath: '/assets',
		manifest: '/assets/manifest.json',
	});

	await Assets.loadBundle('default', (progress) => {
		// TODO: Loading screen
		console.log(progress);
	});
}

void (async () => {
	const [app, viewport] = await setup();
	await setupTextures();

	const kirin = Sprite.from('fauna');
	kirin.anchor.set(0.5, 0.5);
	kirin.position.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
	viewport.addChild(kirin);
	viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

	const smolKirin = Sprite.from('smol_fauna');
	smolKirin.anchor.set(0.5, 0.5);
	smolKirin.position.set(WORLD_WIDTH * 0.6, WORLD_HEIGHT * 0.6);
	smolKirin.scale.set(0.25);
	viewport.addChild(smolKirin);

	app.ticker.add(() => {
		kirin.rotation += 0.001;
	});

	// Navbar logic
	const donateDialog = document.getElementById(
		'donate-dialog',
	)! as HTMLDialogElement;
	const donateBtn = document.getElementById('donate-btn')!;
	donateBtn.addEventListener('click', () => {
		donateDialog.showModal();
	});
})();
