import {Entity} from "./Entity";
import {Projection} from "./Projection";

export class Representation {
    private entity: Entity;
    private projection: Projection;

    constructor(entity: Entity, projection: Projection) {
        this.entity = entity;
        this.projection = projection;
    }

    getEntity(): Entity {
        return this.entity;
    }

    getProjection(): Projection {
        return this.projection;
    }
}