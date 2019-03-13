import {Position} from "./Position";
import {Axis} from "./Axis";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";

export class Entity {
    private position: Position;
    private axis: Axis;
    private mass: number;
    private behaviors: BehaviorInterface[];
    private renderer: any;

    constructor(x: number, y: number, mass: number, dir: number = 0) {
        this.position = new Position(x, y);
        this.axis = new Axis(dir);
        this.mass = mass;
        this.behaviors = [];
    }

    getPosition(): Position {
        return this.position;
    }

    getAxis(): Axis {
        return this.axis;
    }

    getMass(): number {
        return this.mass;
    }

    getBehaviors(): BehaviorInterface[] {
        return this.behaviors;
    }

    addBehavior(behavior: BehaviorInterface): Entity {
        this.behaviors.push(behavior);

        return this;
    }

    getRenderer(): any {
        return this.renderer;
    }

    setRenderer(renderer: any): Entity {
        this.renderer = renderer;

        return this;
    }
}