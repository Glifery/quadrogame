import {Position} from "./Position";

export class Space {
    private objects: Position[] = [];

    addObject(object: Position): Space {
        this.objects.push(object);

        return this;
    }

    getObjects(): Position[] {
        return this.objects;
    }
}