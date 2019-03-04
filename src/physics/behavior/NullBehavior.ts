import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Position} from "../../model/Position";
import {Vector} from "../../model/Vector";

export class NullBehavior implements BehaviorInterface {
    handle(object: Position, simulator: Simulator) {
        object.addVector(Vector.createFromXY(1, 1));
    }
}