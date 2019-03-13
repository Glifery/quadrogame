import {injectable} from "inversify";
import {Position} from "../../domain/model/Position";
import {Vector} from "../../domain/model/Vector";
import {Space} from "../../domain/model/Space";
import {Entity} from "../../domain/model/Entity";

@injectable()
export class Simulator {
    private spaces: Space[] = [];

    private counter: number = 0;

    registerSpace(space: Space): Simulator {
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
            () => this.prepare().calculate().apply().move(speed/fps),
            1000/fps
        );

        return this;
    }

    private prepare(): Simulator {
        for (let entity of this.getEntities()) {
            entity.getPosition().clearVectors();
        }

        return this
    }

    private calculate(): Simulator {
        for (let entity of this.getEntities()) {
            for (let behavior of entity.getBehaviors()) {
                behavior.handle(entity, this);
            }
        }

        return this
    }

    private apply(): Simulator {
        for (let entity of this.getEntities()) {
            let accel = new Vector(0, 0);

            for (let vector of entity.getPosition().getVectors()) {
                accel.addVector(vector);
            }

            entity.getPosition().setAccel(accel);
        }

        return this
    }

    private move(multiplier: number): Simulator {
        for (let entity of this.getEntities()) {
            /**
             * period values - real accel and speed within one tick
             * @type {Vector}
             */
            let periodAccel = Vector.createFromVector(entity.getPosition().getAccel()).multiply(multiplier);
            let periodSpeed = Vector.createFromVector(entity.getPosition().getSpeed()).addVector(periodAccel);

            /**
             * S = (V0*T) + (a*T*T)/2
             */
            let initialMovement = Vector.createFromVector(entity.getPosition().getSpeed()).multiply(multiplier);
            let accelMovement = Vector.createFromVector(entity.getPosition().getAccel()).multiply(multiplier * multiplier).multiply(0.5);
            let actualMovement = Vector.createFromVector(initialMovement).addVector(accelMovement);

            entity.getPosition().setXY(entity.getPosition().getX() + actualMovement.getX(), entity.getPosition().getY() + actualMovement.getY());
            entity.getPosition().setSpeed(periodSpeed);

            /**
             * Debug log
             */
            this.counter += multiplier;
            // console.log(Vector.clearFloat(this.counter, 1), ":", Vector.clearFloat(object.getX(), 2), Vector.clearFloat(object.getY(), 2), object.speed.getDis());
            // console.log(Vector.clearFloat(this.counter, 1), ":", object.speed.getDis());
        }

        return this;
    }
}
