import {inject, injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";
import {Bullet} from "../../../domain/entity/Bullet";
import {GravityBehavior} from "./GravityBehavior";
import {ExplodeOnLifetimeBehavior} from "./ExplodeOnLifetimeBehavior";

@injectable()
export class ControllableBehavior implements BehaviorInterface {
    static readonly movementAccel = 1200;
    static readonly rotationAccel = 300;

    private gravityBehavior: GravityBehavior;
    private explodeOnLifetimeBehavior: ExplodeOnLifetimeBehavior;

    private controls: ControlInterface[] = [];
    private lastFireTime: number = new Date().getTime();

    constructor(
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(ExplodeOnLifetimeBehavior) explodeOnLifetimeBehavior: ExplodeOnLifetimeBehavior
    ) {
        this.gravityBehavior = gravityBehavior;
        this.explodeOnLifetimeBehavior = explodeOnLifetimeBehavior;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);
        let finalMoment: Moment = new Moment(0);

        for (let control of this.controls) {
            finalVector.addVector(control.getMovingVector());
            finalMoment.addMoment(control.getRotationMoment());

            if (control.checkFireStatus() === true) {
                this.fire(entity);
            }
        }

        entity.getPosition().addVector(finalVector.rotate(entity.getAxis().getOrientation() - 90).multiply(ControllableBehavior.movementAccel));
        entity.getAxis().addMoment(finalMoment.multiply(ControllableBehavior.rotationAccel));
    }

    addControl(control: ControlInterface): BehaviorInterface {
        this.controls.push(control);

        return this;
    }

    private fire(entity): void {
        let currentTime: number = new Date().getTime();

        if ((this.lastFireTime != null) && (currentTime - this.lastFireTime) < 400) {
            return;
        }

        this.lastFireTime = currentTime;

        let bulletPosition = Vector.createFromDirDis(entity.getAxis().getOrientation(), 22).addVector(entity.getPosition());
        let bullet: Bullet = new Bullet(bulletPosition.getX(), bulletPosition.getY(), entity.getAxis().getOrientation());

        bullet.setMaxLifetime(0.6);
        // bullet.addBehavior(this.gravityBehavior);
        bullet.addBehavior(this.explodeOnLifetimeBehavior);
        bullet.getPosition().setSpeed(Vector.createFromDirDis(bullet.getAxis().getOrientation(), 300).addVector(entity.getPosition().getSpeed()));
        entity.getSpace().addEntity(bullet);

        entity.getPosition().addVector(
            Vector.createFromVector(bullet.getPosition().getSpeed()).invert().multiply(5)
        );
    }
}