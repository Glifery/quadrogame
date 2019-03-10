import "reflect-metadata";
import {Container} from "inversify";
import {DemoSpace} from "../../../application/fixtures/DemoSpace";
import {Simulator} from "../../../application/physics/Simulator";
import {ControllableBehavior} from "../../../application/physics/behavior/ControllableBehavior";
import {KeyboardControl} from "../../../application/physics/control/KeyboardControl";
import {DumpBehavior} from "../../../application/physics/behavior/DumpBehavior";
import {GravityBehavior} from "../../../application/physics/behavior/GravityBehavior";
import {NullBehavior} from "../../../application/physics/behavior/NullBehavior";

const container = new Container();

container.bind<DemoSpace>(DemoSpace).toSelf();
container.bind<Simulator>(Simulator).toSelf();

container.bind<ControllableBehavior>(ControllableBehavior).toSelf();
container.bind<KeyboardControl>(KeyboardControl).toSelf();
container.bind<DumpBehavior>(DumpBehavior).toSelf();
container.bind<GravityBehavior>(GravityBehavior).toSelf();
container.bind<NullBehavior>(NullBehavior).toSelf();

export {container}