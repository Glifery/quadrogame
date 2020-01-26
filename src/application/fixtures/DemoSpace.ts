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

        // return;

        let en1 = new Enemy(1100, 1000, 0);
        let en2 = new Enemy(900, 1000, 0);
        // en1.getPosition().setSpeed(Vector.createFromDirDis(180, 50));
        space.addEntity(en1);
        space.addEntity(en2);

        // return;

        let wall: Wall;
        for (let i: number = 0; i < 10; i++) {
            let x: number = Math.random()*2000;
            let y: number = Math.random()*2000;
            let vector: Vector = Vector.createFromXY(x, y).addVector(Vector.createFromDirDis(Math.random()*360, 200+Math.random()*500));
            let width: number = 30+Math.random()*20;

            wall = new Wall(x, y, vector.getX(), vector.getY(), width);

            space.addEntity(wall);
        }

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

            // enemy.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            space.addEntity(enemy);
        }
    }
    
    getControllablePosition(): Entity {
        return this.controllebleEntity;
    }
}