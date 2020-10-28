import { Input, Math } from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

const RADIANS_PER_DELTA = 0.005;
const VELOCITY_PER_DELTA = 0.1;
const ASTEROID_COUNT = 2;

const TIME_TO_RESPAWN_MS = 3000;

const PLAY_AREA_PX = 500;

type Vector2 = Phaser.Math.Vector2;
const Vector2 = Phaser.Math.Vector2;

type Sprite = Phaser.Physics.Arcade.Sprite;
const Sprite = Phaser.Physics.Arcade.Sprite;

export class GameScene extends Phaser.Scene {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  private angleRadians = 0;
  private velocity = Vector2.ZERO;
  private ship: Sprite;
  private asteroids: readonly Sprite[];

  private shipDeathTime?: number;

  private boundary: Phaser.GameObjects.Rectangle;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    const center = {
      x: getGameWidth(this) / 2.0,
      y: getGameHeight(this) / 2.0,
    };

    this.boundary = this.add.rectangle(
      center.x, center.y, PLAY_AREA_PX, PLAY_AREA_PX, 0);

    this.asteroids = this.buildAsteroids();

    this.ship = this.physics.add.sprite(center.x, center.y, 'ship');
  }

  public update(time, delta): void {
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

    // Rotate asteroids
    this.asteroids.forEach(a => {
      a.rotation += 0.02;
    });

    // Ship/asteroid collisions
    this.asteroids.forEach(a => {
      const r = new Phaser.Geom.Rectangle();
      Phaser.Geom.Rectangle.Intersection(
        a.getBounds(), this.ship.getBounds(), r);

      if (r.width > 0 && r.height > 0) {
        console.log(r);
        this.killShip();
      }
    });

    this.clampSprite(this.ship);
    this.asteroids.forEach(a => this.clampSprite(a));

    this.ship.setVelocity(this.velocity.x, this.velocity.y);
    this.ship.setRotation(this.angleRadians);
  }

  private clampSprite(sprite: Sprite) {
    const bounds = this.boundary.getBounds();
    // Right edge
    if (sprite.x > bounds.x + bounds.width) {
      sprite.x -= bounds.width;
    } else if (sprite.x < bounds.x) {
      // Left edge
      sprite.x += bounds.width;
    }

    // Upper edge
    if (sprite.y > bounds.y + bounds.height) {
      sprite.y -= bounds.height;
    } else if (sprite.y < bounds.y) {
      sprite.y += bounds.height;
    }
  }

  private buildAsteroids(): readonly Sprite[] {
    const sprites = [];

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const v = this.randVecInField();
      const asteroid = this.physics.add.sprite(v.x, v.y, 'asteroid');

      const vel = new Vector2();
      Math.RandomXY(vel);
      vel.scale(10);
      asteroid.setVelocity(vel.x, vel.y);

      sprites.push(asteroid);
    }

    return sprites;
  }

  private randVecInField(): Vector2 {
    const v = new Vector2();

    Math.RandomXY(v);

    v.x *= PLAY_AREA_PX;
    v.y *= PLAY_AREA_PX;

    return v;
  }

  private killShip(): void {
    this.ship.setVisible(false);

    setTimeout(() => {
      const center = {
        x: getGameWidth(this) / 2.0,
        y: getGameHeight(this) / 2.0,
      };

      this.ship.setPosition(center.x, center.y);
      this.ship.setVisible(true);
    }, TIME_TO_RESPAWN_MS);
  }
}
