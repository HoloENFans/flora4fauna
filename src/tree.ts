import { Container, Sprite } from 'pixi.js';
import { Donation } from './donationPopup';

const NUM_LEAVES_PER_BRANCH = 15;
const NUM_LEAVES_PER_BUNCH = 5;
const TRUNK_ACTUAL_CENTERLINE = 1160;

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
	let isLeftBranch = true;
	let trunkIndex = 1;
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

		branchContainer.scale.set(0.4);
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
