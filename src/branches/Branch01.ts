import Branch from './Branch.ts';
import { Sprite } from 'pixi.js';
import Leaf from './Leaf.ts';

export default class Branch01 extends Branch {
	constructor() {
		super();
		this.label = 'Branch variant 01';
		this.scale = 0.4;
	}

	init() {
		this.renderBranchSection(Sprite.from('Branch_Root'), 'Root');
		this.renderBranchSection(Sprite.from(`Branch_Big_01`), 'Section 1');
		this.renderBranchSection(Sprite.from('Branch_Joint_01'), 'Join 1');
		this.renderBranchSection(Sprite.from(`Branch_Med_01`), 'Section 2');
		this.renderBranchSection(Sprite.from('Branch_Joint_02'), 'Join 2');
		this.renderBranchSection(Sprite.from(`Branch_Small_01`), 'Section 3');
		this.renderBranchSection(Sprite.from('Branch_End'), 'End');

		const branch1 = this.renderSprite(
			Sprite.from('Branch_Right_Complete_Short'),
			30,
			-1500,
			36,
			'Branch 1',
		);
		branch1.visible = false;

		const leaf1 = new Leaf([branch1]);
		leaf1.position.set(865, -2685);
		leaf1.angle = -10;
		leaf1.label = 'Leaf 01';
		this.addChild(leaf1);
		this.leafs.push(leaf1);

		const leaf2 = new Leaf();
		leaf2.position.set(840, -2810);
		leaf2.angle = -100;
		leaf2.label = 'Leaf 02';
		this.addChild(leaf2);
		this.leafs.push(leaf2);

		const leaf3 = new Leaf();
		leaf3.position.set(940, -2835);
		leaf3.angle = -55;
		leaf3.label = 'Leaf 03';
		this.addChild(leaf3);
		this.leafs.push(leaf3);

		const branch2 = this.renderSprite(
			Sprite.from('Branch_Right_Complete_Long'),
			30,
			-3200,
			20,
			'Branch 2',
		);

		const leaf4 = new Leaf([branch2]);
		leaf4.position.set(320, -4450);
		leaf4.angle = -90;
		leaf4.label = 'Leaf 04';
		this.addChild(leaf4);
		this.leafs.push(leaf4);

		const leaf5 = new Leaf();
		leaf5.position.set(630, -4450);
		leaf5.angle = -20;
		leaf5.label = 'Leaf 05';
		this.addChild(leaf5);
		this.leafs.push(leaf5);

		const leaf6 = new Leaf();
		leaf6.position.set(850, -5400);
		leaf6.angle = -20;
		leaf6.label = 'Leaf 06';
		this.addChild(leaf6);
		this.leafs.push(leaf6);

		const leaf7 = new Leaf();
		leaf7.position.set(770, -5500);
		leaf7.angle = -110;
		leaf7.label = 'Leaf 07';
		this.addChild(leaf7);
		this.leafs.push(leaf7);

		const leaf8 = new Leaf();
		leaf8.position.set(850, -5520);
		leaf8.angle = -60;
		leaf8.label = 'Leaf 08';
		this.addChild(leaf8);
		this.leafs.push(leaf8);

		const branch3 = this.renderSprite(
			Sprite.from('Branch_Left_Complete_Short'),
			0,
			-3600,
			-35,
			'Branch 3',
		);
		branch3.visible = false;

		const leaf9 = new Leaf([branch3]);
		leaf9.position.set(-550, -4580);
		leaf9.angle = -85;
		leaf9.label = 'Leaf 09';
		this.addChild(leaf9);
		this.leafs.push(leaf9);

		// Leaf on tip of main branch
		const leaf10 = new Leaf();
		leaf10.position.set(-200, -5500);
		leaf10.angle = -120;
		leaf10.label = 'Leaf 10';
		this.addChild(leaf10);
		this.leafs.push(leaf10);

		const leaf11 = new Leaf();
		leaf11.position.set(-630, -4580);
		leaf11.angle = -135;
		leaf11.label = 'Leaf 11';
		this.addChild(leaf11);
		this.leafs.push(leaf11);

		const leaf12 = new Leaf();
		leaf12.position.set(-560, -4450);
		leaf12.angle = -175;
		leaf12.label = 'Leaf 12';
		this.addChild(leaf12);
		this.leafs.push(leaf12);

		const leaf13 = new Leaf();
		leaf13.position.set(-530, -4410);
		leaf13.angle = 115;
		leaf13.label = 'Leaf 13';
		this.addChild(leaf13);
		this.leafs.push(leaf13);

		const branch4 = this.renderSprite(
			Sprite.from('Branch_Left_Complete_Short'),
			0,
			-2300,
			-25,
			'Branch 4',
		);

		const leaf14 = new Leaf([branch4]);
		leaf14.position.set(-430, -3250);
		leaf14.angle = 210;
		leaf14.label = 'Leaf 14';
		this.addChild(leaf14);
		this.leafs.push(leaf14);

		const leaf15 = new Leaf();
		leaf15.position.set(-370, -3365);
		leaf15.angle = -95;
		leaf15.label = 'Leaf 15';
		this.addChild(leaf15);
		this.leafs.push(leaf15);
	}
}
