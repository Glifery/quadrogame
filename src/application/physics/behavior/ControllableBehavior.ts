import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {ControllablePosition} from "../../../domain/model/ControllablePosition";

@injectable()
export class ControllableBehavior implements BehaviorInterface {
    private controls: ControlInterface[] = [];

    handle(position: ControllablePosition, simulator: Simulator): void {
        let finalVector = new Vector(0, 0);
        let finalRotation: number = 0;

        for (let control of this.controls) {
            finalRotation += control.getRotationDir();
        }

        position.addOrientation(finalRotation * 5);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
        }

        position.addVector(finalVector.rotate(position.getOrientation()).multiply(20));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }
}