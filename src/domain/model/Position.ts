import {Vector} from "./Vector";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";

export class Position {
    private x: number;
    private y: number;
    private mass: number;
    private accel: Vector;
    private speed: Vector;
    private vectors: Vector[] = [];//массив векторов, которые накладываются на вектор скорости
    private behaviors: BehaviorInterface[] = [];
    private renderer: any;

    public constructor(x: number, y: number, mass: number) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.accel = new Vector(0, 0);
        this.speed = new Vector(0, 0);
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

    getMass(): number {
        return this.mass;
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

    getBehaviors(): BehaviorInterface[] {
        return this.behaviors;
    }

    addBehavior(behavior: BehaviorInterface): Position {
        this.behaviors.push(behavior);

        return this;
    }

    getRenderer(): any {
        return this.renderer;
    }

    setRenderer(renderer: any): Position {
        this.renderer = renderer;

        return this;
    }
}