import { Entity } from './entity';
import { Vector2, Sprite, CursorKeys } from './types';

const RADIANS_PER_DELTA = 0.005;
const VELOCITY_PER_DELTA = 0.3;
const BRAKE_MULTIPLIER = 0.95;

export class Ship extends Entity {
    private cursorKeys: CursorKeys;

    private angleRadians = 0;
    private velocity = Vector2.ZERO;

    /* override */
    create(scene: Phaser.Scene, position: Vector2): Ship {
        super.create(scene, position, 'ship');

        this.cursorKeys = scene.input.keyboard.createCursorKeys();

        return this;
    }

    /* override */
    update(time: number, delta: number): Entity {
        if (this.cursorKeys.left.isDown) {
            this.angleRadians -= delta * RADIANS_PER_DELTA;
        }
        if (this.cursorKeys.right.isDown) {
            this.angleRadians += delta * RADIANS_PER_DELTA;
        }
        if (this.cursorKeys.up.isDown) {
            this.velocity.add(
                new Vector2(delta * VELOCITY_PER_DELTA, 0)
                    .rotate(this.angleRadians));
        }
        if (this.cursorKeys.down.isDown) {
            this.velocity.subtract(
                new Vector2(delta * VELOCITY_PER_DELTA, 0)
                    .rotate(this.angleRadians));
        }
        // Hit the brakes
        if (this.cursorKeys.space.isDown) {
            this.velocity.x *= BRAKE_MULTIPLIER;
            this.velocity.y *= BRAKE_MULTIPLIER;
        }

        this.sprite.setVelocity(this.velocity.x, this.velocity.y);
        this.sprite.setRotation(this.angleRadians);

        return this;
    }
}