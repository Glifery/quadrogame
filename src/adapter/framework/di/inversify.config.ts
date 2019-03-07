import "reflect-metadata";
import { Container } from "inversify";
import {ControllableBehavior} from "../../../physics/behavior/ControllableBehavior";
import {DumpBehavior} from "../../../physics/behavior/DumpBehavior";
import {GravityBehavior} from "../../../physics/behavior/GravityBehavior";
import {NullBehavior} from "../../../physics/behavior/NullBehavior";

const container = new Container();

container.bind<ControllableBehavior>(ControllableBehavior).toSelf();
container.bind<DumpBehavior>(DumpBehavior).toSelf();
container.bind<GravityBehavior>(GravityBehavior).toSelf();
container.bind<NullBehavior>(NullBehavior).toSelf();

export {container}