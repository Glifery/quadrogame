import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class NullBehavior implements BehaviorInterface {
    handle(entity: Entity, simulator: Simulator): void {
        entity.getPosition().addVector(Vector.createFromXY(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ));
    }
}