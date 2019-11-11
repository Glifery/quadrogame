import {inject, injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";
import {GravityBehavior} from "./GravityBehavior";
import {ExplodeOnLifetimeBehavior} from "./ExplodeOnLifetimeBehavior";
import {LifetimeBehavior} from "./LifetimeBehavior";
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

    private gravityBehavior: GravityBehavior;
    private lifetimeBehavior: LifetimeBehavior;
    private explodeOnLifetimeBehavior: ExplodeOnLifetimeBehavior;

    private controls: ControlInterface[] = [];
    private lastFireTime: number = new Date().getTime();

    constructor(
        @inject(KeyboardControl) keyboardControl: KeyboardControl,
        @inject(GamepadControl) gamepadControl: GamepadControl,

        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(LifetimeBehavior) lifetimeBehavior: LifetimeBehavior,
        @inject(ExplodeOnLifetimeBehavior) explodeOnLifetimeBehavior: ExplodeOnLifetimeBehavior
    ) {
        this.controls.push(keyboardControl);
        this.controls.push(gamepadControl);

        this.gravityBehavior = gravityBehavior;
        this.lifetimeBehavior = lifetimeBehavior;
        this.explodeOnLifetimeBehavior = explodeOnLifetimeBehavior;
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(ControllableBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());

            if (control.checkFireStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().getPrimaryWeapon().fire(entity, multiplier, simulator);
                }
            }

            if (control.checkCtrlStatus() === true) {
                if (entity instanceof Hero) {
                    entity.getWeaponSlots().getSecondaryWeapon().fire(entity, multiplier, simulator);
                }
            }
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(ControllableBehavior.movementAccel));
        entity.getAxis().addMoment(finalMoment.multiply(ControllableBehavior.rotationAccel));
    }
}