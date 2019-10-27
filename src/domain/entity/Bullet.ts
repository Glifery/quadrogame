import {TemporaryEntity} from "./TemporaryEntity";

export class Bullet extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('CollisionEntityInterface').set('bullet', true);
    }
}