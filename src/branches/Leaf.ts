import { ColorMatrixFilter, Container, Sprite, Text } from 'pixi.js';
import DonationPopup, { Donation } from '../donationPopup.ts';
import { getRandomNumber } from '../random.ts';

export interface LeafInfo {
	x: number;
	y: number;
	tint: number;
	brightness: number;
}

type BranchSide = 'leftSide' | 'rightSide';
type BranchLabel = 'Branch_01' | 'Branch_02';
type LeafLabel = 'Leaf 01' | 'Leaf 02' | 'Leaf 03' | 'Leaf 04' | 'Leaf 05' | 'Leaf 06' | 'Leaf 07' | 'Leaf 08' | 'Leaf 09' | 'Leaf 10' | 'Leaf 11' | 'Leaf 12' | 'Leaf 13' | 'Leaf 14' | 'Leaf 15';

function isLeafLabel(label: string): label is LeafLabel {
    return ['Leaf 01', 'Leaf 02', 'Leaf 03', 'Leaf 04', 'Leaf 05', 'Leaf 06', 'Leaf 07', 'Leaf 08', 'Leaf 09', 'Leaf 10', 'Leaf 11', 'Leaf 12', 'Leaf 13', 'Leaf 14', 'Leaf 15'].includes(label);
}

export default class Leaf extends Container {
	private readonly prerequisites?: Container[];
	private readonly leafSprite;
	private readonly usernameText;
	private readonly amountText;

	private hasDonation = false;

	private static readonly leavesToRotate: Record<BranchSide, Record<BranchLabel, LeafLabel[]>> = {
		'leftSide': {
			'Branch_01': ['Leaf 01', 'Leaf 02', 'Leaf 03', 'Leaf 04', 'Leaf 05', 'Leaf 06', 'Leaf 07', 'Leaf 08', 'Leaf 09', 'Leaf 10', 'Leaf 11', 'Leaf 12', 'Leaf 14', 'Leaf 15'],
			'Branch_02': ['Leaf 01', 'Leaf 02', 'Leaf 03', 'Leaf 04', 'Leaf 05', 'Leaf 06', 'Leaf 07', 'Leaf 08', 'Leaf 09', 'Leaf 11', 'Leaf 12', 'Leaf 13', 'Leaf 15']
		},
		'rightSide': {
			'Branch_01': ['Leaf 12', 'Leaf 13'],
			'Branch_02': ['Leaf 13', 'Leaf 14']
		}
	};

	// tint, brightness
	public static readonly sakuraThemeLeafColors: [number, number][] = [
		[0xff8bd4, 1.75],
		[0xfeb5e3, 1.75],
		[0xfcbcdf, 1.75],
	];

	public static readonly greenThemeLeafColors: [number, number][] = [
		[0x8eb332, 1],
		[0x60b967, 1],
		[0x7ff180, 1],
		[0x51ff08, 1],
		[0x5eff01, 1.25],
		[0xfdd100, 1.5],
		[0xf26649, 1],
	];

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
			},
			x: this.leafSprite.x * 2 + this.leafSprite.width,
			y: -40,
		});
		this.usernameText.anchor.set(0.5, 0.5);
		this.addChild(this.usernameText);

		this.amountText = new Text({
			text: '',
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize: 48,
				fontWeight: 'bold',
				fill: 'white',
			},
			x: this.leafSprite.x * 2 + this.leafSprite.width,
			y: 40,
		});
		this.amountText.anchor.set(0.5, 0.5);
		this.addChild(this.amountText);
	}

	private getTint(amount: number): [number, number] {
		// Graduation sakura colors
		const now = new Date();
		const pstNow = new Date(
			now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
		);
		const isSakuraDay = pstNow.getMonth() === 0 && pstNow.getDate() === 3;
		if (isSakuraDay) {
			const randNum = getRandomNumber(
				0,
				Leaf.sakuraThemeLeafColors.length,
			);
			return Leaf.sakuraThemeLeafColors[randNum];
		} else {
			if (amount >= 5 && amount < 10) {
				return Leaf.greenThemeLeafColors[1];
			} else if (amount >= 10 && amount < 20) {
				return Leaf.greenThemeLeafColors[2];
			} else if (amount >= 20 && amount < 50) {
				return Leaf.greenThemeLeafColors[3];
			} else if (amount >= 50 && amount < 100) {
				return Leaf.greenThemeLeafColors[4];
			} else if (amount >= 100 && amount < 1000) {
				return Leaf.greenThemeLeafColors[5];
			} else if (amount >= 1000) {
				return Leaf.greenThemeLeafColors[6];
			} else {
				return Leaf.greenThemeLeafColors[0];
			}
		}
	}

	setDonation(donation: Donation, branchLabel: string, leafLabel: string, isLeftBranch: boolean): LeafInfo {
		if (this.hasDonation) {
			throw new Error('Cannot reassign leaf!');
		}

		this.prerequisites?.forEach((container) => {
			container.visible = true;
		});
		this.usernameText.text = donation.username;
		this.amountText.text = `$${donation.amount}`;

		const currentBranch: BranchSide = isLeftBranch ? 'leftSide' : 'rightSide';
		const currentBranchLabel: BranchLabel = branchLabel === 'Branch_01' ? 'Branch_01' : 'Branch_02'; // Oof...

		if (isLeafLabel(leafLabel)) {
			const shouldRotateText = Leaf.leavesToRotate[currentBranch][currentBranchLabel].includes(leafLabel);

			if (shouldRotateText) {
				this.usernameText.angle += 180;
				this.usernameText.y = 40;
				this.amountText.angle += 180;
				this.amountText.y = -40;
			}
		} else {
			console.error(`Error! Invalid leaf label: ${leafLabel}\nSkipping rotation check for this leaf!`);
		}

		const [tint, brightness] = this.getTint(donation.amount);
		this.leafSprite.tint = tint;
		const brightnessFilter = new ColorMatrixFilter();
		brightnessFilter.brightness(brightness, true);
		this.leafSprite.filters = brightnessFilter;
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('pointerdown', () => {
			DonationPopup.setDonation(donation, tint, brightness);
		});
		this.on('tap', () => {
			DonationPopup.setDonation(donation, tint, brightness);
		});

		this.visible = true;
		this.hasDonation = true;

		const bounds = this.leafSprite.getBounds();
		return {
			x: bounds.x,
			y: bounds.y,
			tint: tint,
			brightness: brightness,
		};
	}
}
