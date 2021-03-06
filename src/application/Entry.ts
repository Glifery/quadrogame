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
            new KonvaRendererStrategy(1600, 900, 10, 0),
            new FollowEntity(demoSpace.getControllablePosition(), 800, 750, 90)
        );

        // let osd: EntityRelatedOsd = new EntityRelatedOsd(
        //     demoSpace.getControllablePosition(),
        //     300, 100, 10, 0
        // );

        simulator.startSimulation(25, 1);
        view.startRendering(25);
        // osd.startRendering(10);
    }
}

new Entry();