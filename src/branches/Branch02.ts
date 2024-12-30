import Branch from './Branch.ts';
import { Sprite } from 'pixi.js';
import Leaf from './Leaf.ts';

export default class Branch02 extends Branch {
	constructor() {
		super();
		this.label = 'Branch_02';
		this.scale = 0.4;
	}

	init() {
		this.renderBranchSection(Sprite.from('Branch_Root'), 'Root');
		this.renderBranchSection(Sprite.from(`Branch_Big_01`), 'Section 1');
		this.renderBranchSection(Sprite.from('Branch_Joint_01'), 'Join 1');
		this.renderBranchSection(Sprite.from(`Branch_Med_01`), 'Section 2');
		this.renderBranchSection(Sprite.from('Branch_Joint_02'), 'Join 2');
		this.renderBranchSection(Sprite.from('Branch_End'), 'End');

		const branch1 = this.renderSprite(
			Sprite.from('Branch_Left_Complete_Short'),
			30,
			-3990,
			330,
			'Branch 1',
		);
		branch1.visible = true;

		const leaf1 = new Leaf([branch1]);
		leaf1.position.set(-535, -5055);
		leaf1.angle = -125;
		leaf1.label = 'Leaf 01';
		this.addChild(leaf1);
		this.leafs.push(leaf1);

		const leaf2 = new Leaf();
		leaf2.position.set(-438, -5018);
        leaf2.angle = -68;
		leaf2.label = 'Leaf 02';
		this.addChild(leaf2);
		this.leafs.push(leaf2);

		const leaf3 = new Leaf();
		leaf3.position.set(-475, -4900);
		leaf3.angle = -159;
		leaf3.label = 'Leaf 03';
		this.addChild(leaf3);
		this.leafs.push(leaf3);

		const leaf4 = new Leaf();
		leaf4.position.set(20, -5030);
		leaf4.angle = -96;
		leaf4.label = 'Leaf 04';
		this.addChild(leaf4);
		this.leafs.push(leaf4);

		const leaf5 = new Leaf();
		leaf5.position.set(20, -4850);
		leaf5.angle = -40;
		leaf5.label = 'Leaf 05';
		this.addChild(leaf5);
		this.leafs.push(leaf5);

        const branch2 = this.renderSprite(
			Sprite.from('Branch_Right_Complete_Short'),
			0,
			-2500,
			30,
			'Branch 2',
		);
		branch2.visible = false;

		const leaf6 = new Leaf([branch2]);
		leaf6.position.set(770, -3930);
		leaf6.angle = -48;
		leaf6.label = 'Leaf 06';
		this.addChild(leaf6);
		this.leafs.push(leaf6);

		const leaf7 = new Leaf();
		leaf7.position.set(670, -3875);
		leaf7.angle = -110;
		leaf7.label = 'Leaf 07';
		this.addChild(leaf7);
		this.leafs.push(leaf7);

		const leaf8 = new Leaf();
		leaf8.position.set(690, -3760);
		leaf8.angle = -12;
		leaf8.label = 'Leaf 08';
		this.addChild(leaf8);
		this.leafs.push(leaf8);

        const leaf9 = new Leaf();
		leaf9.position.set(585, -3620);
		leaf9.angle = -115;
		leaf9.label = 'Leaf 09';
		this.addChild(leaf9);
		this.leafs.push(leaf9);

		const leaf10 = new Leaf();
		leaf10.position.set(582, -3572);
		leaf10.angle = 0;
		leaf10.label = 'Leaf 10';
		this.addChild(leaf10);
		this.leafs.push(leaf10);

		const branch3 = this.renderSprite(
			Sprite.from('Branch_Left_Complete_Short'),
			-50,
			-1500,
			-40,
			'Branch 3',
		);
		branch3.visible = false;

		const leaf11 = new Leaf([branch3]);
		leaf11.position.set(-790, -2440);
		leaf11.angle = -120;
		leaf11.label = 'Leaf 11';
		this.addChild(leaf11);
		this.leafs.push(leaf11);

		const leaf12 = new Leaf();
		leaf12.position.set(-685, -2430);
		leaf12.angle = -80;
		leaf12.label = 'Leaf 12';
		this.addChild(leaf12);
		this.leafs.push(leaf12);

		const leaf13 = new Leaf();
		leaf13.position.set(-710, -2310);
		leaf13.angle = 190;
		leaf13.label = 'Leaf 13';
		this.addChild(leaf13);
		this.leafs.push(leaf13);

		const leaf14 = new Leaf();
		leaf14.position.set(-555, -2150);
		leaf14.angle = 175;
		leaf14.label = 'Leaf 14';
		this.addChild(leaf14);
		this.leafs.push(leaf14);

		const leaf15 = new Leaf();
		leaf15.position.set(-575, -2210);
		leaf15.angle = -70;
		leaf15.label = 'Leaf 15';
		this.addChild(leaf15);
		this.leafs.push(leaf15);
	}
}
