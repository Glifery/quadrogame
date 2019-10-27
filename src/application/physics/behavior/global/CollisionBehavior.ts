import {injectable} from "inversify";
import {Simulator} from "../../Simulator";
import {Vector} from "../../../../domain/model/Vector";
import {Entity} from "../../../../domain/model/Entity";
import {GlobalBehaviorInterface} from "./GlobalBehaviorInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {BBox} from "../../../../domain/model/bbox/BBox";
import {CircleBBox} from "../../../../domain/model/bbox/CircleBBox";
import {Collisions, Result} from "detect-collisions";
import {LineBBox} from "../../../../domain/model/bbox/LineBBox";
import {CollisionHandlerInterface} from "../collision/CollisionHandlerInterface";
import {DynamicLineBBox} from "../../../../domain/model/bbox/DynamicLineBBox";

@injectable()
export class CollisionBehavior implements GlobalBehaviorInterface {
    private collisionHandlers: CollisionHandlerInterface[];
    private system: Collisions;
    private result: Result;

    constructor() {
        this.collisionHandlers = [];

        this.system = new Collisions();
        this.result = this.system.createResult();
    }

    addCollisionHandler(collisionHandler: CollisionHandlerInterface): CollisionBehavior {
        this.collisionHandlers.push(collisionHandler);

        return this;
    }

    initiateEntity(entity: Entity, simulator: Simulator): void {
        this.initiateBBox(entity);
    }

    handle(entities: Entity[], multiplier: number, simulator: Simulator): void {
        let collidableEntities: Entity[] = [];

        for (let entity of entities) {
            if (!entity.getHandlerMetadata('CollisionBehavior').get('bbox')) {
                continue;
            }

            this.updateBBox(entity);

            collidableEntities.push(entity);
        }

        let collisionPairs: CollisionPair[] = [];

        for (let entity1 of collidableEntities) {
            for (let entity2 of collidableEntities) {
                if (entity2 == entity1) {
                    break;
                }

                const entity1BBox: BBox = entity1.getHandlerMetadata('CollisionBehavior').get('bbox');
                const entity2BBox: BBox = entity2.getHandlerMetadata('CollisionBehavior').get('bbox');

                if (entity1BBox.getCollider().collides(entity2BBox.getCollider(), this.result)) {
                    collisionPairs.push(new CollisionPair(entity1, entity2, new Vector(
                        this.result.overlap * this.result.overlap_x,
                        this.result.overlap * this.result.overlap_y
                    )));
                }
            }
        }

        for (let collisionPair of collisionPairs) {
            this.resolveCollisionForPair(collisionPair, multiplier, simulator);
        }
    }

    resolveCollisionForPair(collisionPair: CollisionPair, multiplier: number, simulator: Simulator): void {
        for (let collisionHandler of this.collisionHandlers) {
            if (!collisionHandler.supports(collisionPair)) {
                continue;
            }

            collisionHandler.handle(collisionPair, multiplier, simulator);
        }
    }

    private updateBBox(entity: Entity): void {
        const bbox: BBox = entity.getHandlerMetadata('CollisionBehavior').get('bbox');

        if (bbox instanceof DynamicLineBBox) {
            if ((entity.getPosition().getPrevX() == null) || (entity.getPosition().getPrevY() == null)) {
                bbox.getCollider().x = entity.getPosition().getX();
                bbox.getCollider().y = entity.getPosition().getY();

                return;
            }

            this.system.remove(bbox.getCollider());

            const shiftPositionVector: Vector = new Vector(
                entity.getPosition().getPrevX() - entity.getPosition().getX(),
                entity.getPosition().getPrevY() - entity.getPosition().getY()
            );

            const newBBox: LineBBox = new DynamicLineBBox(0, 0, 0, shiftPositionVector.getX(), shiftPositionVector.getY());
            newBBox.setCollider(this.system.createPolygon(
                entity.getPosition().getX() + newBBox.getX(),
                entity.getPosition().getY() + newBBox.getY(),
                [
                    [
                        0,0
                    ],
                    [
                        shiftPositionVector.getX() + newBBox.getX(),
                        shiftPositionVector.getY() + newBBox.getY()
                    ]
                ]
            ));

            entity.getHandlerMetadata('CollisionBehavior').set('bbox', newBBox);

            return;
        }

        if ((bbox instanceof CircleBBox) || bbox instanceof LineBBox) {
            bbox.getCollider().x = entity.getPosition().getX();
            bbox.getCollider().y = entity.getPosition().getY();

            return;
        }
    }

    private initiateBBox(entity: Entity): void {
        const bbox: BBox = entity.getHandlerMetadata('CollisionBehavior').get('bbox');

        if (bbox instanceof CircleBBox) {
            bbox.setCollider(this.system.createCircle(
                entity.getPosition().getX() + bbox.getOffsetX(),
                entity.getPosition().getY() + bbox.getOffsetY(),
                bbox.getRadius()
            ));
        }

        if (bbox instanceof LineBBox) {
            bbox.setCollider(this.system.createPolygon(
                entity.getPosition().getX() + bbox.getX(),
                entity.getPosition().getY() + bbox.getY(),
                [
                    [
                        0,0
                    ],
                    [
                        bbox.getVector().getX(),
                        bbox.getVector().getY()
                    ]
                ]
            ));
        }

        if (bbox instanceof DynamicLineBBox) {
            bbox.setCollider(this.system.createPolygon(
                entity.getPosition().getX() + bbox.getX(),
                entity.getPosition().getY() + bbox.getY(),
                [[0, 0], [0, 0]]
            ));
        }
    }
}