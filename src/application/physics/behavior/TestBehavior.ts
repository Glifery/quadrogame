import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class TestBehavior implements BehaviorInterface {
    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        entity.getPosition().addVector(Vector.createFromXY(1, 0));
        entity.getAxis().addMoment(new Moment(1));
    }
}