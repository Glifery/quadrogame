import "reflect-metadata";
import {container} from "../adapter/framework/di/Inversify.config";
import {Simulator} from "./physics/Simulator";
import {Space} from "./../domain/model/Space";
import {View} from "./graphics/View";
import {DemoSpace} from "./fixtures/DemoSpace";
import {FollowEntity} from "./graphics/projection/FollowEntity";
import {KonvaRendererStrategy} from "./graphics/renderer/KonvaRendererStrategy";

export class Entry {
    constructor() {
        let demoSpace: DemoSpace = container.get<DemoSpace>(DemoSpace);
        let simulator: Simulator = container.get<Simulator>(Simulator);

        let space: Space = new Space();
        simulator.registerSpace(space);

        demoSpace.up(space, simulator);

        let view: View = new View(
            space,
            new KonvaRendererStrategy(1900, 600, 0, 0),
            new FollowEntity(demoSpace.getControllablePosition(), 950, 300, 90)
        );

        simulator.startSimulation(25, 1);
        view.startRendering(25);
    }
}

new Entry();