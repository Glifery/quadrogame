import {injectable} from "inversify";
import {Simulator} from "../../Simulator";
import {Vector} from "../../../../domain/model/Vector";
import {Entity} from "../../../../domain/model/Entity";
import {GlobalBehaviorInterface} from "./GlobalBehaviorInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {BBox} from "../../../../domain/model/bbox/BBox";
import {CircleBBox} from "../../../../domain/model/bbox/CircleBBox";
import {Collisions, Result} from "detect-collisions";
import {Hero} from "../../../../domain/entity/Hero";
import {Enemy} from "../../../../domain/entity/Enemy";
import {Roamer} from "../../../../domain/entity/Roamer";
import {Wall} from "../../../../domain/entity/Wall";
import {LineBBox} from "../../../../domain/model/bbox/LineBBox";
import {CollisionHandlerInterface} from "../collision/CollisionHandlerInterface";
import {Grenade} from "../../../../domain/entity/Grenade";
import {DynamicLineBBox} from "../../../../domain/model/bbox/DynamicLineBBox";
import {Bullet} from "../../../../domain/entity/Bullet";

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
            if (!entity.getBBox()) {
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

                if (entity1.getBBox().getCollider().collides(entity2.getBBox().getCollider(), this.result)) {
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
        if (entity.getSpace() && entity.getBBox() instanceof DynamicLineBBox) {
            if ((entity.getPosition().getPrevX() == null) || (entity.getPosition().getPrevY() == null)) {
                entity.getBBox().getCollider().x = entity.getPosition().getX();
                entity.getBBox().getCollider().y = entity.getPosition().getY();

                return;
            }

            this.system.remove(entity.getBBox().getCollider());

            const shiftPositionVector: Vector = new Vector(
                entity.getPosition().getPrevX() - entity.getPosition().getX(),
                entity.getPosition().getPrevY() - entity.getPosition().getY()
            );
            const bbox: LineBBox = new LineBBox(0, 0, 0, shiftPositionVector.getX(), shiftPositionVector.getY());

            bbox.setCollider(this.system.createPolygon(
                entity.getPosition().getX() + bbox.getX(),
                entity.getPosition().getY() + bbox.getY(),
                [
                    [
                        0,0
                    ],
                    [
                        shiftPositionVector.getX() + bbox.getX(),
                        shiftPositionVector.getY() + bbox.getY()
                    ]
                ]
            ));

            entity.setBBox(bbox);

            return;
        }

        const entityBBox: BBox = entity.getBBox();

        if (!entityBBox) {
            return;
        }

        entityBBox.getCollider().x = entity.getPosition().getX();
        entityBBox.getCollider().y = entity.getPosition().getY();
    }

    private initiateBBox(entity: Entity): void {
        if (entity instanceof Hero) {
            let bbox: CircleBBox = new CircleBBox(20, 10);
            bbox.setCollider(this.system.createCircle(
                entity.getPosition().getX() + bbox.getOffsetX(),
                entity.getPosition().getY() + bbox.getOffsetY(),
                bbox.getRadius()
            ));

            entity.setBBox(bbox);

            return;
        }

        if (entity instanceof Enemy) {
            let bbox: CircleBBox = new CircleBBox(30, 10);
            bbox.setCollider(this.system.createCircle(
                entity.getPosition().getX() + bbox.getOffsetX(),
                entity.getPosition().getY() + bbox.getOffsetY(),
                bbox.getRadius()
            ));

            entity.setBBox(bbox);

            return;
        }

        if (entity instanceof Roamer) {
            let bbox: CircleBBox = new CircleBBox(3, 0);
            bbox.setCollider(this.system.createCircle(
                entity.getPosition().getX() + bbox.getOffsetX(),
                entity.getPosition().getY() + bbox.getOffsetY(),
                bbox.getRadius()
            ));

            entity.setBBox(bbox);

            return;
        }

        if (entity instanceof Wall) {
            let bbox: LineBBox = new LineBBox(0, 0, 0, entity.getVector().getX(), entity.getVector().getY());
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

            entity.setBBox(bbox);

            return;
        }

        if (entity instanceof Bullet) {
            let bbox: LineBBox = new DynamicLineBBox(0, 0, 0, 0, 0);
            bbox.setCollider(this.system.createPolygon(
                entity.getPosition().getX() + bbox.getX(),
                entity.getPosition().getY() + bbox.getY(),
                [[0, 0], [0, 0]]
            ));

            entity.setBBox(bbox);

            return;
        }

        if (entity instanceof Grenade) {
            let bbox: CircleBBox = new CircleBBox(3, 1);
            bbox.setCollider(this.system.createCircle(
                entity.getPosition().getX() + bbox.getOffsetX(),
                entity.getPosition().getY() + bbox.getOffsetY(),
                bbox.getRadius()
            ));

            entity.setBBox(bbox);

            return;
        }
    }
}