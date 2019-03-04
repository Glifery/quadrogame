import {Simulator} from "./physics/Simulator";
import {Space} from "./model/Space";
import {View} from "./graphics/View";
import {Position} from "./model/Position";
import {NullBehavior} from "./physics/behavior/NullBehavior";

export class Init {
    constructor() {
        let obj1: Position = new Position(10, 10, 10);
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

        let behavior: NullBehavior = new NullBehavior();
        obj1.addBehavior(behavior);
        obj2.addBehavior(behavior);
        obj3.addBehavior(behavior);

        // let controllManager: ControllManager = new ControllManager();
        // controllManager.initialize(document);
        //
        // let controllableBehavior: ControllableBehavior = new ControllableBehavior(controllManager);
        // obj1.addBehavior(controllableBehavior);
        // setInterval(() => {
        //     controllManager.isCharPressed('S');
        // }, 1000);

        let simulator: Simulator = new Simulator();
        simulator
            .registerObject(obj1)
            .registerObject(obj2)
            .registerObject(obj3)
        ;

        simulator.startSimulation(25, 4);
        view.startRendering(25);

        // new ControllManager();
    }
}

new Init();