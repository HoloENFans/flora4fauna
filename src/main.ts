import './style.css';

import {
	Application,
	Assets,
	BlurFilter,
	Container,
	Graphics,
	Rectangle,
	Sprite,
	TexturePool,
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { initDevtools } from '@pixi/devtools';
import { WORLD_HEIGHT, WORLD_WIDTH, CULL_MARGIN } from './PixiConfig.ts';
import { buildTreeSpriteGraph } from './tree.ts';
import DonationPopup from './donationPopup.ts';

async function setup(): Promise<[Application, Viewport]> {
	const app = new Application();

	await app.init({
		background: '#000000',
		resizeTo: window,
		backgroundAlpha: 0,
		antialias: false,
	});
	document.getElementById('app')?.appendChild(app.canvas);

	if (import.meta.env.DEV) {
		void initDevtools({ app });
	}

	const viewport = new Viewport({
		worldWidth: WORLD_WIDTH,
		worldHeight: WORLD_HEIGHT,
		events: app.renderer.events,
	});

	viewport
		.drag()
		.pinch()
		.decelerate()
		.wheel()
		.clamp({
			direction: 'all',
			underflow: 'center',
		})
		.clampZoom({
			minWidth: 1500,
			maxWidth: viewport.worldWidth,
			minScale: 0.25,
			maxScale: 1,
		});

	const sky = Sprite.from('Background');
	sky.filters = new BlurFilter();
	sky.mask = new Graphics().rect(0, 0, 12000, 3000).fill(0xffffff);
	if (window.innerHeight > 3000) sky.height = window.innerHeight + 3000;
	sky.label = 'Sky';
	sky.x = -2000;
	viewport.addChild(sky);

	const background = Sprite.from('Background');
	background.position.set(
		viewport.worldWidth / 2 - 7000,
		viewport.worldHeight - 6700,
	);
	viewport.addChild(background);

	function cull(
		container: Container,
		view: Rectangle,
		skipUpdateTransform = true,
	) {
		if (
			container.cullable &&
			container.measurable &&
			container.includeInBuild
		) {
			const pos = viewport.toWorld(
				container.getGlobalPosition(undefined, skipUpdateTransform),
			);
			// TODO: Bounds don't seem to properly scale? Workaround using a margin for now
			const bounds =
				container.cullArea ?? container.getBounds(skipUpdateTransform);

			container.culled =
				pos.x >= view.x + view.width + CULL_MARGIN ||
				pos.y >= view.y + view.height + CULL_MARGIN ||
				pos.x + bounds.width + CULL_MARGIN <= view.x ||
				pos.y + bounds.height + CULL_MARGIN <= view.y;
		} else {
			container.culled = false;
		}

		if (
			!container.cullableChildren ||
			container.culled ||
			!container.renderable ||
			!container.measurable ||
			!container.includeInBuild
		)
			return;

		container.children.forEach((child) =>
			cull(child, view, skipUpdateTransform),
		);
	}

	viewport.on('moved', () => {
		const visibleBounds = viewport.getVisibleBounds();
		sky.y = visibleBounds.top;
	});

	window.addEventListener('resize', () => {
		viewport.resize(window.innerWidth, window.innerHeight);
		if (window.innerHeight > 3000) sky.height = window.innerHeight + 3000;
	});

	app.ticker.add(() => {
		if (viewport.dirty) {
			const view = viewport.getVisibleBounds();
			viewport.children?.forEach((child) => cull(child, view));
			viewport.dirty = false;
		}
	});

	app.stage.addChild(viewport);

	return [app, viewport];
}

async function setupTextures() {
	TexturePool.textureOptions.scaleMode = 'nearest';
	await Assets.init({
		basePath: '/assets',
		manifest: '/assets/manifest.json',
	});

	await Assets.loadBundle('default');
	await Assets.backgroundLoad('bgm');
}

function setupTree(viewport: Viewport) {
	const bottomMiddleX = WORLD_WIDTH / 2;
	const bottomMiddleY = WORLD_HEIGHT * 0.95;

	const treeContainer = buildTreeSpriteGraph(bottomMiddleX, bottomMiddleY);
	treeContainer.cullableChildren = true;

	viewport.addChild(treeContainer);
	viewport.setZoom(0.25);
	const faunaNemu = Sprite.from('Fauna_Nemu');
	viewport.moveCenter(
		bottomMiddleX + 80,
		bottomMiddleY - faunaNemu.height / 2,
	);
	faunaNemu.destroy();
}

async function setupPixi() {
	await setupTextures();
	const [app, viewport] = await setup();
	setupTree(viewport);

	DonationPopup.init(app, viewport);

	document.getElementById('loading-screen')!.remove();
}

void (async () => {
	await setupPixi();
})();
