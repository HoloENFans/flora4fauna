import { Container, Sprite } from 'pixi.js';
import { Donation } from './donationPopup';
import Branch01 from './branches/Branch01.ts';
import Branch from './branches/Branch.ts';
import Database from './database.ts';
import { RxChangeEventInsert } from 'rxdb';
import { getRandomNumber } from './random.ts';
import Branch02 from './branches/Branch02.ts';

const TRUNK_ACTUAL_CENTERLINE = 1160;

function positionAndInsertSprite(
	container: Container,
	sprite: Sprite,
	anchorX: number,
	anchorY: number,
	x: number,
	y: number,
): Sprite {
	sprite.anchor.set(anchorX, anchorY);
	sprite.position.set(x, y);
	sprite.cullable = true;
	container.addChild(sprite);
	return sprite;
}

const BRANCH_OPTIONS: (new () => Branch)[] = [Branch01, Branch02];

export async function buildTreeSpriteGraph(
	treeBottomX: number,
	treeBottomY: number,
) {
	const treeContainer = new Container();

	// Build the base of the tree
	const treeBase = Sprite.from('Trunk_Flat_Base');
	positionAndInsertSprite(
		treeContainer,
		treeBase,
		0.5,
		1.0,
		treeBottomX - 75,
		treeBottomY,
	);
	positionAndInsertSprite(
		treeContainer,
		Sprite.from('Grass_Front'),
		0.5,
		1.0,
		treeBottomX,
		treeBottomY,
	);
	const faunaNemu = positionAndInsertSprite(
		treeContainer,
		Sprite.from('Fauna_Nemu'),
		0.5,
		1.0,
		treeBottomX,
		treeBottomY,
	);
	faunaNemu.zIndex = 2;

	const trunkTextureFunc = (currentTrunkCount: number) =>
		currentTrunkCount % 2 == 0 ? 'Trunk_Flat_Mid_01' : 'Trunk_Flat_Mid_02';
	const trunkSprites: Sprite[] = new Array<Sprite>();
	let trunkTopY = treeBottomY - treeBase.height;
	for (let trunkNum = 0; trunkNum < 2; trunkNum++) {
		const trunkSprite = Sprite.from(trunkTextureFunc(trunkNum));
		positionAndInsertSprite(
			treeContainer,
			trunkSprite,
			0.5,
			1.0,
			treeBottomX,
			trunkTopY,
		);
		trunkTopY -= trunkSprite.height;
		trunkSprites.push(trunkSprite);
	}

	const treeTop = positionAndInsertSprite(
		treeContainer,
		Sprite.from('Trunk_Flat_Top_01'),
		0.5,
		1.0,
		treeBottomX,
		trunkTopY,
	);

	const db = await Database();

	const donations = (await db.donations.find().exec()) as Donation[];

	const donoDummyList: Donation[] = [];
	for (let i = 0; i < 80; i++) {
		const dummyDono: Donation = {
			username: 'test' + i,
			message: 'message' + i,
			amount: 321.0,
			created: '2024-12-26T22:46:33Z',
			updated: '2024-12-26T22:46:33Z',
		};
		donoDummyList.push(dummyDono);
	}

	// Build branches
	let isLeftBranch = true;
	let currentBranch: Branch | undefined;
	let trunkIndex = 1;
	// The tree in the texture is not in the actual center of the texture, so we need to calculate the actual center of the tree trunk.
	const actualTrunkCenter =
		treeBottomX +
		treeBase.width * (TRUNK_ACTUAL_CENTERLINE / treeBase.width - 0.5);

	function addDonation(donation: Donation) {
		if (!currentBranch || currentBranch.full) {
			currentBranch = new BRANCH_OPTIONS[
				Math.floor(Math.random() * BRANCH_OPTIONS.length)
			]();

			if (trunkIndex >= trunkSprites.length) {
				const trunkSprite = Sprite.from(trunkTextureFunc(trunkIndex));
				positionAndInsertSprite(
					treeContainer,
					trunkSprite,
					0.5,
					1.0,
					treeBottomX,
					trunkTopY,
				);
				trunkTopY -= trunkSprite.height;
				trunkSprites.push(trunkSprite);
				treeTop.y = trunkTopY;
			}

			currentBranch.position.set(
				actualTrunkCenter,
				trunkSprites[trunkIndex].position.y -
					trunkSprites[trunkIndex].height / 2 +
					getRandomNumber(-100, 100),
			);

			if (isLeftBranch) {
				currentBranch.angle = 280 + getRandomNumber(-5, 5);
				isLeftBranch = false;
			} else {
				currentBranch.angle = 80 + getRandomNumber(-5, 5);
				isLeftBranch = true;
				trunkIndex++;
			}
			treeContainer.addChild(currentBranch);
		}

		currentBranch.addDonation(donation);
	}

	for (const donation of donoDummyList) {
		addDonation(donation);
	}

	db.donations.insert$.subscribe((event: RxChangeEventInsert<Donation>) => {
		addDonation(event.documentData);
	});

	return treeContainer;
}
