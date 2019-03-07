import {injectable} from "inversify";
import {Position} from "../../domain/model/Position";
import {Vector} from "../../domain/model/Vector";
import {Space} from "../../domain/model/Space";

@injectable()
export class Simulator {
    private spaces: Space[] = [];

    protected counter: number = 0;

    registerSpace(space: Space): Simulator {
        this.spaces.push(space);

        return this;
    }

    public getPositions(): Position[] {
        let positions: Position[] = [];

        for (let space of this.spaces) {
            for (let position of space.getPositions()) {
                positions.push(position);
            }
        }

        return positions;
    }

    public startSimulation(fps: number, speed: number = 1): Simulator {
        setInterval(
            () => this.prepare().calculate().apply().move(speed/fps),
            1000/fps
        );

        return this;
    }

    private prepare(): Simulator {
        for (let object of this.getPositions()) {
            object.clearVectors();
        }

        return this
    }

    private calculate(): Simulator {
        for (let position of this.getPositions()) {
            for (let behavior of position.getBehaviors()) {
                behavior.handle(position, this);
            }
        }

        return this
    }

    private apply(): Simulator {
        for (let position of this.getPositions()) {
            let accel = new Vector(0, 0);

            for (let vector of position.getVectors()) {
                accel.addVector(vector);
            }

            position.setAccel(accel);
        }

        return this
    }

    private move(multiplier: number): Simulator {
        for (let position of this.getPositions()) {
            /**
             * period values - real accel and speed within one tick
             * @type {Vector}
             */
            let periodAccel = Vector.createFromVector(position.getAccel()).multiply(multiplier);
            let periodSpeed = Vector.createFromVector(position.getSpeed()).addVector(periodAccel);

            /**
             * S = (V0*T) + (a*T*T)/2
             */
            let initialMovement = Vector.createFromVector(position.getSpeed()).multiply(multiplier);
            let accelMovement = Vector.createFromVector(position.getAccel()).multiply(multiplier * multiplier).multiply(0.5);
            let actualMovement = Vector.createFromVector(initialMovement).addVector(accelMovement);

            position.setXY(position.getX() + actualMovement.getX(), position.getY() + actualMovement.getY());
            position.setSpeed(periodSpeed);

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
