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

@injectable()
export class DemoSpace implements SpaceFixtureInterface{
    private nullBehavior: NullBehavior;
    private dumpBehavior: DumpBehavior;
    private gravityBehavior: GravityBehavior;
    private controllableBehavior: ControllableBehavior;
    private keyboardControl: KeyboardControl;
    private gamepadControl: GamepadControl;

    private controllebleEntity: Entity;

    constructor(
        @inject(NullBehavior) nullBehavior: NullBehavior,
        @inject(DumpBehavior) dumpBehavior: DumpBehavior,
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(ControllableBehavior) controllableBehavior: ControllableBehavior,
        @inject(KeyboardControl) keyboardControl: KeyboardControl,
        @inject(GamepadControl) gamepadControl: GamepadControl
    ) {
        this.nullBehavior = nullBehavior;
        this.dumpBehavior = dumpBehavior;
        this.gravityBehavior = gravityBehavior;
        this.controllableBehavior = controllableBehavior;
        this.keyboardControl = keyboardControl;
        this.gamepadControl = gamepadControl;

        this.controllableBehavior.addControl(keyboardControl);
        this.controllableBehavior.addControl(gamepadControl);
    }

    up(space: Space): void {
        this.controllebleEntity = new Entity(100, 100, 1, 0);
        this.controllebleEntity.addBehavior(this.controllableBehavior);
        this.controllebleEntity.addBehavior(this.dumpBehavior);
        this.controllebleEntity.addBehavior(this.gravityBehavior);

        space.addEntity(this.controllebleEntity);

        let entity: Entity;
        for (let i: number = 0; i < 20; i++) {
            entity = new Entity(Math.random()*1400, Math.random()*600, 800+Math.random()*400);

            entity.getPosition().setSpeed(Vector.createFromDirDis(Math.random()*360, Math.random()*10));

            entity.addBehavior(this.nullBehavior);

            space.addEntity(entity);
        }
    }
    
    getControllablePosition(): Entity {
        return this.controllebleEntity;
    }
}