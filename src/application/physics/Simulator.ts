import {inject, injectable} from "inversify";
import {Vector} from "../../domain/model/Vector";
import {Space} from "../../domain/model/Space";
import {Entity} from "../../domain/model/Entity";
import {Moment} from "../../domain/model/Moment";
import {GlobalBehaviorInterface} from "./behavior/global/GlobalBehaviorInterface";
import {BehaviorInterface} from "./behavior/BehaviorInterface";
import {LifetimeBehavior} from "./behavior/LifetimeBehavior";
import {TestBehavior} from "./behavior/TestBehavior";
import {NullBehavior} from "./behavior/NullBehavior";
import {DumpBehavior} from "./behavior/DumpBehavior";
import {CollisionBehavior} from "./behavior/global/CollisionBehavior";
import {GravityBehavior} from "./behavior/GravityBehavior";
import {ControllableBehavior} from "./behavior/ControllableBehavior";
import {ExplodeOnLifetimeBehavior} from "./behavior/ExplodeOnLifetimeBehavior";
import {ExplosionBehavior} from "./behavior/ExplosionBehavior";
import {TeamBehavior} from "./behavior/TeamBehavior";

@injectable()
export class Simulator {
    private spaces: Space[] = [];
    private entityBehaviors: Map<string, BehaviorInterface>;
    private globalBehaviors: Map<string, GlobalBehaviorInterface>;
    private counter: number = 0;

    constructor(
        @inject(ControllableBehavior) controllableBehavior: ControllableBehavior,
        @inject(DumpBehavior) dumpBehavior: DumpBehavior,
        @inject(ExplodeOnLifetimeBehavior) explodeOnLifetimeBehavior: ExplodeOnLifetimeBehavior,
        @inject(ExplosionBehavior) explosionBehavior: ExplosionBehavior,
        @inject(GravityBehavior) gravityBehavior: GravityBehavior,
        @inject(LifetimeBehavior) lifetimeBehavior: LifetimeBehavior,
        @inject(NullBehavior) nullBehavior: NullBehavior,
        @inject(TeamBehavior) teamBehavior: TeamBehavior,
        @inject(TestBehavior) testBehavior: TestBehavior,

        @inject(CollisionBehavior) collisionBehavior: CollisionBehavior,
    ) {
        this.entityBehaviors = new Map<string, BehaviorInterface>();

        this.entityBehaviors.set(ControllableBehavior.getName(), controllableBehavior);
        this.entityBehaviors.set(DumpBehavior.getName(), dumpBehavior);
        this.entityBehaviors.set(ExplodeOnLifetimeBehavior.getName(), explodeOnLifetimeBehavior);
        this.entityBehaviors.set(ExplosionBehavior.getName(), explosionBehavior);
        this.entityBehaviors.set(GravityBehavior.getName(), gravityBehavior);
        this.entityBehaviors.set(LifetimeBehavior.getName(), lifetimeBehavior);
        this.entityBehaviors.set(NullBehavior.getName(), nullBehavior);
        this.entityBehaviors.set(TeamBehavior.getName(), teamBehavior);
        this.entityBehaviors.set(TestBehavior.getName(), testBehavior);

        this.globalBehaviors = new Map<string, GlobalBehaviorInterface>();
        this.globalBehaviors.set(CollisionBehavior.getName(), collisionBehavior);
    }

    registerSpace(space: Space): Simulator {
        space.getEntities().forEach(entity => this.initEntity(entity));

        space
            .on(Space.EVENT_POST_ENTITY_CREATED, this.initEntity, this)
            .on(Space.EVENT_PRE_ENTITY_DELETED, this.deleteEntity, this);

        this.spaces.push(space);

        return this;
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

    private initEntity(entity: Entity): void {
        const simulator: Simulator = this;

        this.globalBehaviors.forEach((behavior: GlobalBehaviorInterface, name: string) => {
            behavior.initEntity(entity, simulator);
        });
    }

    private deleteEntity(entity: Entity): void {
        const simulator: Simulator = this;

        this.globalBehaviors.forEach((behavior: GlobalBehaviorInterface, name: string) => {
            behavior.deleteEntity(entity, simulator);
        });
    }

    private prepare(): Simulator {
        for (let entity of this.getEntities()) {
            entity.getPosition().clearVectors();
            entity.getAxis().clearMoments();
        }

        return this
    }

    private calculate(multiplier: number): Simulator {
        const simulator: Simulator = this;

        //Calculate GLOBAL first
        this.globalBehaviors.forEach((behavior: GlobalBehaviorInterface, name: string) => {
            behavior.handle(this.getEntities(), multiplier, simulator);
        });

        //Then calculate the rest
        for (let entity of this.getEntities()) {
            this.entityBehaviors.forEach((behavior: BehaviorInterface, name: string) => {
                if (behavior.supports(entity)) {
                    behavior.handle(entity, multiplier, simulator);
                }
            });
        }

        return this;
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
            // this.calculateByMathFormula(unit, multiplier);
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

        // if (unit instanceof Hero) {
        //     console.log('speed', unit.getPosition().getSpeed().getDis() / this.counter, unit.getPosition().getX() - 1000, this.counter);
        //     console.log('rotation', unit.getAxis().getRotation().getDir() / this.counter, unit.getAxis().getOrientation(), this.counter);
        // }
    }

    private calculateByMathFormula(entity: Entity, multiplier: number): void {
        /**
         * period values - real accel and speed within one tick
         * @type {Vector}
         */
        // let periodSpeedAccel = Vector.createFromVector(unit.getPosition().getAccel()).multiply(multiplier);
        // let periodSpeed = Vector.createFromVector(unit.getPosition().getSpeed()).addVector(periodSpeedAccel);

        // let periodRotationAccel = Moment.createFromMoment(unit.getAxis().getAccel()).multiply(multiplier);
        // let periodRotation = Moment.createFromMoment(unit.getAxis().getRotation()).addMoment(periodRotationAccel);

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
        // unit.getPosition().setSpeed(periodSpeed);
        entity.getPosition().setSpeed(Vector.createFromVector(actualMovement).multiply(1/multiplier));

        entity.getAxis().setOrientation(entity.getAxis().getOrientation() + actualRotation.getDir());
        // unit.getAxis().setRotation(periodRotation);
        entity.getAxis().setRotation(Moment.createFromMoment(actualRotation).multiply(1/multiplier));

        // if (unit instanceof Hero) {
        //     console.log('speed', unit.getPosition().getSpeed().getDis() / this.counter, unit.getPosition().getX() - 1000, this.counter);
        //     console.log('rotation', unit.getAxis().getRotation().getDir() / this.counter, unit.getAxis().getOrientation(), this.counter);
        // }

        /**
         * Debug log
         */
        // this.counter += multiplier;
        // console.log(Vector.clearFloat(this.counter, 1), ":", Vector.clearFloat(object.getX(), 2), Vector.clearFloat(object.getY(), 2), object.speed.getDis());
        // console.log(Vector.clearFloat(this.counter, 1), ":", object.speed.getDis());
    }
}
