import {TemporaryEntity} from "./TemporaryEntity";

export class Grenade extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);
    }
}