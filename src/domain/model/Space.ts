import {Entity} from "./Entity";
import {Dispatcher, subscriptionFn} from "../../application/util/Dispatcher";

export class Space {
    public static EVENT_POST_ENTITY_CREATED = 'post_entity_created';
    public static EVENT_PRE_ENTITY_DELETED = 'pre_entity_deleted';

    private dispatcher: Dispatcher;
    private entities: Entity[] = [];

    constructor() {
        this.dispatcher = new Dispatcher([Space.EVENT_POST_ENTITY_CREATED, Space.EVENT_PRE_ENTITY_DELETED]);
    }

    on(event: string, subscription: subscriptionFn, context?: any): Space {
        this.dispatcher.subscribe(event, subscription, context);

        return this;
    }

    getEntities(): Entity[] {
        return this.entities;
    }

    addEntity(entity: Entity): Space {
        this.entities.push(entity);
        entity.setSpace(this);

        entity.init();

        this.dispatcher.emit(Space.EVENT_POST_ENTITY_CREATED, entity);

        return this;
    }

    deleteEntity(entity: Entity) {
        const index: number = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
            entity.setSpace(null);

            this.dispatcher.emit(Space.EVENT_PRE_ENTITY_DELETED, entity);
        }
    }
}