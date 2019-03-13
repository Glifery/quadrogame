import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class DumpBehavior implements BehaviorInterface {
    handle(entity: Entity, simulator: Simulator): void {
        let vector = Vector.createFromVector(entity.getPosition().getSpeed());

        vector.invert().setDis(Math.min(vector.getDis(), 7));
        entity.getPosition().addVector(vector);
    }
}