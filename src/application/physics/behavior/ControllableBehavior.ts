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
import {DumpBehavior} from "./DumpBehavior";

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
        const movementAceleration: number = entity.getHandlerMetadata('ControllableBehavior').get('movement_aceleration') + DumpBehavior.movementFriction;
        const movementMaxSpeed: number = entity.getHandlerMetadata('ControllableBehavior').get('movement_max_speed') + DumpBehavior.movementFriction;
        const rotationAceleration: number = entity.getHandlerMetadata('ControllableBehavior').get('rotation_aceleration') + DumpBehavior.rotationFriction;
        const rotationMaxSpeed: number = entity.getHandlerMetadata('ControllableBehavior').get('rotation_max_speed') + DumpBehavior.rotationFriction;

        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            control.commit();

            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());

            if (control.checkFireStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().getPrimaryWeapon().fire(entity.getAxis().getOrientation());
                }
            }

            if (control.checkCtrlStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().swapWeapons();
                }
            }
        }

        // Multiply vector by acceleration
        finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(movementAceleration);
        finalMoment.multiply(rotationAceleration);

        //Limit max speed
        const leftToMovementLimit: number = movementMaxSpeed - entity.getPosition().getSpeed().getProjectionOnDir(finalVector.getDir()).getDis();
        if (finalVector.getDis() > leftToMovementLimit) {
            finalVector.setDis(Math.max(0, leftToMovementLimit));
        }
        const currentRotation: number = entity.getAxis().getRotation().getDir();
        const appliedRotation: number = currentRotation + finalMoment.getDir();
        if (appliedRotation > 0 && appliedRotation > rotationMaxSpeed) {
            finalMoment.setDir(rotationMaxSpeed - currentRotation);
        } else if (appliedRotation < 0 && (-appliedRotation) > rotationMaxSpeed) {
            finalMoment.setDir(-(rotationMaxSpeed - (-currentRotation)));
        }

        entity.getPosition().addVector(finalVector);
        entity.getAxis().addMoment(finalMoment);
    }
}