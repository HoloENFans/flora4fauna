import { Application, Container, Graphics, Sprite, Text } from 'pixi.js';
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
	private usernameText?: Text;
	private amountText?: Text;
	private messageText?: Text;

	public static get instance(): DonationPopup {
		if (!this.#instance) {
			this.#instance = new DonationPopup();
		}

		return this.#instance;
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
		this.container.on('click', () => {
			this.container!.visible = false;
			viewport.plugins.resume('wheel');
			viewport.plugins.resume('drag');
		});

		const background = new Graphics()
			.rect(0, 0, app.renderer.width, app.renderer.height)
			.fill({ color: '#00000095' });
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

		const leaf = Sprite.from('Leaf_01');
		leaf.rotation = 0.5 * Math.PI;
		leaf.scale = 4;
		leaf.tint = '#ee6191';
		leaf.anchor.set(0.5);
		leaf.position.set(440, 150);
		superchatContainer.addChild(leaf);

		this.usernameText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 36,
				fontWeight: 'bold',
				fill: 'white',
			},
		});
		this.usernameText.position.set(32, 18);
		superchatContainer.addChild(this.usernameText);

		this.amountText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 36,
				fontWeight: 'bold',
				fill: 'white',
				align: 'right',
			},
		});
		this.amountText.position.set(768, 18);
		this.amountText.anchor.set(1, 0);
		superchatContainer.addChild(this.amountText);

		this.messageText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 24,
				fill: 'white',
				wordWrap: true,
				wordWrapWidth: 736,
			},
		});
		this.messageText.position.set(32, 72);
		superchatContainer.addChild(this.messageText);

		window.addEventListener('resize', () => {
			background
				.clear()
				.rect(0, 0, window.innerWidth, window.innerHeight)
				.fill({ color: '#00000095' });
			superchatContainer.position.set(
				window.innerWidth / 2 - 400,
				window.innerHeight / 2 - 150,
			);
		});

		app.stage.addChild(this.container);
	}

	public setDonation(donation: Donation | null) {
		if (!this.container) return;

		if (!donation) {
			this.container.visible = false;
			return;
		}

		this.usernameText!.text = donation.username.substring(0, 24);
		this.amountText!.text = `$${donation.amount}`;
		this.messageText!.text = donation.message.substring(0, 321);
		this.container.visible = true;

		this.viewport!.plugins.pause('wheel');
		this.viewport!.plugins.pause('drag');
	}
}

export default DonationPopup.instance;
