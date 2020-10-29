import { Input, Math } from 'phaser';
import { getGameWidth, getGameHeight, getGameDimensions } from '../helpers';
import { Entity } from '../model/entity';
import { Asteroid } from '../model/asteroid';
import { Ship } from '../model/ship';
import { buildArray } from '../util/arrays';
import { Vector2 } from '../model/types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

const ASTEROID_COUNT = 2;

const PLAY_AREA_PX = 500;


export class GameScene extends Phaser.Scene {
  private boundary: Phaser.GameObjects.Rectangle;
  private ship: Ship;
  private asteroids: readonly Asteroid[];

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const center = getGameDimensions(this).divide(new Vector2(2, 2));

    this.boundary = this.add.rectangle(
      center.x, center.y, PLAY_AREA_PX, PLAY_AREA_PX, 0);

    this.ship = new Ship().create(this, center);

    this.asteroids = this.buildAsteroids();
  }

  public update(time: number, delta: number): void {
    this.getAllEntities().forEach(e => {
      const bounds = this.boundary.getBounds();

      e.update(time, delta)
       .clampTo(bounds);
    });
  }

  private getAllEntities(): readonly Entity[] {
    return [this.ship, ...this.asteroids];
  }

  private buildAsteroids(): readonly Asteroid[] {
    return buildArray(ASTEROID_COUNT, () => {
      const v = new Vector2(0, 0);
      Math.RandomXY(v, PLAY_AREA_PX);

      const asteroid = new Asteroid().create(this, v);

      return asteroid;
    });
  }
}
