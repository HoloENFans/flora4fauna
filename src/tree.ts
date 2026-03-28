import { Container, Sprite, Text } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Donation } from './donationPopup';
import Branch01 from './branches/Branch01.ts';
import Branch02 from './branches/Branch02.ts';
import Branch from './branches/Branch.ts';
import Database from './database.ts';
import { RxChangeEventInsert } from 'rxdb';
import { getRandomNumber } from './random.ts';

const TRUNK_ACTUAL_CENTERLINE = 1160;
const TRUNK_INDEX = 1;
const BRANCH_VERTICAL_OFFSET = 600;
const BRANCH_ANGLE_OFFSET = 5;
const BRANCH_RANDOM_RANGE = 1000;
const BRANCH_OPTIONS: (new () => Branch)[] = [Branch01, Branch02];

export async function buildTreeSpriteGraph(
	treeBottomX: number,
	treeBottomY: number,
	viewport: Viewport,
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

	// Build the "Growing in Progress" sign
	const progressSign = createProgressSign(treeBottomX, trunkTopY, treeTop.height);

	treeContainer.addChild(progressSign);

	const db = await Database();
	const initialDocs = (await db.donations.find().exec()) as (Donation & {
		id: string;
	})[];

	// Build branches
	let isLeftBranch = true;
	let currentBranch: Branch | undefined;
	let leftBranchY =
		trunkSprites[TRUNK_INDEX].position.y -
		trunkSprites[TRUNK_INDEX].height / 2 -
		Math.floor(Math.random() * 200);
	let rightBranchY =
		trunkSprites[TRUNK_INDEX].position.y -
		trunkSprites[TRUNK_INDEX].height / 2 -
		Math.floor(Math.random() * 200);
	let currentClampTopLimit = 0;
	// The tree in the texture is not in the actual center of the texture, so we need to calculate the actual center of the tree trunk.
	const actualTrunkCenter =
		treeBottomX +
		treeBase.width * (TRUNK_ACTUAL_CENTERLINE / treeBase.width - 0.5);

	function addDonation(donationId: string, donation: Donation) {
		if (!currentBranch || currentBranch.full) {
			currentBranch = new BRANCH_OPTIONS[
				Math.floor(Math.random() * BRANCH_OPTIONS.length)
			]();
			const bounds = currentBranch.getBounds(true);

			if (Math.min(leftBranchY - 200, rightBranchY - 200) < trunkTopY) {
				const trunkSprite = Sprite.from(trunkTextureFunc(TRUNK_INDEX));
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

				progressSign.position.set(treeBottomX, trunkTopY - (treeTop.height / 2));

				if (trunkTopY < currentClampTopLimit) {
					currentClampTopLimit = trunkTopY - 2000;

					viewport.plugins.remove('clamp');
					viewport.clamp({
						direction: 'all',
						underflow: 'center',
					});
				}
			}

			currentBranch.position.set(
				actualTrunkCenter,
				trunkSprites[TRUNK_INDEX].position.y -
					trunkSprites[TRUNK_INDEX].height / 2 +
					getRandomNumber(-100, 100),
			);

			const verticalOffset = bounds.width + BRANCH_VERTICAL_OFFSET + Math.floor(Math.random() * BRANCH_RANDOM_RANGE);

			if (isLeftBranch) {
				currentBranch.angle = 280 + getRandomNumber(-BRANCH_ANGLE_OFFSET, BRANCH_ANGLE_OFFSET);
				currentBranch.position.set(actualTrunkCenter, leftBranchY);
				leftBranchY -= verticalOffset;
			} else {
				currentBranch.angle = 80 + getRandomNumber(-BRANCH_ANGLE_OFFSET, BRANCH_ANGLE_OFFSET);
				currentBranch.position.set(actualTrunkCenter, rightBranchY);
				rightBranchY -= verticalOffset;
			}

			isLeftBranch = !isLeftBranch;

			treeContainer.addChild(currentBranch);
		}

		const { x, y, tint, brightness } = currentBranch.addDonationToBranch(donation, currentBranch.label, !isLeftBranch);
		void db.leaves.upsert({
			id: donationId,
			x: x,
			y: y,
			tint: tint,
			brightness: brightness,
		});
	}

	for (const doc of initialDocs) {
		addDonation(doc.id, doc as Donation);
	}

	db.donations.insert$.subscribe((event: RxChangeEventInsert<Donation>) => {
		addDonation(event.documentId, event.documentData);
	});

	return treeContainer;
}

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

function createProgressSign(
	treeBottomX: number,
	trunkTopY: number,
	treeTopHeight: number
): Container {
	const progressSign = new Container();
	progressSign.label = '"Growing In Progress" Sign';
	progressSign.angle = 15;
	progressSign.position.set(treeBottomX, trunkTopY - (treeTopHeight / 2));

	const sign = Sprite.from('Wooden_Sign_Postless');
	sign.anchor.set(0.5, 0.5);
	sign.zIndex = -1;
	progressSign.addChild(sign);

	const signText = [
		{ text: 'GROWING\nIN PROGRESS', fontSize: 90, y: -100 },
		{ text: 'MIND THE\nBALDNESS', fontSize: 70, y: 80 },
	];

	signText.forEach(({ text, fontSize, y }) => {
		const signTextSprite = new Text({
			text,
			style: {
				fontFamily: 'UnifontEXMono',
				fontSize,
				fontWeight: 'bold',
				fill: 'white',
				align: 'center',
			},
			x: 0,
			y,
		});
		signTextSprite.anchor.set(0.5);
		signTextSprite.zIndex = 1;
		progressSign.addChild(signTextSprite);
	});

	return progressSign;
}