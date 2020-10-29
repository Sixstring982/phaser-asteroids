import { Scene } from 'phaser';
import { Sprite, Vector2 } from './types';

export abstract class Entity {
    protected sprite: Sprite;

    protected create(scene: Scene, position: Vector2, asset: string): void {
        this.sprite = scene.physics.add.sprite(position.x, position.y, asset);
    }

    update(time: number, delta: number): Entity { 
        return this;
    }

    clampTo(bounds: Phaser.Geom.Rectangle): Entity {
        if (this.sprite.x > bounds.x + bounds.width) {
            // Right edge
            this.sprite.x -= bounds.width;
        } else if (this.sprite.x < bounds.x) {
            // Left edge
            this.sprite.x += bounds.width;
        }
        if (this.sprite.y > bounds.y + bounds.height) {
            // Upper edge
            this.sprite.y -= bounds.height;
        } else if (this.sprite.y < bounds.y) {
            // Lower edge
            this.sprite.y += bounds.height;
        }

        return this;
    }
}