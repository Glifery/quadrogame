import {Position} from "./Position";
import {Entity} from "./Entity";

export class Space {
    private entities: Entity[] = [];

    addEntity(entity: Entity): Space {
        this.entities.push(entity);

        return this;
    }

    getEntities(): Entity[] {
        return this.entities;
    }
}