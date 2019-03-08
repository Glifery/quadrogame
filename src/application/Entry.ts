import "reflect-metadata";
import {container} from "../adapter/framework/di/Inversify.config";
import {Simulator} from "./physics/Simulator";
import {Space} from "./../domain/model/Space";
import {View} from "./graphics/View";
import {DemoSpace} from "./fixtures/DemoSpace";
import {SimpleProjectionStrategy} from "./graphics/projection/SimpleProjectionStrategy";
import {SimpleRendererStrategy} from "./graphics/renderer/SimpleRendererStrategy";

export class Entry {
    constructor() {
        let space: Space = new Space();

        let simulator: Simulator = container.get<Simulator>(Simulator);
        simulator.registerSpace(space);

        let view: View = new View(1400, 600, 10, 30);
        view.setProjectionStrategy(new SimpleProjectionStrategy());
        view.setRendererStrategy(new SimpleRendererStrategy());
        view.setSpace(space);

        let demoSpace: DemoSpace = container.get<DemoSpace>(DemoSpace);
        demoSpace.up(space);

        simulator.startSimulation(25, 4);
        view.startRendering(25);
    }
}

new Entry();