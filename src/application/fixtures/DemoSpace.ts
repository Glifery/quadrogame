import {inject, injectable} from "inversify";
import {NullBehavior} from "../physics/behavior/NullBehavior";
import {ControllableBehavior} from "../physics/behavior/ControllableBehavior";
import {DumpBehavior} from "../physics/behavior/DumpBehavior";
import {GravityBehavior} from "../physics/behavior/GravityBehavior";
import {KeyboardControl} from "../physics/control/KeyboardControl";
import {Space} from "../../domain/model/Space";
import {Position} from "../../domain/model/Position";
import {Vector} from "../../domain/model/Vector";
import {SpaceFixtureInterface} from "./SpaceFixtureInterface";
import {ControllablePosition} from "../../domain/model/ControllablePosition";

@injectable()
export class DemoSpace implements SpaceFixtureInterface{
    private nullBehavior: NullBehavior;
    private dumpBehavior: DumpBehavior;
    private gravityBehavior: GravityBehavior;
    private controllableBehavior: ControllableBehavior;
    private keyboardControl: KeyboardControl;

    private controlleblePosition: ControllablePosition;

    constructor(
        @inject(NullBehavior) nullBehavior: NullBehavior,
        @inject(DumpBehavior) dumpBehavior: DumpBehavior,
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(ControllableBehavior) controlBehavior: ControllableBehavior,
        @inject(KeyboardControl) keyboardControl: KeyboardControl
    ) {
        this.nullBehavior = nullBehavior;
        this.dumpBehavior = dumpBehavior;
        this.gravityBehavior = gravityBehavior;
        this.controllableBehavior = controlBehavior;
        this.keyboardControl = keyboardControl;

        this.controllableBehavior.addControl(keyboardControl);
    }

    up(space: Space): void {
        this.controlleblePosition = new ControllablePosition(100, 100, 1);

        this.controlleblePosition.addBehavior(this.controllableBehavior);
        this.controlleblePosition.addBehavior(this.dumpBehavior);
        this.controlleblePosition.addBehavior(this.gravityBehavior);

        space.addPosition(this.controlleblePosition);

        let obj: Position;
        let speed: Vector;
        for (let i: number = 0; i < 20; i++) {
            obj = new Position(Math.random()*1400, Math.random()*600, 800+Math.random()*400);

            speed = Vector.createFromDirDis(Math.random()*360, Math.random()*10);
            obj.setSpeed(speed);

            obj.addBehavior(this.nullBehavior);
            // obj.addBehavior(this.gravityBehavior);

            space.addPosition(obj);
        }
    }
    
    getControllablePosition(): ControllablePosition {
        return this.controlleblePosition;
    }
}