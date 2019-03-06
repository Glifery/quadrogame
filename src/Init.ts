import {Simulator} from "./physics/Simulator";
import {Space} from "./model/Space";
import {View} from "./graphics/View";
import {Position} from "./model/Position";
import {NullBehavior} from "./physics/behavior/NullBehavior";
import {ControllableBehavior} from "./physics/behavior/ControllableBehavior";
import {KeyboardControl} from "./physics/control/KeyboardControl";

export class Init {
    constructor() {
        let obj1: Position = new Position(100, 100, 10);
        let obj2: Position = new Position(600, 200, 100);
        let obj3: Position = new Position(300, 500, 1000);

        let space: Space = new Space();
        space
            .addPosition(obj1)
            .addPosition(obj2)
            .addPosition(obj3)
        ;

        let view: View = new View(800, 600, 0, 0);
        view.setSpace(space);

        let nullBehavior: NullBehavior = new NullBehavior();
        let controlBehavior: ControllableBehavior = new ControllableBehavior();
        controlBehavior
            .addControl(new KeyboardControl());

        obj1.addBehavior(controlBehavior);
        // obj1.addBehavior(nullBehavior);
        obj2.addBehavior(nullBehavior);
        obj3.addBehavior(nullBehavior);

        let simulator: Simulator = new Simulator();
        simulator
            .registerObject(obj1)
            .registerObject(obj2)
            .registerObject(obj3)
        ;

        simulator.startSimulation(25, 4);
        view.startRendering(25);
    }
}

new Init();