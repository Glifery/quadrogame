import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Position} from "../../model/Position";
import {Vector} from "../../model/Vector";

export class NullBehavior implements BehaviorInterface {
    handle(position: Position, simulator: Simulator): void {
        position.addVector(Vector.createFromXY(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ));
    }
}