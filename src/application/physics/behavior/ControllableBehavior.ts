import {inject, injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";
import {Hero} from "../../../domain/entity/Hero";
import {GamepadControl} from "../control/GamepadControl";
import {KeyboardControl} from "../control/KeyboardControl";

@injectable()
export class ControllableBehavior implements BehaviorInterface {
    static getName() {
        return 'controllable';
    }

    static readonly movementAccel = 1200;
    static readonly rotationAccel = 300;

    private controls: ControlInterface[] = [];

    constructor(
        @inject(KeyboardControl) keyboardControl: KeyboardControl,
        @inject(GamepadControl) gamepadControl: GamepadControl,
    ) {
        this.controls.push(keyboardControl);
        this.controls.push(gamepadControl);
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(ControllableBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            control.commit();

            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());

            if (control.checkFireStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().getPrimaryWeapon().fire(entity, multiplier, simulator);
                }
            }

            if (control.checkCtrlStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().swapWeapons();
                }
            }
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(ControllableBehavior.movementAccel));
        entity.getAxis().addMoment(finalMoment.multiply(ControllableBehavior.rotationAccel));
    }
}