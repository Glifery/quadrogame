import {Entity} from "./Entity";
import {Vector} from "./Vector";

export class CollisionPair {
    private entity1: Entity;
    private entity2: Entity;
    private overlap: Vector;

    constructor(entity1: Entity, entity2: Entity, overlap: Vector = null) {
        this.entity1 = entity1;
        this.entity2 = entity2;
        this.overlap = overlap;
    }

    getEntity1(): Entity {
        return this.entity1;
    }

    getEntity2(): Entity {
        return this.entity2;
    }

    getOverlap(): Vector {
        return this.overlap;
    }
}