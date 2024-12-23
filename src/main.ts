import './style.css';

import {
	Application,
	Assets,
	Container,
	Graphics,
	Rectangle,
	Sprite,
	Text,
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { initDevtools } from '@pixi/devtools';
import { WORLD_HEIGHT, WORLD_WIDTH, CULL_MARGIN } from './PixiConfig.ts';
import {
	addRxPlugin,
	createRxDatabase,
	RxReplicationPullStreamItem,
} from 'rxdb';
import { Subject } from 'rxjs';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import PocketBase, { RecordListOptions } from 'pocketbase';
import { buildTreeSpriteGraph } from './tree.ts';

const pb = new PocketBase(`https://base.flora4fauna.net`);

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
	// TODO: Update this to properly center Fauna into frame
	viewport.ensureVisible(bottomMiddleX + 700, bottomMiddleY - 400, 800, 800);
}

async function setupPixi() {
	const db = await setupDatabase();

	const [app, viewport] = await setup();
	await setupTextures();
	setupTree(viewport);

	const donation = (await db.collections.donations
		.findOne()
		.exec()) as Donation;

	viewport.plugins.pause('wheel');
	viewport.plugins.pause('drag');

	const superchatContainer = new Container();
	superchatContainer.eventMode = 'static';
	superchatContainer.on('wheel', (e) => {
		e.stopImmediatePropagation();
	});
	superchatContainer.on('click', () => {
		superchatContainer.visible = false;
		viewport.plugins.resume('wheel');
		viewport.plugins.resume('drag');
	});

	const superchatContainerBackground = new Graphics()
		.rect(0, 0, app.renderer.width, app.renderer.height)
		.fill({ color: '#00000095' });
	superchatContainer.addChild(superchatContainerBackground);
	const superchatInnerContainer = new Container({
		x: app.renderer.width / 2 - 400,
		y: app.renderer.height / 2 - 150,
		width: 800,
		height: 300,
	});
	superchatInnerContainer.eventMode = 'static';
	superchatInnerContainer.on('click', (e) => {
		e.stopPropagation();
	});
	superchatContainer.addChild(superchatInnerContainer);

	const superchatLeaf = Sprite.from('Leaf_01');
	superchatLeaf.rotation = 0.5 * Math.PI;
	superchatLeaf.scale = 4;
	superchatLeaf.tint = '#ee6191';
	superchatLeaf.anchor.set(0.5);
	superchatLeaf.position.set(440, 150);
	superchatInnerContainer.addChild(superchatLeaf);

	const username = new Text({
		text: donation.username,
		style: {
			fontFamily: 'UnifontEXMono',
			fontSize: 36,
			fontWeight: 'bold',
			fill: 'white',
		},
	});
	username.position.set(32, 18);
	superchatInnerContainer.addChild(username);

	const amount = new Text({
		text: `$${donation.amount}`,
		style: {
			fontFamily: 'UnifontEXMono',
			fontSize: 36,
			fontWeight: 'bold',
			fill: 'white',
			align: 'right',
		},
	});
	amount.position.set(768, 18);
	amount.anchor.set(1, 0);
	superchatInnerContainer.addChild(amount);

	const message = new Text({
		text: donation.message,
		style: {
			fontFamily: 'UnifontEXMono',
			fontSize: 24,
			fill: 'white',
			wordWrap: true,
			wordWrapWidth: 736,
		},
	});
	message.position.set(32, 72);
	superchatInnerContainer.addChild(message);

	window.addEventListener('resize', () => {
		superchatContainerBackground
			.clear()
			.rect(0, 0, window.innerWidth, window.innerHeight)
			.fill({ color: '#00000095' });
		superchatInnerContainer.position.set(
			window.innerWidth / 2 - 400,
			window.innerHeight / 2 - 150,
		);
	});

	app.stage.addChild(superchatContainer);
}

interface Donation {
	username: string;
	message: string;
	amount: number;
	created: string;
	updated: string;
}

async function setupDatabase() {
	addRxPlugin(RxDBDevModePlugin);

	const db = await createRxDatabase({
		name: 'flora4fauna',
		storage: getRxStorageDexie(),
	});

	if (!db.donations) {
		await db.addCollections({
			donations: {
				schema: {
					version: 0,
					primaryKey: 'id',
					type: 'object',
					properties: {
						id: { type: 'string', maxLength: 15 },
						username: { type: 'string' },
						message: { type: 'string' },
						amount: { type: 'number' },
						created: { type: 'string' },
						updated: { type: 'string' },
					},
					required: [
						'id',
						'username',
						'message',
						'amount',
						'created',
						'updated',
					],
				},
			},
		});
	}

	const pullStream$ = new Subject<
		RxReplicationPullStreamItem<Donation, { updated: string }>
	>();

	const unsubscribe = await pb
		.collection('donations')
		.subscribe<Donation>('*', (e) => {
			pullStream$.next({
				documents: [{ ...e.record, _deleted: false }],
				checkpoint: { updated: e.record.updated },
			});
		});

	addEventListener('beforeunload', () => {
		void unsubscribe();
	});

	replicateRxCollection<Donation, { updated: string } | undefined>({
		collection: db.donations,
		replicationIdentifier: 'cms-donations-replication',
		pull: {
			async handler(checkpoint, batchSize) {
				const options: RecordListOptions = {
					sort: '-updated',
				};

				if (checkpoint) {
					options.filter = `(updated>'${checkpoint.updated}')`;
				}

				const result = await pb
					.collection('donations')
					.getList<Donation>(1, batchSize, options);

				return {
					documents: result.items.map((donation) => ({
						...donation,
						_deleted: false,
					})),
					checkpoint:
						result.items.length > 0 ?
							{ updated: result.items[0].updated }
						:	checkpoint,
				};
			},
			stream$: pullStream$,
		},
	});

	return db;
}

void (async () => {
	await setupPixi();

	// Navbar logic
	const donateDialog = document.getElementById(
		'donate-dialog',
	)! as HTMLDialogElement;
	const donateBtn = document.getElementById('donate-btn')!;
	donateBtn.addEventListener('click', () => {
		donateDialog.showModal();
	});
})();
