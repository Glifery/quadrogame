import {Entity} from "./Entity";
import {View} from "../../application/graphics/View";
import {Simulator} from "../../application/physics/Simulator";

export class Space {
    private simulator: Simulator;
    private views: View[];
    private entities: Entity[] = [];

    constructor(simulator: Simulator) {
        this.simulator = simulator;
        this.views = [];

        simulator.registerSpace(this);
    }

    addView(view: View): Space {
        this.views.push(view);

        return this;
    }

    addEntity(entity: Entity): Space {
        this.entities.push(entity);
        entity.setSpace(this);

        for (let view of this.views) {
            view.initiateRepresentation(entity);
        }

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