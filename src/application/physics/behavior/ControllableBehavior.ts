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
    private lastFireTime: number = new Date().getTime();

    handle(entity: Entity, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());

            if (control.checkFireStatus() === true) {
                this.fire(entity);
            }
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(30));
        entity.getAxis().addMoment(finalMoment.multiply(10));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }

    private fire(entity): void {
        let currentTime: number = new Date().getTime();

        if ((this.lastFireTime != null) && (currentTime - this.lastFireTime) < 300) {
            return;
        }

        this.lastFireTime = currentTime;

        let bullet: Entity = new Entity(entity.getPosition().getX(), entity.getPosition().getY(), 1, entity.getAxis().getOrientation());

        bullet.getPosition().setSpeed(Vector.createFromDirDis(entity.getAxis().getOrientation(), 100));
        entity.getSpace().addEntity(bullet);
    }
}