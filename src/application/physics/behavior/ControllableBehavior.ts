import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class ControllableBehavior implements BehaviorInterface {
    private controls: ControlInterface[] = [];

    handle(entity: Entity, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(30));
        entity.getAxis().addMoment(finalMoment.multiply(10));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }
}