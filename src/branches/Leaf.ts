import { ColorMatrixFilter, Container, Sprite, Text } from 'pixi.js';
import DonationPopup, { Donation } from '../donationPopup.ts';
import { getRandomNumber } from '../random.ts';

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

	private getTint(amount: number): [number, number | undefined, number] {
		// Graduation sakura colors
		if(Date.now() > new Date(2025, 0, 3).getTime() && Date.now() < new Date(2025, 0, 4).getTime()) {
			const sakuraColors: [number, number | undefined, number][] = [
				[0xFF8BD4, 0x000000, 1.75],
				[0xFEB5E3, 0x000000, 1.75],
				[0xFCBCDF, 0x000000, 1.75]
			];

			const randNum = getRandomNumber(0, sakuraColors.length);
			return sakuraColors[randNum];
		}
		else {
			const greenColors: [number, number | undefined, number][] = [
				[0x8EB332, undefined, 1],
				[0x60B967, undefined, 1],
				[0x7FF180, undefined, 1],
				[0x51FF08, undefined, 1],
				[0x5EFF01, undefined, 1.25],
				[0xFDD100, undefined, 1.50],
			];

			if(amount >= 5 && amount < 10) {
				return greenColors[1];
			}
			else if(amount >= 10 && amount < 20) {
				return greenColors[2];
			}
			else if(amount >= 20 && amount < 50) {
				return greenColors[3];
			}
			else if(amount >= 50 && amount < 100) {
				return greenColors[4];
			}
			else if(amount >= 100) {
				return greenColors[5];
			}
			else {
				return greenColors[0];
			}
		}
	}

	setDonation(donation: Donation) {
		if (this.hasDonation) {
			throw new Error('Cannot reassign leaf!');
		}

		this.prerequisites?.forEach((container) => {
			container.visible = true;
		});
		this.usernameText.text = donation.username;
		this.amountText.text = `$${donation.amount}`;

		const [tint, textColor, brightness] = this.getTint(donation.amount);
		this.leafSprite.tint = tint
		const brightnessFilter = new ColorMatrixFilter();
		brightnessFilter.brightness(brightness, true);
		this.leafSprite.filters = brightnessFilter;

		if (textColor !== undefined) {
			this.usernameText.style.fill = textColor;
			this.amountText.style.fill = textColor;
		}

		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('click', () => {
			DonationPopup.setDonation(donation, tint, brightness, textColor);
		});

		this.visible = true;
		this.hasDonation = true;
	}
}
