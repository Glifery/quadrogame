import {Entity} from "../model/Entity";

export class Enemy extends Entity {
    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);
    }
}