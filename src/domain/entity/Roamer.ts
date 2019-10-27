import {Entity} from "../model/Entity";

export class Roamer extends Entity {
    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);
    }
}