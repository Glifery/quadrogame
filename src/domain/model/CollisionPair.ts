import {Entity} from "./Entity";

export class CollisionPair {
    private entity1: Entity;
    private entity2: Entity;

    constructor(entity1: Entity, entity2: Entity) {
        this.entity1 = entity1;
        this.entity2 = entity2;
    }

    getEntity1(): Entity {
        return this.entity1;
    }

    getEntity2(): Entity {
        return this.entity2;
    }
}