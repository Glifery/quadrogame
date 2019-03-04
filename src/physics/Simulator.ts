import {Position} from "../model/Position";
import {Vector} from "../model/Vector";

export class Simulator {
    private objects: Position[] = [];

    protected counter: number = 0;

    registerObject(object: Position): Simulator {
        this.objects.push(object);

        return this;
    }

    public getObjects(): Position[] {
        return this.objects;
    }

    public startSimulation(fps: number, speed: number = 1): Simulator {
        setInterval(
            () => this.prepare().calculate().apply().move(speed/fps),
            1000/fps
        );

        return this;
    }

    private prepare(): Simulator {
        for (let object of this.objects) {
            object.clearVectors();
        }

        return this
    }

    private calculate(): Simulator {
        for (let object of this.objects) {
            for (let behavior of object.getBehaviors()) {
                behavior.handle(object, this);
            }
        }

        return this
    }

    private apply(): Simulator {
        for (let object of this.objects) {
            let accel = new Vector(0, 0);

            for (let vector of object.getVectors()) {
                accel.addVector(vector);
            }

            object.setAccel(accel);
        }

        return this
    }

    private move(multiplier: number): Simulator {
        for (let object of this.objects) {
            /**
             * period values - real accel and speed within one tick
             * @type {Vector}
             */
            let periodAccel = Vector.createFromVector(object.getAccel()).multiply(multiplier);
            let periodSpeed = Vector.createFromVector(object.getSpeed()).addVector(periodAccel);

            /**
             * S = (V0*T) + (a*T*T)/2
             */
            let initialMovement = Vector.createFromVector(object.getSpeed()).multiply(multiplier);
            let accelMovement = Vector.createFromVector(object.getAccel()).multiply(multiplier * multiplier).multiply(0.5);
            let actualMovement = Vector.createFromVector(initialMovement).addVector(accelMovement);

            object.setXY(object.getX() + actualMovement.getX(), object.getY() + actualMovement.getY());
            object.setSpeed(periodSpeed);

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
