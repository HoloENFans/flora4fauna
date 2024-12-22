import { Container, Sprite } from "pixi.js";

function positionAndInsertSprite(container:Container, sprite:Sprite, anchorX: number, anchorY:number, x: number, y: number): void {
	sprite.anchor.set(anchorX, anchorY);
	sprite.position.set(x, y);
	container.addChild(sprite);
}

export function buildTreeSpriteGraph(treeBottomX: number, treeBottomY: number): Container {
	const treeContainer = new Container();

	// Build the base of the tree
	const treeBase = Sprite.from("Trunk_Base");
	positionAndInsertSprite(treeContainer, treeBase, 0.5, 1.0, treeBottomX, treeBottomY);
	positionAndInsertSprite(treeContainer, Sprite.from("Grass_Front"), 0.5, 1.0, treeBottomX, treeBottomY);
	positionAndInsertSprite(treeContainer, Sprite.from("Fauna_Nemu"), 0.5, 1.0, treeBottomX, treeBottomY);

	// Build trunks
	let nextY = treeBase.position.y - treeBase.height;
	const trunkMid1 = Sprite.from("Trunk_Mid_01_CroppedY");
	const trunkMid2 = Sprite.from("Trunk_Mid_02_CroppedY");
	positionAndInsertSprite(treeContainer, trunkMid1, 0.5, 1.0, treeBottomX, nextY);
	nextY = trunkMid1.position.y - trunkMid1.height;
	positionAndInsertSprite(treeContainer, trunkMid2, 0.5, 1.0, treeBottomX, nextY);
	nextY = trunkMid2.position.y - trunkMid2.height;
	positionAndInsertSprite(treeContainer, Sprite.from("Trunk_Top_01_CroppedY"), 0.5, 1.0, treeBottomX, nextY);

	return treeContainer;
}
