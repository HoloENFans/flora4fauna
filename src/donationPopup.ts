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

class DonationPopup {
	static #instance: DonationPopup;

	private viewport?: Viewport;
	private container?: Container;
	private leaf?: Sprite;
	private usernameText?: Text;
	private amountText?: Text;
	private messageText?: Text;

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
			!this.messageText
		)
			return;
		console.log('hi');

		const isSmallScreen = window.innerWidth < 768;

		if (isSmallScreen) {
			// Vertical orientation for small screens
			this.leaf.rotation = Math.PI / 2;

			this.leaf.setSize(
				window.innerHeight - 100,
				window.innerWidth - 100,
			);
			this.leaf.position.set(window.innerWidth - 25, 100);
			this.usernameText.scale.set(0.6);
			this.amountText.scale.set(0.6);
			this.messageText.scale.set(0.6);

			// Center username text above the leaf
			this.usernameText.anchor.set(0.5, 1);
			this.usernameText.position.set(
				this.leaf.x,
				this.leaf.y - this.leaf.height / 2 - 20,
			);

			// Center amount text below the username
			this.amountText.anchor.set(0.5, 1);
			this.amountText.position.set(
				this.leaf.x,
				this.leaf.y - this.leaf.height / 2 + 10,
			);

			// Center the message text inside the leaf
			this.messageText.anchor.set(0.5, 1);
			this.messageText.position.set(this.leaf.x, this.leaf.y);
			this.messageText.style.wordWrapWidth = this.leaf.width - 10;
		} else {
			// Reset to normal, apply old style
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
		this.container.on('click', () => this.close());

		const background = new Graphics()
			.rect(0, 0, app.renderer.width, app.renderer.height)
			.fill({ color: '#00000095' });
		background.cursor = 'pointer';
		background.eventMode = 'static';
		this.container.addChild(background);
		const superchatContainer = new Container({
			x: app.renderer.width / 2 - 400,
			y: app.renderer.height / 2 - 150,
			width: 800,
			height: 300,
		});
		superchatContainer.eventMode = 'static';
		superchatContainer.on('click', (e) => {
			e.stopPropagation();
		});
		this.container.addChild(superchatContainer);

		this.leaf = Sprite.from('Big_Leaf_Greyscale');
		this.leaf.anchor.set(0.5);
		this.leaf.position.set(440, 150);
		superchatContainer.addChild(this.leaf);

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
			x: 32,
			y: 42,
		});
		superchatContainer.addChild(this.usernameText);

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
			x: 768,
			y: 42,
			anchor: new Point(1, 0),
		});
		superchatContainer.addChild(this.amountText);

		this.messageText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 24,
				fill: 'white',
				wordWrap: true,
				wordWrapWidth: 736,
				stroke: {
					color: 'black',
					width: 4,
				},
			},
			x: 32,
			y: 96,
		});
		superchatContainer.addChild(this.messageText);

		const closeText = new Text({
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
		closeText.on('click', () => this.close());
		superchatContainer.addChild(closeText);

		this.checkLeafOrientation();

		window.addEventListener('resize', () => {
			background
				.clear()
				.rect(0, 0, window.innerWidth, window.innerHeight)
				.fill({ color: '#00000095' });
			superchatContainer.position.set(
				window.innerWidth / 2 - 400,
				window.innerHeight / 2 - 150,
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

		this.usernameText!.text = donation.username.substring(0, 24);
		this.amountText!.text = `$${donation.amount}`;
		this.messageText!.text = donation.message.substring(0, 321);
		this.leaf!.tint = tint;
		const colorMatrix = new ColorMatrixFilter();
		colorMatrix.brightness(brightness, true);
		this.leaf!.filters = colorMatrix;
		this.container.visible = true;

		this.viewport!.plugins.pause('wheel');
		this.viewport!.plugins.pause('drag');
	}
}

export default DonationPopup.instance;
