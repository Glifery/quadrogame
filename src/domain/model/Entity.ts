import {Position} from "./Position";
import {Axis} from "./Axis";
import {Space} from "./Space";

export abstract class Entity {
    private handlerMetadata: Map<string, Map<string, any>>;
    protected position: Position;
    protected axis: Axis;
    protected space: Space;

    constructor(x: number, y: number, dir: number = 0) {
        this.handlerMetadata = new Map<string, Map<string, any>>();
        this.position = new Position(x, y);
        this.axis = new Axis(dir);
    }

    init(): void {}

    getPosition(): Position {
        return this.position;
    }

    getAxis(): Axis {
        return this.axis;
    }

    getSpace(): Space {
        return this.space;
    }

    setSpace(space: Space): Entity {
        this.space = space;

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