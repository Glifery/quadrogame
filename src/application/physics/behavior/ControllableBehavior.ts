import {inject, injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";
import {Grenade} from "../../../domain/entity/Grenade";
import {GravityBehavior} from "./GravityBehavior";
import {ExplodeOnLifetimeBehavior} from "./ExplodeOnLifetimeBehavior";
import {Bullet} from "../../../domain/entity/Bullet";
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
                this.grenade(entity);
            }
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(ControllableBehavior.movementAccel));
        entity.getAxis().addMoment(finalMoment.multiply(ControllableBehavior.rotationAccel));
    }

    private grenade(entity): void {
        let currentTime: number = new Date().getTime();

        if ((this.lastFireTime != null) && (currentTime - this.lastFireTime) < 400) {
            return;
        }

        this.lastFireTime = currentTime;

        let bulletPosition = Vector.createFromDirDis(entity.getAxis().getOrientation(), 22).addVector(entity.getPosition());
        let grenade: Grenade = new Grenade(bulletPosition.getX(), bulletPosition.getY(), entity.getAxis().getOrientation());

        grenade.setMaxLifetime(0.6);
        grenade.getPosition().setSpeed(Vector.createFromDirDis(grenade.getAxis().getOrientation(), 300).addVector(entity.getPosition().getSpeed()));
        entity.getSpace().addEntity(grenade);

        entity.getPosition().addVector(
            Vector.createFromVector(grenade.getPosition().getSpeed()).invert().multiply(5)
        );
    }
}