import './style.css';

import { Application, Assets, Container, Rectangle, Sprite } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { initDevtools } from '@pixi/devtools';
import { WORLD_HEIGHT, WORLD_WIDTH, CULL_MARGIN } from './PixiConfig.ts';
import { buildTreeSpriteGraph } from './tree.ts';
import DonationPopup from './donationPopup.ts';
import { CountUp } from 'countup.js';
import pb from './pocketbase.ts';
import Database from './database.ts';

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
				x: 0,
				width: viewport.worldWidth,
				y: -viewport.worldHeight,
				height: viewport.worldHeight * 2,
			},
		})
		.clamp({
			left: 0,
			right: viewport.worldWidth,
			top: -(viewport.worldHeight / 2),
			bottom: viewport.worldHeight * 1.5,
			underflow: 'none',
		})
		.clampZoom({ minScale: 0.25, maxScale: 4 });

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
	await Assets.init({
		basePath: '/assets',
		manifest: '/assets/manifest.json',
	});

	await Assets.loadBundle('default', (progress) => {
		// TODO: Loading screen
		console.log('Load progress', progress);
	});
}

function setupTree(viewport: Viewport) {
	const bottomMiddleX = WORLD_WIDTH / 2;
	const bottomMiddleY = WORLD_HEIGHT * 0.9;

	const treeContainer = buildTreeSpriteGraph(bottomMiddleX, bottomMiddleY);
	treeContainer.cullableChildren = true;

	viewport.addChild(treeContainer);
	viewport.setZoom(0.4);
	const faunaNemu = Sprite.from('Fauna_Nemu');
	viewport.moveCenter(
		bottomMiddleX + 80,
		bottomMiddleY - faunaNemu.height / 2,
	);
	faunaNemu.destroy();
}

async function setupPixi() {
	const [app, viewport] = await setup();
	await setupTextures();
	setupTree(viewport);

	DonationPopup.init(app, viewport);
}

async function setupOverview() {
	const overviewCollection = pb.collection<{ amount: number; count: number }>(
		'overview',
	);

	const raised = await overviewCollection.getOne('overview');

	const countUp = new CountUp('amount-raised', raised.amount, {
		prefix: '$',
		suffix: ' raised',
	});
	countUp.start();

	const db = await Database();

	async function updateRaised() {
		const newRaised = await overviewCollection.getOne('overview');
		countUp.update(newRaised.amount);
	}

	db.donations.$.subscribe(() => {
		void updateRaised();
	});

	setInterval(() => {
		void updateRaised();
	}, 30 * 1000);
}

void (async () => {
	await setupPixi();

	await setupOverview();

	// Navbar logic
	const donateDialog = document.getElementById(
		'donate-dialog',
	)! as HTMLDialogElement;
	const donateBtn = document.getElementById('donate-btn')!;
	donateBtn.addEventListener('click', () => {
		donateDialog.showModal();
	});

	const mobileNavOpenBtn = document.getElementById('mobile-nav-open-bar')!;
	const mobileNavCloseBtn = document.getElementById('mobile-nav-close-bar')!;
	const mobileNavDrawer = document.getElementById('mobile-nav-drawer')!;

	mobileNavOpenBtn.addEventListener('click', () => {
		mobileNavDrawer.classList.remove('hidden', 'translate-y-full');
		mobileNavDrawer.classList.add('translate-y-0');
	});

	mobileNavCloseBtn.addEventListener('click', () => {
		mobileNavDrawer.classList.add('translate-y-full');
		mobileNavDrawer.classList.remove('translate-y-0', 'hidden');
	});
})();
