import {Entity} from "./Entity";

export class Space {
    private entities: Entity[] = [];

    addEntity(entity: Entity): Space {
        this.entities.push(entity);
        entity.setSpace(this);

        return this;
    }

    getEntities(): Entity[] {
        return this.entities;
    }

    deleteEntity(entity: Entity) {
        const index: number = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
            entity.setSpace(null);
            entity.getRepresentation().getGraphic().remove();
            entity.setRepresentation(null);
        }
    }
}