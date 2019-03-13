import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class ControllableBehavior implements BehaviorInterface {
    private controls: ControlInterface[] = [];

    handle(entity: Entity, simulator: Simulator): void {
        let finalVector = new Vector(0, 0);
        let finalRotation: number = 0;

        for (let control of this.controls) {
            finalRotation += control.getRotationDir();
        }

        entity.getAxis().addOrientation(finalRotation * 5);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(30));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }
}