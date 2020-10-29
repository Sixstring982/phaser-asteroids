import { Sprite } from "./types";
import { Entity } from "./entity";
import { Vector2 } from "./types";
import { Scene, Math } from "phaser";

const MAX_ASTEROID_VELOCITY = 30;

export class Asteroid extends Entity {
    private rotationDelta = 0;

    /* override */
    create(scene: Scene, position: Vector2): Asteroid {
        super.create(scene, position, 'asteroid');

        this.rotationDelta = Math.RND.realInRange(-.05, .05);

        const velocity = new Vector2();
        Math.RandomXY(velocity, MAX_ASTEROID_VELOCITY);

        this.sprite.setVelocity(velocity.x, velocity.y);

        return this;
    }

    /* override */
    update(time: number, delta: number): Entity {
        this.sprite.rotation += this.rotationDelta;

        return this;
    }
}