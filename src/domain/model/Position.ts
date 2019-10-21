import {Vector} from "./Vector";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";

export class Position {
    private x: number;
    private y: number;
    private prevX: number;
    private prevY: number;
    private accel: Vector;
    private speed: Vector;
    private vectors: Vector[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.prevX = null;
        this.prevY = null;
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

    getPrevX(): number {
        return this.prevX;
    }

    getPrevY(): number {
        return this.prevY;
    }

    setPrevXY(prevX: number, prevY: number): Position {
        this.prevX = prevX;
        this.prevY = prevY;

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