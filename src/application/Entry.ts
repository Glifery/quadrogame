import "reflect-metadata";
import {container} from "../adapter/framework/di/Inversify.config";
import {Simulator} from "./physics/Simulator";
import {Space} from "./../domain/model/Space";
import {View} from "./graphics/View";
import {DemoSpace} from "./fixtures/DemoSpace";
import {SimpleRendererStrategy} from "./graphics/renderer/SimpleRendererStrategy";
import {FollowEntity} from "./graphics/projection/FollowEntity";

export class Entry {
    constructor() {
        let space: Space = new Space();

        let demoSpace: DemoSpace = container.get<DemoSpace>(DemoSpace);
        let simulator: Simulator = container.get<Simulator>(Simulator);

        demoSpace.up(space, simulator);

        let view: View = new View(1900, 600, 10, 30);
        view.setProjectionStrategy(new FollowEntity(demoSpace.getControllablePosition(), 950, 300, 90));
        view.setRendererStrategy(new SimpleRendererStrategy());
        view.setSpace(space);

        simulator.registerSpace(space);

        simulator.startSimulation(25, 1);
        view.startRendering(25);
    }
}

new Entry();