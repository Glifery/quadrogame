import {TemporaryEntity} from "./TemporaryEntity";
import {CircleBBox} from "../model/bbox/CircleBBox";

export class Grenade extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 3);
        this.getHandlerMetadata('main').set('mass', 1);

        this.getHandlerMetadata('CollisionEntityInterface').set('reaction', true);

        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));
    }
}