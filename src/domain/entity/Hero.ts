import {Entity} from "../model/Entity";

export class Hero extends Entity {
    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);
    }
}