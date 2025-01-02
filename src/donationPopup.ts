import {
	Application,
	ColorMatrixFilter,
	Container,
	Graphics,
	Point,
	Sprite,
	Text,
} from 'pixi.js';
import type { Viewport } from 'pixi-viewport';

export interface Donation {
	username: string;
	message: string;
	amount: number;
	created: string; // ISO string, sort on date
	updated: string;
}

const SUPERCHAT_CONTAINER_WIDTH = 800;
const SUPERCHAT_CONTAINER_HEIGHT = 300;

const WIDTH_OFFSET = SUPERCHAT_CONTAINER_WIDTH / 2;
const HEIGHT_OFFSET = SUPERCHAT_CONTAINER_HEIGHT / 2;

const LEAF_WIDTH = 1148;
const LEAF_HEIGHT = 472;

class DonationPopup {
	static #instance: DonationPopup;

	private viewport?: Viewport;
	private container?: Container;
	private superchatContainer?: Container;
	private leaf?: Sprite;
	private usernameText?: Text;
	private amountText?: Text;
	private messageText?: Text;
	private closeText?: Text;

	public static get instance(): DonationPopup {
		if (!this.#instance) {
			this.#instance = new DonationPopup();
		}

		return this.#instance;
	}

	private close() {
		if (!this.container || !this.viewport) return;

		this.container.visible = false;
		this.viewport.plugins.resume('wheel');
		this.viewport.plugins.resume('drag');
	}

	private checkLeafOrientation() {
		if (
			!this.leaf ||
			!this.usernameText ||
			!this.amountText ||
			!this.messageText ||
			!this.closeText
		)
			return;

		const isSmallScreen = window.innerWidth < LEAF_WIDTH + 25;
		const isVertical =
			window.innerWidth < window.innerHeight && window.innerWidth < 810;

		// Basically a few cases:
		// - Small + vertical
		// - Small + horizontal
		// - Normal
		//
		// This is ugly af I'm so sorry but it's 4am and I'm going insane

		if (isSmallScreen && isVertical) {
			const PADDING_OFFSET = 80;

			this.leaf.rotation = Math.PI / 2;

			this.leaf.setSize(
				Math.min(window.innerHeight - PADDING_OFFSET, LEAF_WIDTH),
				Math.min(window.innerWidth - PADDING_OFFSET, LEAF_HEIGHT),
			);

			this.leaf.y = HEIGHT_OFFSET - PADDING_OFFSET / 2 + 5;

			let usernameOffset = -70;
			let amountTextOffset = -50;
			let messageTextOffset = -15;
			if (window.innerWidth < 500) {
				this.usernameText.scale.set(0.6);
				this.amountText.scale.set(0.6);
				this.messageText.scale.set(0.65);
			} else if (window.innerWidth < 650) {
				this.usernameText.scale.set(0.7);
				this.amountText.scale.set(0.7);
				this.messageText.scale.set(0.75);

				usernameOffset = -100;
				amountTextOffset = usernameOffset + 40;
				messageTextOffset = amountTextOffset + 50;
			} else {
				this.usernameText.scale.set(0.8);
				this.amountText.scale.set(0.8);
				this.messageText.scale.set(0.8);

				usernameOffset = -200;
				amountTextOffset = usernameOffset + 40;
				messageTextOffset = amountTextOffset + 50;
			}

			// Center username text
			this.usernameText.anchor.set(0.5, 0);
			this.usernameText.position.set(this.leaf.x, usernameOffset);

			// Center amount text below the username
			this.amountText.anchor.set(0.5, 0);
			this.amountText.position.set(this.leaf.x, amountTextOffset);

			// Center the message text inside the leaf
			this.messageText.anchor.set(0.5, 0);
			this.messageText.position.set(this.leaf.x, messageTextOffset);
			if (isVertical) {
				this.messageText.style.align = 'center';
				this.messageText.style.wordWrapWidth = this.leaf.height;
			} else {
				this.messageText.style.wordWrapWidth = this.leaf.width;
			}

			// Move the x button
			this.closeText.text = '×';
			this.closeText.anchor.set(0, 0);

			this.closeText.position.set(
				this.leaf.x + this.leaf.height / 2,
				this.leaf.y - this.leaf.width / 2,
			);

			return;
		} else if (isSmallScreen && !isVertical) {
			const PADDING_OFFSET = 80;

			this.leaf.rotation = 0;
			this.leaf.setSize(
				Math.min(window.innerWidth - PADDING_OFFSET, LEAF_WIDTH),
				Math.min(window.innerHeight - PADDING_OFFSET, LEAF_HEIGHT),
			);
			this.leaf.position.set(WIDTH_OFFSET, HEIGHT_OFFSET);

			// This is gross.
			this.messageText.style.align = 'left';

			if (window.innerWidth < 500) {
				this.usernameText.scale.set(0.5);
				this.amountText.scale.set(0.5);
				this.messageText.scale.set(0.5);

				const usernameOffset = 70;

				this.usernameText.anchor.set(0.5, 0);
				this.usernameText.position.set(this.leaf.x, usernameOffset);

				this.amountText.anchor.set(0.5, 0);
				this.amountText.position.set(this.leaf.x, usernameOffset + 20);

				this.messageText.anchor.set(0.5, 0);
				this.messageText.position.set(
					this.leaf.x,
					usernameOffset + 20 + 20,
				);

				this.messageText.style.wordWrapWidth = this.leaf.width;
			} else {
				this.usernameText.scale.set(0.8);
				this.amountText.scale.set(0.8);
				this.messageText.scale.set(0.8);

				// Fix username
				this.usernameText.anchor.set(0);
				this.usernameText.position.set(120, 42);

				// Fix amount text
				this.amountText.anchor.set(1, 0);
				this.amountText.position.set(600, 42);

				// Fix message text
				this.messageText.anchor.set(0);
				this.messageText.position.set(120, 96);
				this.messageText.style.wordWrapWidth = 600;
			}

			this.closeText.text = '×';
			this.closeText.position.set(
				this.leaf.x + this.leaf.width / 2,
				this.leaf.y - this.leaf.height / 2,
			);
		} else {
			// Reset to normal, apply old style.

			// Fix leaf
			this.leaf.rotation = 0;
			this.leaf.setSize(LEAF_WIDTH, LEAF_HEIGHT);
			this.leaf.position.set(WIDTH_OFFSET, HEIGHT_OFFSET);

			// Fix scaling
			this.usernameText.scale.set(1);
			this.amountText.scale.set(1);
			this.messageText.scale.set(1);

			// Fix username
			this.usernameText.anchor.set(0);
			this.usernameText.position.set(10, 42);

			// Fix amount text
			this.amountText.anchor.set(1, 0);
			this.amountText.position.set(726, 42);

			// Fix message text
			this.messageText.anchor.set(0);
			this.messageText.position.set(10, 96);
			this.messageText.style.align = 'left';
			this.messageText.style.wordWrapWidth = 736;

			// Fix close button
			const shouldHideCloseText = window.innerWidth < LEAF_WIDTH;

			if (shouldHideCloseText) {
				this.closeText.text = '×';
			} else {
				this.closeText.text = '× Close';
			}

			this.closeText.position.set(900, -30);
		}
	}

	public init(app: Application, viewport: Viewport) {
		if (this.container) {
			return;
		}

		this.viewport = viewport;

		this.container = new Container();
		this.container.eventMode = 'static';
		this.container.visible = false;
		this.container.on('wheel', (e) => {
			e.stopImmediatePropagation();
		});
		this.container.on('pointerdown', () => this.close());
		this.container.on('tap', () => this.close());

		const background = new Graphics()
			.rect(0, 0, app.renderer.width, app.renderer.height)
			.fill({ color: '#00000095' });
		background.cursor = 'pointer';
		background.eventMode = 'static';
		this.container.addChild(background);
		this.superchatContainer = new Container({
			x: (app.renderer.width - SUPERCHAT_CONTAINER_WIDTH) / 2,
			y: (app.renderer.height - SUPERCHAT_CONTAINER_HEIGHT) / 2,
			width: SUPERCHAT_CONTAINER_WIDTH,
			height: SUPERCHAT_CONTAINER_HEIGHT,
		});
		this.superchatContainer.eventMode = 'static';
		this.superchatContainer.on('pointerdown', (e) => {
			e.stopPropagation();
		});
		this.superchatContainer.on('tap', (e) => {
			e.stopPropagation();
		});
		this.container.addChild(this.superchatContainer);

		this.usernameText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 36,
				fontWeight: 'bold',
				fill: 'white',
				stroke: {
					color: 'black',
					width: 6,
				},
			},
			x: 10,
			y: 42,
		});
		this.superchatContainer.addChild(this.usernameText);

		this.amountText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 36,
				fontWeight: 'bold',
				fill: 'white',
				align: 'right',
				stroke: {
					color: 'black',
					width: 6,
				},
			},
			x: 726,
			y: 42,
			anchor: new Point(1, 0),
		});
		this.superchatContainer.addChild(this.amountText);

		this.messageText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 24,
				fill: 'white',
				wordWrap: true,
				wordWrapWidth: 736,
				breakWords: true,
				align: 'left',
				stroke: {
					color: 'black',
					width: 4,
				},
			},
			x: 10,
			y: 96,
		});
		this.superchatContainer.addChild(this.messageText);

		this.closeText = new Text({
			text: '× Close',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 24,
				fill: 'white',
				stroke: {
					color: 'black',
					width: 6,
				},
			},
			x: 900,
			y: -30,
			eventMode: 'static',
			cursor: 'pointer',
		});
		this.closeText.on('pointerdown', () => this.close());
		this.closeText.on('tap', () => this.close());
		this.superchatContainer.addChild(this.closeText);

		window.addEventListener('resize', () => {
			background
				.clear()
				.rect(0, 0, window.innerWidth, window.innerHeight)
				.fill({ color: '#00000095' });

			this.superchatContainer!.position.set(
				window.innerWidth / 2 - WIDTH_OFFSET,
				window.innerHeight / 2 - HEIGHT_OFFSET,
			);

			this.checkLeafOrientation();
		});

		app.stage.addChild(this.container);
	}

	public setDonation(
		donation: Donation | null,
		tint: number,
		brightness: number,
	) {
		if (!this.container) return;

		if (!donation) {
			this.container.visible = false;
			return;
		}

		// Check if donation amount is > 1000 => platinum sprite
		let newLeaf: Sprite;
		if (donation.amount >= 1000) {
			newLeaf = Sprite.from('Big_Leaf_Platinum');
		} else {
			newLeaf = Sprite.from('Big_Leaf_Greyscale');
		}

		// Don't know if there's a better way than this, since this is basically replacing a new sprite every time
		// But cound't find a way to only change the sprite so this is will do for now
		if (this.leaf) {
			this.leaf.destroy();
			this.superchatContainer!.removeChild(this.leaf);
		}

		this.leaf = newLeaf;
		this.leaf.anchor.set(0.5);
		this.leaf.position.set(WIDTH_OFFSET, HEIGHT_OFFSET);

		// Add leaf to the back and check orientation
		this.superchatContainer!.addChildAt(this.leaf, 0);
		this.checkLeafOrientation();

		// Apply color filters
		const colorMatrix = new ColorMatrixFilter();
		colorMatrix.brightness(brightness, true);
		this.leaf.filters = [colorMatrix];
		this.leaf.tint = tint;

		// Update text values
		this.usernameText!.text = donation.username.substring(0, 24);
		this.amountText!.text = `$${donation.amount}`;
		this.messageText!.text = donation.message.substring(0, 321);

		this.container.visible = true;

		// Pause viewport interactions
		this.viewport!.plugins.pause('wheel');
		this.viewport!.plugins.pause('drag');
	}
}

export default DonationPopup.instance;
