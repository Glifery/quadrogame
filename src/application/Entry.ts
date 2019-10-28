import "reflect-metadata";
import {container} from "../adapter/framework/di/Inversify.config";
import {Simulator} from "./physics/Simulator";
import {Space} from "./../domain/model/Space";
import {View} from "./graphics/View";
import {DemoSpace} from "./fixtures/DemoSpace";
import {FollowEntity} from "./graphics/projection/FollowEntity";
import {KonvaRendererStrategy} from "./graphics/renderer/KonvaRendererStrategy";
import {SimpleProjectionStrategy} from "./graphics/projection/SimpleProjectionStrategy";

export class Entry {
    constructor() {
        let demoSpace: DemoSpace = container.get<DemoSpace>(DemoSpace);
        let simulator: Simulator = container.get<Simulator>(Simulator);

        let space: Space = new Space();
        simulator.registerSpace(space);

        demoSpace.up(space, simulator);

        let view: View = new View(
            space,
            new KonvaRendererStrategy(800, 600, 0, 0),
            new FollowEntity(demoSpace.getControllablePosition(), 400, 500, 90)
        );

        let osd: View = new View(
            space,
            new KonvaRendererStrategy(800, 600, 1000, 0),
            new SimpleProjectionStrategy()
        );

        simulator.startSimulation(25, 1);
        view.startRendering(25);
        osd.startRendering(25);
    }
}

new Entry();