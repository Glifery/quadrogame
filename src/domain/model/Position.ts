import {Vector} from "./Vector";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";

export class Position {
    private x: number;
    private y: number;
    private accel: Vector;
    private speed: Vector;
    private vectors: Vector[];//массив векторов, которые накладываются на вектор скорости

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.accel = new Vector(0, 0);
        this.speed = new Vector(0, 0);
        this.vectors = [];
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setXY(x: number, y: number): Position {
        this.x = x;
        this.y = y;

        return this;
    }

    getAccel(): Vector {
        return this.accel;
    }

    setAccel(accel: Vector): Position {
        this.accel = accel;

        return this;
    }

    getSpeed(): Vector {
        return this.speed;
    }

    setSpeed(speed: Vector): Position {
        this.speed = speed;

        return this;
    }

    getVectors(): Vector[] {
        return this.vectors;
    }

    addVector(vector: Vector): Position {
        this.vectors.push(vector);

        return this;
    }

    clearVectors(): Position {
        this.vectors = [];

        return this;
    }
}