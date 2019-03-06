import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Position} from "../../model/Position";
import {Vector} from "../../model/Vector";

export class ControllableBehavior implements BehaviorInterface {
    private controls: ControlInterface[] = [];

    handle(position: Position, simulator: Simulator): void {
        let finalVector = new Vector(0, 0);

        for (let control of this.controls) {
            finalVector.addVector(control.getVector());
        }

        position.addVector(finalVector.multiply(4));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }
}