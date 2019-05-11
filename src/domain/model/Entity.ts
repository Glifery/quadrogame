import {Position} from "./Position";
import {Axis} from "./Axis";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";
import {Space} from "./Space";
import {BBox} from "./bbox/BBox";

export class Entity {
    protected position: Position;
    protected axis: Axis;
    protected bbox: BBox;
    protected behaviors: BehaviorInterface[];
    protected space: Space;
    protected renderer: any;

    constructor(x: number, y: number, dir: number = 0) {
        this.position = new Position(x, y);
        this.axis = new Axis(dir);
        this.behaviors = [];
    }

    getPosition(): Position {
        return this.position;
    }

    getAxis(): Axis {
        return this.axis;
    }

    getBBox(): BBox {
        return this.bbox;
    }

    getBehaviors(): BehaviorInterface[] {
        return this.behaviors;
    }

    addBehavior(behavior: BehaviorInterface): Entity {
        this.behaviors.push(behavior);

        return this;
    }

    getSpace(): Space {
        return this.space;
    }

    setSpace(space: Space): Entity {
        this.space = space;

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