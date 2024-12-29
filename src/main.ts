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
	Text,
	ColorMatrixFilter,
	Texture,
	getGlobalBounds,
	Bounds,
} from 'pixi.js';
import { IClampZoomOptions, Viewport } from 'pixi-viewport';
import { initDevtools } from '@pixi/devtools';
import { WORLD_HEIGHT, WORLD_WIDTH, CULL_MARGIN } from './PixiConfig.ts';
import { buildTreeSpriteGraph } from './tree.ts';
import DonationPopup from './donationPopup.ts';
import { Sound } from '@pixi/sound';

function getClampZoom(viewport: Viewport): IClampZoomOptions {
	const isVertical = window.innerHeight > window.innerWidth;

	return {
		minWidth: 1500,
		maxWidth: viewport.worldWidth,
		// Basically if it's > 6700, we get fauna floating in a white void when
		// we hide the background; this happens if we zoom too far out on a vertical
		// monitor. This also adds an offset so the user can still pan up
		// a bit before getting the blur effect even if they're on a 4k monitor.
		maxHeight: isVertical ? 5500 : viewport.worldHeight,
		minScale: 0.25,
		maxScale: 1,
	};
}

async function setup(): Promise<[Application, Viewport]> {
	const app = new Application();

	await app.init({
		background: '#000000',
		resizeTo: window,
		backgroundAlpha: 0,
		antialias: false,
		roundPixels: true,
		autoDensity: true,
		resolution: window.devicePixelRatio,
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
		.clampZoom(getClampZoom(viewport));

	const backgroundTexture: Texture = await Assets.load('Background');

	// Needed or else the background gets scaled up using linear which
	// looks awful for pixel art.
	backgroundTexture.source.scaleMode = 'nearest';

	const sky = Sprite.from(backgroundTexture);
	sky.scale.set(25);
	sky.filters = new BlurFilter();
	sky.mask = new Graphics().rect(0, 0, 12000, 3000).fill(0xffffff);
	if (window.innerHeight > 3000) sky.height = window.innerHeight + 3000;
	sky.label = 'Sky';
	sky.x = -2000;
	viewport.addChild(sky);

	const background = Sprite.from(backgroundTexture);
	background.scale.set(25);
	background.position.set(
		viewport.worldWidth / 2 - 7000,
		viewport.worldHeight - 6700,
	);
	viewport.addChild(background);

	const tempBounds = new Bounds();

	function cull(
		container: Container,
		view: Rectangle | Bounds,
		skipUpdateTransform = true,
	) {
		if (
			container.cullable &&
			container.measurable &&
			container.includeInBuild
		) {
			const pos = container.getGlobalPosition(
				undefined,
				skipUpdateTransform,
			);
			// TODO: Bounds don't seem to properly scale? Workaround using a margin for now
			const bounds =
				container.cullArea ??
				getGlobalBounds(container, skipUpdateTransform, tempBounds);

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
		background.visible = visibleBounds.top >= viewport.worldHeight - 6700;
	});

	window.addEventListener('resize', () => {
		viewport.clampZoom(getClampZoom(viewport));
		viewport.resize();
		if (window.innerHeight > 3000) sky.height = window.innerHeight + 3000;
	});

	app.ticker.add(() => {
		if (viewport.dirty) {
			viewport.children?.forEach((child) =>
				cull(child, app.stage.getBounds(true)),
			);
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
}

function setupSigns(viewport: Viewport) {
	const bottomMiddleX = WORLD_WIDTH / 2;
	const bottomMiddleY = WORLD_HEIGHT * 0.95;

	const fanProjectSignContainer = new Container();
	const fanProjectSign = Sprite.from('Wooden_Sign_Plain');
	fanProjectSign.anchor.set(0.5);
	fanProjectSign.scale.x = -1;
	fanProjectSign.angle = -7;
	fanProjectSignContainer.addChild(fanProjectSign);

	const fanProjectSignText = new Text({
		text: 'This is a non-profit fan project, not affiliated with COVER Corp. or affiliates.',
		style: {
			fontFamily: 'UnifontEXMono',
			fontSize: 48,
			fontWeight: 'bold',
			fill: 'white',
			wordWrap: true,
			wordWrapWidth: 550,
			align: 'center',
		},
		angle: -8,
	});
	fanProjectSignText.anchor.set(0.5, 1.25);
	fanProjectSignContainer.addChild(fanProjectSignText);
	fanProjectSignContainer.position.set(
		bottomMiddleX - 800,
		bottomMiddleY - 800,
	);

	viewport.addChild(fanProjectSignContainer);

	const arborDaySignContainer = new Container();
	const arborDaySign = Sprite.from('Wooden_Sign');
	arborDaySign.anchor.set(0.5);
	arborDaySign.angle = 4;
	const brightnessFilter = new ColorMatrixFilter();
	brightnessFilter.brightness(1.5, true);
	arborDaySign.filters = brightnessFilter;

	const arborDayLogo = Sprite.from('ArborDayFoundation');
	arborDayLogo.anchor.set(0.5, 0.93);
	arborDayLogo.scale.set(0.35);
	arborDayLogo.angle = 4;

	arborDaySignContainer.addChild(arborDaySign);
	arborDaySignContainer.addChild(arborDayLogo);

	arborDaySignContainer.position.set(
		bottomMiddleX + 900,
		bottomMiddleY - 780,
	);
	viewport.addChild(arborDaySignContainer);
}

async function setupTree(viewport: Viewport) {
	const bottomMiddleX = viewport.worldWidth / 2;
	const bottomMiddleY = viewport.worldHeight * 0.95;

	const treeContainer = await buildTreeSpriteGraph(
		bottomMiddleX,
		bottomMiddleY,
		viewport,
	);
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
	setupSigns(viewport);
	DonationPopup.init(app, viewport);
	await setupTree(viewport);

	return viewport;
}

function possibleUuuu() {
	if (Math.floor(Math.random() * 20) >= 18) {
		const loadingText = document.getElementById('loading-screen-text');
		if (loadingText) {
			(loadingText as HTMLSpanElement).textContent = 'uuuuuuuuuuuuuuuuuu';
		}
	}
}

void (async () => {
	possibleUuuu();

	const viewport = await setupPixi();

	// Replace the #loading-container with a text that says "Click to start"
	const loadingContainer = document.getElementById('loading-container');
	if (loadingContainer) {
		loadingContainer.innerHTML = 'Tap anywhere to start!';
		const loadingScreen = document.getElementById('loading-screen');
		if (loadingScreen) {
			loadingScreen.classList.add('cursor-pointer');
			loadingScreen.addEventListener('click', () => {
				// Add fade-out effect to the loading screen
				loadingScreen.classList.add('fade-out');
				setTimeout(() => {
					loadingScreen.remove();
				}, 2000);

				void Assets.loadBundle('default').then((resources) => {
					// Initialize background music
					const storedVolume = localStorage.getItem('storedVolume');
					let volume = 1;
					if (storedVolume != null) {
						const parsed = parseFloat(storedVolume);
						if (!isNaN(parsed)) {
							volume = parsed;
						}
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
					const backgroundMusic = Sound.from(resources.bgm);
					void backgroundMusic.play({
						loop: true,
						singleInstance: true,
						volume: 0.3,
					});
					backgroundMusic.volume = volume;

					// Connect the background music to the volume-control component
					const volumeControl = document.querySelector(
						'volume-control',
					) as HTMLElement & {
						backgroundMusic: Sound | null;
					};

					if (volumeControl) {
						volumeControl.backgroundMusic = backgroundMusic;
					}
				});

				// Check if user has entered page for first time
				// If so, open the about modal
				const hasVisited = localStorage.getItem('hasVisited');
				if (hasVisited !== 'true') {
					const aboutModal = document.querySelector('about-modal');
					if (aboutModal) {
						setTimeout(() => {
							aboutModal.isOpen = true;
						}, 2300);
					}
					localStorage.setItem('hasVisited', 'true');
				}

				// Connect the viewport to the search modal.
				const searchModal = document.querySelector(
					'find-donation-modal',
				) as HTMLElement & {
					viewport: Viewport | undefined;
				};
				if (searchModal) {
					searchModal.viewport = viewport;
				}
			});
		}
	}
})();
