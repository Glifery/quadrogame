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

@injectable()
export class DemoSpace implements SpaceFixtureInterface{
    private nullBehavior: NullBehavior;
    private dumpBehavior: DumpBehavior;
    private gravityBehavior: GravityBehavior;
    private controllableBehavior: ControllableBehavior;

    constructor(
        @inject(NullBehavior) nullBehavior: NullBehavior,
        @inject(DumpBehavior) dumpBehavior: DumpBehavior,
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(ControllableBehavior) controlBehavior: ControllableBehavior
    ) {
        this.nullBehavior = nullBehavior;
        this.dumpBehavior = dumpBehavior;
        this.gravityBehavior = gravityBehavior;
        this.controllableBehavior = controlBehavior;

        this.controllableBehavior.addControl(new KeyboardControl());
    }

    up(space: Space): void {
        let obj1: Position = new Position(100, 100, 1);

        obj1.addBehavior(this.controllableBehavior);
        obj1.addBehavior(this.dumpBehavior);
        obj1.addBehavior(this.gravityBehavior);

        space.addPosition(obj1);

        let obj: Position;
        let speed: Vector;
        for (let i: number = 0; i < 20; i++) {
            obj = new Position(Math.random()*1400, Math.random()*600, 800+Math.random()*400);

            speed = Vector.createFromDirDis(Math.random()*360, Math.random()*10);
            obj.setSpeed(speed);

            obj.addBehavior(this.nullBehavior);
            // obj.addBehavior(gravityBehavior);

            space.addPosition(obj);
        }
    }
}