import { Container, Sprite } from 'pixi.js';
import { Donation } from './donationPopup';

const NUM_LEAVES_PER_BRANCH = 15;
const NUM_LEAVES_PER_BUNCH = 5;
const TRUNK_ACTUAL_CENTERLINE = 1160;

interface PointAngle {
	x: number,
	y: number,
	angle: number
};

// X and Y are defined from the BOTTOM MIDDLE OF THE BRANCH
// IE: anchor is equal to x=0.5 and y=1.0
const SMALL_LEFT_SUBBRANCH_LEAF_POS: PointAngle[] = [
	{ x: 47.5, y: -660, angle: 325},
	{ x: 47.5, y: -660, angle: 35},
	{ x: 47.5, y: 0, angle: 350},
]
const SMALL_RIGHT_SUBBRANCH_LEAF_POS: PointAngle[] = [
	{ x: -44.5, y: -900, angle: 325},
	{ x: -44.5, y: -900, angle: 35},
	{ x: -44.5, y: 0, angle: 350},
]
const LARGE_LEFT_SUBBRANCH_LEAF_POS: PointAngle[] = [
	{ x: 7.5, y: -1840, angle: 325 },
	{ x: 7.5, y: -1562, angle: 35 },
	{ x: 7.5, y: -1000, angle: 325 },
	{ x: 7.5, y: -482, angle: 35 },
	{ x: 7.5, y: -754, angle: 325 },
	{ x: 7.5, y: -1297, angle: 35 },
	{ x: 7.5, y: -1384, angle: 325 },
	{ x: 7.5, y: -212, angle: 350 },
]
const LARGE_RIGHT_SUBBRANCH_LEAF_POS: PointAngle[] = [
	{ x: -9.5, y: -870, angle: 35 },
	{ x: -9.5, y: -1787, angle: 325 },
	{ x: -9.5, y: -1235, angle: 35 },
	{ x: -9.5, y: -1140, angle: 325 },
	{ x: -9.5, y: -2222, angle: 35 },
	{ x: -9.5, y: -1540, angle: 325 },
	{ x: -9.5, y: -570, angle: 35 },
	{ x: -9.5, y: -2525, angle: 350 },
]

// https://stackoverflow.com/a/7228322
function randomNumberFromInterval(min: number, max: number): number { // min and max included 
	return Math.random() * (max - min + 1) + min;
}

function positionAndInsertSprite(container: Container, sprite: Sprite, anchorX: number, anchorY: number, x: number, y: number,): void {
	sprite.anchor.set(anchorX, anchorY);
	sprite.position.set(x, y);
	sprite.cullable = true;
	container.addChild(sprite);
}

export function buildTreeSpriteGraph(
	treeBottomX: number,
	treeBottomY: number,
	donations: Donation[]
): Container {
	const treeContainer = new Container();

	// Build the base of the tree
	const treeBase = Sprite.from('Trunk_Base');
	treeBase.cullable = true;
	positionAndInsertSprite(treeContainer, treeBase, 0.5, 1.0, treeBottomX, treeBottomY);
	positionAndInsertSprite(treeContainer, Sprite.from('Grass_Front'), 0.5, 1.0, treeBottomX, treeBottomY);
	positionAndInsertSprite(treeContainer, Sprite.from('Fauna_Nemu'), 0.5, 1.0, treeBottomX, treeBottomY);

	// Build trunks
	const numTrunks = Math.ceil(donations.length / (NUM_LEAVES_PER_BRANCH * 2)) + 1;
	const trunkTextureFunc = (currentTrunkCount: number) => currentTrunkCount % 2 == 0 ? 'Trunk_Mid_01_CroppedY' : 'Trunk_Mid_02_CroppedY';
	const trunkSprites: Sprite[] = new Array<Sprite>();
	let trunkTopY = treeBottomY - treeBase.height;
	for(let trunkNum = 0; trunkNum < numTrunks; trunkNum++) {
		const trunkSprite = Sprite.from(trunkTextureFunc(trunkNum));
		positionAndInsertSprite(treeContainer, trunkSprite, 0.5, 1.0, treeBottomX, trunkTopY);
		trunkTopY -= trunkSprite.height;
		trunkSprites.push(trunkSprite);
	}
	positionAndInsertSprite(treeContainer, Sprite.from('Trunk_Top_01_CroppedY'), 0.5, 1.0, treeBottomX, trunkTopY);

	// Build branches
	const branchScale = 0.4;
	let isLeftBranch = true;
	let trunkIndex = 1;
	// The tree in the texture is not in the actual center of the texture, so we need to calcualte the actual center of the tree trunk.
	const actualTrunkCenter = treeBottomX + (treeBase.width * ((TRUNK_ACTUAL_CENTERLINE / treeBase.width) - 0.5));
	for(let donationsLeft = donations.length; donationsLeft > 0; donationsLeft -= NUM_LEAVES_PER_BRANCH) {
		const branchContainer = new Container();
		const branchTextureSelector = () => Math.random() < 0.5 ? "01" : "02";
		const branchRoot = Sprite.from("Branch_Root");
		const branchSection1 = Sprite.from(`Branch_Big_${branchTextureSelector()}`);
		const branchJoin1 = Sprite.from('Branch_Joint_01');
		const branchSection2 = Sprite.from(`Branch_Med_${branchTextureSelector()}`);
		const branchJoin2 = Sprite.from('Branch_Joint_02');
		const branchSection3 = Sprite.from(`Branch_Small_${branchTextureSelector()}`);
		const branchEnd = Sprite.from('Branch_End');

		const maxNumBunches = Math.ceil(NUM_LEAVES_PER_BRANCH / NUM_LEAVES_PER_BUNCH);
		const numBunches = donationsLeft < NUM_LEAVES_PER_BRANCH ? Math.ceil(donationsLeft / NUM_LEAVES_PER_BUNCH) : maxNumBunches;  
		let branchY = 0;
		positionAndInsertSprite(branchContainer, branchRoot, 0.5, 1.0, 0, branchY);
		branchY -= branchRoot.height;
		positionAndInsertSprite(branchContainer, branchSection1, 0.5, 1.0, 0, branchY);
		branchY -= branchSection1.height;
		positionAndInsertSprite(branchContainer, branchJoin1, 0.5, 1.0, 0, branchY);
		branchY -= branchJoin1.height;
		if(numBunches > (maxNumBunches / 3)) {
			positionAndInsertSprite(branchContainer, branchSection2, 0.5, 1.0, 0, branchY);
			branchY -= branchSection2.height;
		}
		positionAndInsertSprite(branchContainer, branchJoin2, 0.5, 1.0, 0, branchY);
		branchY -= branchJoin2.height;
		if(numBunches > (maxNumBunches / 3) * 2) {
			positionAndInsertSprite(branchContainer, branchSection3, 0.5, 1.0, 0, branchY);
			branchY -= branchSection3.height;
		}
		positionAndInsertSprite(branchContainer, branchEnd, 0.5, 1.0, 0, branchY);

		// Build sub branch
		const branchMiddleX = branchRoot.x + (branchRoot.width * branchScale) / 2;
		const branchTop = branchY * 0.9;
		const branchBottom = branchY * 0.35;
		const subBranchYInterval = (branchTop - branchBottom) / numBunches;
		let subBranchLeft = true;
		
		for(let idxBunch = 0; idxBunch < numBunches; idxBunch++) {
			const subBranchY = branchBottom + (subBranchYInterval * idxBunch) + randomNumberFromInterval(-50, 50);
			const subBranchContainer = new Container();
			let subBranchPositions;
			let subBranchSprite;
			if(subBranchLeft && NUM_LEAVES_PER_BUNCH <= 3) {
				subBranchSprite = Sprite.from("Branch_Left_Complete_Short");
				subBranchPositions = SMALL_LEFT_SUBBRANCH_LEAF_POS;
			}
			else if(subBranchLeft && NUM_LEAVES_PER_BUNCH > 3 && NUM_LEAVES_PER_BUNCH <= 8) {
				subBranchSprite = Sprite.from("Branch_Left_Complete_Long");
				subBranchPositions = LARGE_LEFT_SUBBRANCH_LEAF_POS;
			}
			else if(!subBranchLeft && NUM_LEAVES_PER_BUNCH <= 3) {
				subBranchSprite = Sprite.from("Branch_Right_Complete_Short");
				subBranchPositions = SMALL_RIGHT_SUBBRANCH_LEAF_POS;
			}
			else if(!subBranchLeft && NUM_LEAVES_PER_BUNCH > 3 && NUM_LEAVES_PER_BUNCH <= 8) {
				subBranchSprite = Sprite.from("Branch_Right_Complete_Long");
				subBranchPositions = LARGE_RIGHT_SUBBRANCH_LEAF_POS;
			}
			else {
				throw new Error(`Can't find a branch for ${NUM_LEAVES_PER_BUNCH} leafs.`);
			}
			positionAndInsertSprite(subBranchContainer, subBranchSprite, 0.5, 1.0, 0, 0);

			// Place leafs
			for(let leafIdx = 0; leafIdx < NUM_LEAVES_PER_BUNCH; leafIdx++) {
				const leafSprite = Sprite.from("Branch_Cluster_01_Cropped");
				const leafPos = subBranchPositions[leafIdx];
				leafSprite.anchor.set(0.5, 1.0);
				leafSprite.scale.set(0.5);
				leafSprite.angle = leafPos.angle;
				positionAndInsertSprite(subBranchContainer, leafSprite, 0.5, 1.0, leafPos.x, leafPos.y);
			}
			
			if(subBranchLeft) {
				subBranchContainer.angle = 285;
			}
			else {
				subBranchContainer.angle = 75;
			}

			subBranchLeft = !subBranchLeft;
			subBranchContainer.zIndex = -2;
			branchContainer.addChild(subBranchContainer);
			subBranchContainer.position.set(branchMiddleX, subBranchY);
		}

		branchContainer.scale.set(branchScale);
		branchContainer.position.set(actualTrunkCenter, trunkSprites[trunkIndex].position.y - trunkSprites[trunkIndex].height / 2);
		branchContainer.zIndex = -1;
		if(isLeftBranch) {
			branchContainer.angle = 280 + randomNumberFromInterval(-5, 5);
			isLeftBranch = false;
		}
		else {
			branchContainer.angle = 80 + randomNumberFromInterval(-5, 5);
			isLeftBranch = true;
			trunkIndex++;
		}

		treeContainer.addChild(branchContainer);
	}

	return treeContainer;
}
