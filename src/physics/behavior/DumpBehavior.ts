import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Position} from "../../model/Position";
import {Vector} from "../../model/Vector";

@injectable()
export class DumpBehavior implements BehaviorInterface {
    handle(position: Position, simulator: Simulator): void {
        let vector = Vector.createFromVector(position.getSpeed());

        vector.revert().setDis(Math.min(vector.getDis(), 7));
        position.addVector(vector);
    }
}