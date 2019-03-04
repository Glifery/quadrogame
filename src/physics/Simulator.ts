import {Position} from "../model/Position";
import {Vector} from "../model/Vector";

export class Simulator {
    private positions: Position[] = [];

    protected counter: number = 0;

    registerObject(position: Position): Simulator {
        this.positions.push(position);

        return this;
    }

    public getObjects(): Position[] {
        return this.positions;
    }

    public startSimulation(fps: number, speed: number = 1): Simulator {
        setInterval(
            () => this.prepare().calculate().apply().move(speed/fps),
            1000/fps
        );

        return this;
    }

    private prepare(): Simulator {
        for (let object of this.positions) {
            object.clearVectors();
        }

        return this
    }

    private calculate(): Simulator {
        for (let position of this.positions) {
            for (let behavior of position.getBehaviors()) {
                behavior.handle(position, this);
            }
        }

        return this
    }

    private apply(): Simulator {
        for (let position of this.positions) {
            let accel = new Vector(0, 0);

            for (let vector of position.getVectors()) {
                accel.addVector(vector);
            }

            position.setAccel(accel);
        }

        return this
    }

    private move(multiplier: number): Simulator {
        for (let position of this.positions) {
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
