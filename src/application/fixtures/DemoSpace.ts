import {inject, injectable} from "inversify";
import {Space} from "../../domain/model/Space";
import {Vector} from "../../domain/model/Vector";
import {SpaceFixtureInterface} from "./SpaceFixtureInterface";
import {Entity} from "../../domain/model/Entity";
import {Hero} from "../../domain/entity/Hero";
import {Roamer} from "../../domain/entity/Roamer";
import {Enemy} from "../../domain/entity/Enemy";
import {Simulator} from "../physics/Simulator";
import {Wall} from "../../domain/entity/Wall";

@injectable()
export class DemoSpace implements SpaceFixtureInterface{
    private controllebleEntity: Entity;

    up(space: Space, simulator: Simulator): void {
        this.controllebleEntity = new Hero(1000, 1000, 0);
        space.addEntity(this.controllebleEntity);

        this.controllebleEntity.getPosition().setSpeed(Vector.createFromDirDis(0, 50));
        // return;

        let en1 = new Enemy(1100, 1000, 0);
        let en2 = new Enemy(900, 1000, 0);
        // en1.getPosition().setSpeed(Vector.createFromDirDis(180, 50));
        space.addEntity(en1);
        space.addEntity(en2);

        // return;

        let wall1 = new Wall(1200, 1000, 1400, 1030, 50);
        space.addEntity(wall1);

        let roamer: Roamer;
        for (let i: number = 0; i < 20; i++) {
            roamer = new Roamer(Math.random()*2000, Math.random()*2000, 0);

            roamer.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            space.addEntity(roamer);
        }

        let enemy: Enemy;
        for (let i: number = 0; i < 20; i++) {
            enemy = new Enemy(Math.random()*2000, Math.random()*2000, 0);
            // enemy = new Enemy(Math.random()*2000, Math.random()*2000, 10);

            enemy.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            space.addEntity(enemy);
        }
    }
    
    getControllablePosition(): Entity {
        return this.controllebleEntity;
    }
}