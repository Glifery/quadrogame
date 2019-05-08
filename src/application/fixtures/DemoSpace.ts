import {inject, injectable} from "inversify";
import {NullBehavior} from "../physics/behavior/NullBehavior";
import {ControllableBehavior} from "../physics/behavior/ControllableBehavior";
import {DumpBehavior} from "../physics/behavior/DumpBehavior";
import {GravityBehavior} from "../physics/behavior/GravityBehavior";
import {KeyboardControl} from "../physics/control/KeyboardControl";
import {Space} from "../../domain/model/Space";
import {Vector} from "../../domain/model/Vector";
import {SpaceFixtureInterface} from "./SpaceFixtureInterface";
import {GamepadControl} from "../physics/control/GamepadControl";
import {Entity} from "../../domain/model/Entity";
import {Hero} from "../../domain/entity/Hero";
import {Roamer} from "../../domain/entity/Roamer";
import {Enemy} from "../../domain/entity/Enemy";
import {CollisionBehavior} from "../physics/behavior/global/CollisionBehavior";
import {TestBehavior} from "../physics/behavior/TestBehavior";
import {Simulator} from "../physics/Simulator";

@injectable()
export class DemoSpace implements SpaceFixtureInterface{
    private nullBehavior: NullBehavior;
    private testBehavior: TestBehavior;
    private dumpBehavior: DumpBehavior;
    private gravityBehavior: GravityBehavior;
    private collisionBehavior: CollisionBehavior;
    private controllableBehavior: ControllableBehavior;
    private keyboardControl: KeyboardControl;
    private gamepadControl: GamepadControl;

    private controllebleEntity: Entity;

    constructor(
        @inject(NullBehavior) nullBehavior: NullBehavior,
        @inject(TestBehavior) testBehavior: TestBehavior,
        @inject(DumpBehavior) dumpBehavior: DumpBehavior,
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(CollisionBehavior) collisionBehavior: CollisionBehavior,
        @inject(ControllableBehavior) controllableBehavior: ControllableBehavior,
        @inject(KeyboardControl) keyboardControl: KeyboardControl,
        @inject(GamepadControl) gamepadControl: GamepadControl
    ) {
        this.nullBehavior = nullBehavior;
        this.testBehavior = testBehavior;
        this.dumpBehavior = dumpBehavior;
        this.gravityBehavior = gravityBehavior;
        this.collisionBehavior = collisionBehavior;
        this.controllableBehavior = controllableBehavior;
        this.keyboardControl = keyboardControl;
        this.gamepadControl = gamepadControl;

        this.controllableBehavior.addControl(keyboardControl);
        this.controllableBehavior.addControl(gamepadControl);
    }

    up(space: Space, simulator: Simulator): void {
        this.controllebleEntity = new Hero(1000, 1000, 10, 0);
        // this.controllebleEntity.addBehavior(this.testBehavior);
        this.controllebleEntity.addBehavior(this.controllableBehavior);
        this.controllebleEntity.addBehavior(this.dumpBehavior);
        this.controllebleEntity.addBehavior(this.gravityBehavior);

        space.addEntity(this.controllebleEntity);
        simulator.registerGlobalBehaviors(this.collisionBehavior);

        this.controllebleEntity.getPosition().setSpeed(Vector.createFromDirDis(0, 50));
        let en1 = new Enemy(1100, 1000, 100);
        let en2 = new Enemy(900, 1000, 10);
        // en1.getPosition().setSpeed(Vector.createFromDirDis(180, 50));
        space.addEntity(en1);
        space.addEntity(en2);

        // return;

        let roamer: Roamer;
        for (let i: number = 0; i < 20; i++) {
            roamer = new Roamer(Math.random()*2000, Math.random()*2000, 800+Math.random()*400);

            roamer.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            roamer.addBehavior(this.nullBehavior);

            space.addEntity(roamer);
        }

        let enemy: Enemy;
        for (let i: number = 0; i < 20; i++) {
            enemy = new Enemy(Math.random()*2000, Math.random()*2000, 800+Math.random()*400);
            // enemy = new Enemy(Math.random()*2000, Math.random()*2000, 10);

            enemy.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            enemy.addBehavior(this.nullBehavior);
            enemy.addBehavior(this.gravityBehavior);

            space.addEntity(enemy);
        }
    }
    
    getControllablePosition(): Entity {
        return this.controllebleEntity;
    }
}