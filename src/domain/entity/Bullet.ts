import {TemporaryEntity} from "./TemporaryEntity";
import {DynamicLineBBox} from "../model/bbox/DynamicLineBBox";

export class Bullet extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 1);
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionEntityInterface').set('bullet', true);

        this.getHandlerMetadata('CollisionBehavior').set('bbox', new DynamicLineBBox(this.getHandlerMetadata('main').get('mass'), 0, 0, 0, 0));
    }
}