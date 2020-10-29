import * as Phaser from 'phaser';

type Vector2 = Phaser.Math.Vector2;
const Vector2 = Phaser.Math.Vector2;

export const getGameWidth = (scene: Phaser.Scene): number => {
  return scene.game.scale.width;
};

export const getGameHeight = (scene: Phaser.Scene): number => {
  return scene.game.scale.height;
};

export const getGameDimensions = (scene: Phaser.Scene): Vector2 => 
  new Vector2(getGameWidth(scene), getGameHeight(scene));
