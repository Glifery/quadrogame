import {container} from "../adapter/framework/di/Inversify.config";
import {Simulator} from "./physics/Simulator";
import {Space} from "./../domain/model/Space";
import {View} from "./graphics/View";
import {Position} from "./../domain/model/Position";
import {NullBehavior} from "./physics/behavior/NullBehavior";
import {ControllableBehavior} from "./physics/behavior/ControllableBehavior";
import {KeyboardControl} from "./physics/control/KeyboardControl";
import {DumpBehavior} from "./physics/behavior/DumpBehavior";
import {GravityBehavior} from "./physics/behavior/GravityBehavior";
import {Vector} from "./../domain/model/Vector";

export class Entry {
    constructor() {
        let space: Space = new Space();

        let view: View = new View(1400, 600, 0, 0);
        view.setSpace(space);

        let simulator: Simulator = new Simulator();

        let nullBehavior: NullBehavior = container.get<NullBehavior>(NullBehavior);
        let dumpBehavior: DumpBehavior = container.get<DumpBehavior>(DumpBehavior);
        let gravityBehavior: GravityBehavior = container.get<GravityBehavior>(GravityBehavior);
        let controlBehavior: ControllableBehavior = container.get<ControllableBehavior>(ControllableBehavior);
        controlBehavior.addControl(new KeyboardControl());

        let obj1: Position = new Position(100, 100, 1);

        obj1.addBehavior(controlBehavior);
        obj1.addBehavior(dumpBehavior);
        obj1.addBehavior(gravityBehavior);

        space.addPosition(obj1);
        simulator.registerObject(obj1);

        let obj: Position;
        let speed: Vector;
        for (let i: number = 0; i < 20; i++) {
            obj = new Position(Math.random()*1400, Math.random()*600, 800+Math.random()*400);

            speed = Vector.createFromDirDis(Math.random()*360, Math.random()*10);
            obj.setSpeed(speed);

            obj.addBehavior(nullBehavior);
            // obj.addBehavior(gravityBehavior);

            space.addPosition(obj);
            simulator.registerObject(obj)
        }

        simulator.startSimulation(25, 4);
        view.startRendering(25);
    }
}

new Entry();