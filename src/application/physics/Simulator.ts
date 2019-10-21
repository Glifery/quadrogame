import {injectable} from "inversify";
import {Vector} from "../../domain/model/Vector";
import {Space} from "../../domain/model/Space";
import {Entity} from "../../domain/model/Entity";
import {Moment} from "../../domain/model/Moment";
import {GlobalBehaviorInterface} from "./behavior/global/GlobalBehaviorInterface";

@injectable()
export class Simulator {
    private spaces: Space[] = [];
    private globalBehaviors: GlobalBehaviorInterface[] = [];
    private counter: number = 0;

    registerSpace(space: Space): Simulator {
        this.spaces.push(space);

        return this;
    }

    addGlobalBehaviors(globalBehavior: GlobalBehaviorInterface): Simulator {
        this.globalBehaviors.push(globalBehavior);

        // In case if global behavior is added AFTER entity added
        for (let entities of this.getEntities()) {
            globalBehavior.initiateEntity(entities, this);

        }

        return this;
    }

    registerEntity(entity: Entity): void {
        for (let behavior of this.globalBehaviors) {
            behavior.initiateEntity(entity, this);
        }
    }

    getEntities(): Entity[] {
        let entities: Entity[] = [];

        for (let space of this.spaces) {
            for (let entity of space.getEntities()) {
                entities.push(entity);
            }
        }

        return entities;
    }

    startSimulation(fps: number, speed: number = 1): Simulator {
        setInterval(
            () => this.prepare().calculate(speed/fps).apply().move(speed/fps),
            1000/fps
        );

        return this;
    }

    private prepare(): Simulator {
        for (let entity of this.getEntities()) {
            entity.getPosition().clearVectors();
            entity.getAxis().clearMoments();
        }

        return this
    }

    private calculate(multiplier: number): Simulator {
        for (let entity of this.getEntities()) {
            for (let behavior of entity.getBehaviors()) {
                behavior.handle(entity, multiplier, this);
            }
        }

        for (let behavior of this.globalBehaviors) {
            behavior.handle(this.getEntities(), multiplier, this);
        }

        return this
    }

    private apply(): Simulator {
        for (let entity of this.getEntities()) {
            let sleedAccel: Vector = new Vector(0, 0);

            for (let vector of entity.getPosition().getVectors()) {
                sleedAccel.addVector(vector);
            }

            entity.getPosition().setAccel(sleedAccel);

            let rotationAccel: Moment = new Moment(0);

            for (let moment of entity.getAxis().getMoments()) {
                rotationAccel.addMoment(moment);
            }

            entity.getAxis().setAccel(rotationAccel);
        }

        return this
    }

    private move(multiplier: number): Simulator {
        this.counter += multiplier;

        for (let entity of this.getEntities()) {
            this.savePrevPosition(entity);

            this.calculateByEylerFormula(entity, multiplier);
            // this.calculateByMathFormula(entity, multiplier);
        }

        return this;
    }

    private savePrevPosition(entity: Entity): void {
        entity.getPosition().setPrevXY(entity.getPosition().getX(), entity.getPosition().getY());
    }

    /**
     * https://web.archive.org/web/20120624003417/http://www.niksula.hut.fi/~hkankaan/Homepages/gravity.html
     * https://habr.com/ru/post/341540/
     *
     *      temp = acc*dt
     *      pos = pos + dt*(vel + temp/2)
     *      vel = vel + temp
     *
     * @param {Entity} entity
     * @param {number} multiplier
     */
    private calculateByEylerFormula(entity: Entity, multiplier: number): void {
        let accelMovementForPeriod = Vector.createFromVector(entity.getPosition().getAccel()).multiply(multiplier);
        let halfMovement = Vector.createFromVector(entity.getPosition().getSpeed()).addVector(Vector.createFromVector(accelMovementForPeriod).multiply(0.5));
        let movementForPeriod = Vector.createFromVector(halfMovement).multiply(multiplier);

        entity.getPosition().setXY(entity.getPosition().getX() + movementForPeriod.getX(), entity.getPosition().getY() + movementForPeriod.getY());
        entity.getPosition().setSpeed(entity.getPosition().getSpeed().addVector(accelMovementForPeriod));

        let accelRotationForPeriod = Moment.createFromMoment(entity.getAxis().getAccel()).multiply(multiplier);
        let halfRotation = Moment.createFromMoment(entity.getAxis().getRotation()).addMoment(Moment.createFromMoment(accelRotationForPeriod).multiply(0.5));
        let rotationForPeriod = Moment.createFromMoment(halfRotation).multiply(multiplier);

        entity.getAxis().setOrientation(entity.getAxis().getOrientation() + rotationForPeriod.getDir());
        entity.getAxis().setRotation(entity.getAxis().getRotation().addMoment(accelRotationForPeriod));

        // if (entity instanceof Hero) {
        //     console.log('speed', entity.getPosition().getSpeed().getDis() / this.counter, entity.getPosition().getX() - 1000, this.counter);
        //     console.log('rotation', entity.getAxis().getRotation().getDir() / this.counter, entity.getAxis().getOrientation(), this.counter);
        // }
    }

    private calculateByMathFormula(entity: Entity, multiplier: number): void {
        /**
         * period values - real accel and speed within one tick
         * @type {Vector}
         */
        // let periodSpeedAccel = Vector.createFromVector(entity.getPosition().getAccel()).multiply(multiplier);
        // let periodSpeed = Vector.createFromVector(entity.getPosition().getSpeed()).addVector(periodSpeedAccel);

        // let periodRotationAccel = Moment.createFromMoment(entity.getAxis().getAccel()).multiply(multiplier);
        // let periodRotation = Moment.createFromMoment(entity.getAxis().getRotation()).addMoment(periodRotationAccel);

        /**
         * S = (V0*T) + (a*T*T)/2
         */
        let initialMovement = Vector.createFromVector(entity.getPosition().getSpeed()).multiply(multiplier);
        let accelMovement = Vector.createFromVector(entity.getPosition().getAccel()).multiply(multiplier * multiplier).multiply(0.5);
        let actualMovement = Vector.createFromVector(initialMovement).addVector(accelMovement);

        let initialRotation = Moment.createFromMoment(entity.getAxis().getRotation()).multiply(multiplier);
        let accelRotation = Moment.createFromMoment(entity.getAxis().getAccel()).multiply(multiplier * multiplier).multiply(0.5);
        let actualRotation = Moment.createFromMoment(initialRotation).addMoment(accelRotation);

        entity.getPosition().setXY(entity.getPosition().getX() + actualMovement.getX(), entity.getPosition().getY() + actualMovement.getY());
        // entity.getPosition().setSpeed(periodSpeed);
        entity.getPosition().setSpeed(Vector.createFromVector(actualMovement).multiply(1/multiplier));

        entity.getAxis().setOrientation(entity.getAxis().getOrientation() + actualRotation.getDir());
        // entity.getAxis().setRotation(periodRotation);
        entity.getAxis().setRotation(Moment.createFromMoment(actualRotation).multiply(1/multiplier));

        // if (entity instanceof Hero) {
        //     console.log('speed', entity.getPosition().getSpeed().getDis() / this.counter, entity.getPosition().getX() - 1000, this.counter);
        //     console.log('rotation', entity.getAxis().getRotation().getDir() / this.counter, entity.getAxis().getOrientation(), this.counter);
        // }

        /**
         * Debug log
         */
        // this.counter += multiplier;
        // console.log(Vector.clearFloat(this.counter, 1), ":", Vector.clearFloat(object.getX(), 2), Vector.clearFloat(object.getY(), 2), object.speed.getDis());
        // console.log(Vector.clearFloat(this.counter, 1), ":", object.speed.getDis());
    }
}
