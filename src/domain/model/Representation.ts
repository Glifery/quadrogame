import {Entity} from "./Entity";
import {Projection} from "./Projection";

export class Representation {
    private entity: Entity;
    private projection: Projection;
    private graphic: any;

    constructor(entity: Entity, graphic: any) {
        this.entity = entity;
        this.graphic = graphic;
    }

    getEntity(): Entity {
        return this.entity;
    }

    setProjection(projection: Projection): Representation {
        this.projection = projection;

        return this;
    }

    getProjection(): Projection {
        return this.projection;
    }

    setGraphic(graphic: any): Representation {
        this.graphic = graphic;

        return this;
    }

    getGraphic(): any {
        return this.graphic;
    }
}