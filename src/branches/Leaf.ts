import { Container, Sprite, Text } from 'pixi.js';
import DonationPopup, { Donation } from '../donationPopup.ts';

export interface LeafInfo {
	x: number;
	y: number;
	tint: number;
}

export default class Leaf extends Container {
	private readonly prerequisites?: Container[];
	private readonly leafSprite;
	private readonly usernameText;
	private readonly amountText;

	private hasDonation = false;

	/**
	 * @param prerequisites - A list of containers that should be visible before rendering the leaf
	 */
	constructor(prerequisites?: Container[]) {
		super();

		this.cullable = true;
		this.visible = false;

		this.prerequisites = prerequisites;
		this.leafSprite = Sprite.from('Leaf_Greyscale_01');
		this.leafSprite.anchor.set(0.5, 1.0);
		this.leafSprite.angle = 90;
		this.leafSprite.scale = 1.5;
		this.addChild(this.leafSprite);

		this.usernameText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 24,
				fontWeight: 'bold',
				fill: 'white',
				align: 'left',
			},
			x: 85,
			y: -58,
		});
		this.addChild(this.usernameText);

		this.amountText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 48,
				fontWeight: 'bold',
				fill: 'white',
				align: 'center',
			},
			x: 170,
			y: 10,
		});
		this.addChild(this.amountText);
	}

	private getTint(amount: number): [number, number | undefined] {
		// TODO: Check date and return correct, color
		return [0x8eb332, undefined];
	}

	setDonation(donation: Donation): LeafInfo {
		if (this.hasDonation) {
			throw new Error('Cannot reassign leaf!');
		}

		this.prerequisites?.forEach((container) => {
			container.visible = true;
		});
		this.usernameText.text = donation.username;
		this.amountText.text = `$${donation.amount}`;

		const [tint, textColor] = this.getTint(donation.amount);
		this.leafSprite.tint = tint;

		if (textColor) {
			this.usernameText.style.fill = textColor;
			this.amountText.style.fill = textColor;
		}

		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('click', () => {
			DonationPopup.setDonation(donation, tint);
		});

		this.visible = true;
		this.hasDonation = true;

		const bounds = this.leafSprite.getBounds();
		return {
			x: bounds.x,
			y: bounds.y,
			tint: tint,
		};
	}
}
