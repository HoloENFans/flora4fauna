import { Container, Sprite } from 'pixi.js';
import { Donation } from '../donationPopup.ts';
import type Leaf from './Leaf.ts';
import { LeafInfo } from './Leaf.ts';

export default abstract class Branch extends Container {
	public readonly capacity = 15;

	protected lastBranchSectionY = 0;
	protected donationCount = 0;
	protected leafs: Leaf[] = [];

	protected constructor() {
		super();

		this.cullable = true;
		this.cullableChildren = true;
		this.init();
		this.zIndex = -1;
	}

	get count() {
		return this.donationCount;
	}

	get full() {
		return this.count >= this.capacity;
	}

	addDonationToBranch(donation: Donation, branchLabel: string, isLeftBranch: boolean): LeafInfo {
		if (this.full) throw new Error('Branch is full!');

		this.donationCount += 1;
		return this.leafs[this.count - 1].setDonation(donation, branchLabel, this.leafs[this.count - 1].label, isLeftBranch);
	}

	protected renderBranchSection(sprite: Sprite, label?: string) {
		sprite.y = this.lastBranchSectionY;
		sprite.cullable = true;
		sprite.anchor.set(0.5, 1.0);
		if (label) sprite.label = label;
		this.addChild(sprite);
		this.lastBranchSectionY -= sprite.height - 5;
	}

	protected renderSprite(
		sprite: Sprite,
		x: number,
		y: number,
		angle: number,
		label?: string,
		container: Container = this,
	) {
		sprite.position.set(x, y);
		sprite.angle = angle;
		sprite.cullable = true;
		sprite.anchor.set(0.5, 1.0);
		if (label) sprite.label = label;
		container.addChild(sprite);

		return sprite;
	}

	protected abstract init(): void;
}
