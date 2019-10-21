import "reflect-metadata";
import {Container} from "inversify";
import {DemoSpace} from "../../../application/fixtures/DemoSpace";
import {Simulator} from "../../../application/physics/Simulator";
import {ControllableBehavior} from "../../../application/physics/behavior/ControllableBehavior";
import {KeyboardControl} from "../../../application/physics/control/KeyboardControl";
import {GamepadControl} from "../../../application/physics/control/GamepadControl";
import {DumpBehavior} from "../../../application/physics/behavior/DumpBehavior";
import {GravityBehavior} from "../../../application/physics/behavior/GravityBehavior";
import {CollisionBehavior} from "../../../application/physics/behavior/global/CollisionBehavior";
import {ReactionCollisionHandler} from "../../../application/physics/behavior/collision/ReactionCollisionHandler";
import {BulletCollisionHandler} from "../../../application/physics/behavior/collision/BulletCollisionHandler";
import {LegacyCollisionBehavior} from "../../../application/physics/behavior/global/LegacyCollisionBehavior";
import {LifetimeBehavior} from "../../../application/physics/behavior/LifetimeBehavior";
import {ExplodeOnLifetimeBehavior} from "../../../application/physics/behavior/ExplodeOnLifetimeBehavior";
import {ExplosionBehavior} from "../../../application/physics/behavior/ExplosionBehavior";
import {NullBehavior} from "../../../application/physics/behavior/NullBehavior";
import {TestBehavior} from "../../../application/physics/behavior/TestBehavior";

const container = new Container();

container.bind<DemoSpace>(DemoSpace).toSelf();
container.bind<Simulator>(Simulator).toSelf();

container.bind<ControllableBehavior>(ControllableBehavior).toSelf();
container.bind<KeyboardControl>(KeyboardControl).toSelf();
container.bind<GamepadControl>(GamepadControl).toSelf();
container.bind<DumpBehavior>(DumpBehavior).toSelf();
container.bind<GravityBehavior>(GravityBehavior).toSelf();
container.bind<CollisionBehavior>(CollisionBehavior).toSelf();
container.bind<ReactionCollisionHandler>(ReactionCollisionHandler).toSelf();
container.bind<BulletCollisionHandler>(BulletCollisionHandler).toSelf();
container.bind<LegacyCollisionBehavior>(LegacyCollisionBehavior).toSelf();
container.bind<LifetimeBehavior>(LifetimeBehavior).toSelf();
container.bind<ExplodeOnLifetimeBehavior>(ExplodeOnLifetimeBehavior).toSelf();
container.bind<ExplosionBehavior>(ExplosionBehavior).toSelf();
container.bind<NullBehavior>(NullBehavior).toSelf();
container.bind<TestBehavior>(TestBehavior).toSelf();

export {container}