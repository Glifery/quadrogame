import {Position} from "./Position";
import {Axis} from "./Axis";
import {BehaviorInterface} from "../../application/physics/behavior/BehaviorInterface";
import {Space} from "./Space";
import {Representation} from "./Representation";

export abstract class Entity {
    private handlerMetadata: Map<string, Map<string, any>>;
    protected position: Position;
    protected axis: Axis;
    protected behaviors: BehaviorInterface[];
    protected space: Space;
    protected representation: Representation;

    constructor(x: number, y: number, dir: number = 0) {
        this.handlerMetadata = new Map<string, Map<string, any>>();
        this.position = new Position(x, y);
        this.axis = new Axis(dir);
        this.behaviors = [];
    }

    init(): void {}

    getPosition(): Position {
        return this.position;
    }

    getAxis(): Axis {
        return this.axis;
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

    getRepresentation(): Representation {
        return this.representation;
    }

    setRepresentation(representation: Representation): Entity {
        this.representation = representation;

        return this;
    }

    getHandlerMetadata(handler: string): Map<string, any> {
        let handlerMetadata: Map<string, any> = this.handlerMetadata.get(handler);

        if (handlerMetadata == null) {
            this.handlerMetadata.set(handler, new Map<string, any>());
        }

        return this.handlerMetadata.get(handler);
    }
}