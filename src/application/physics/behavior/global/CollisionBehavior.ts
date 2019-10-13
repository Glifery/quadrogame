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

@injectable()
export class CollisionBehavior implements GlobalBehaviorInterface {
    private system: Collisions;
    private result: Result;

    constructor() {
        this.system = new Collisions();
        this.result = this.system.createResult();
    }

    initiateEntity(entity: Entity, simulator: Simulator): void {
        this.initiateBBox(entity);
    }

    handle(entities: Entity[], multiplier: number, simulator: Simulator): void {
        let collisionPairs: CollisionPair[] = [];

        for (let entity1 of entities) {
            const entity1BBox: BBox = entity1.getBBox();

            if (!entity1BBox) {
                continue;
            }

            entity1BBox.getCollider().x = entity1.getPosition().getX();
            entity1BBox.getCollider().y = entity1.getPosition().getY();

            for (let entity2 of entities) {
                if (entity2 == entity1) {
                    break;
                }

                const entity2BBox: BBox = entity2.getBBox();

                if (!entity2BBox) {
                    continue;
                }

                entity2BBox.getCollider().x = entity2.getPosition().getX();
                entity2BBox.getCollider().y = entity2.getPosition().getY();

                if (entity1BBox.getCollider().collides(entity2BBox.getCollider(), this.result)) {
                    collisionPairs.push(new CollisionPair(entity1, entity2, new Vector(
                        this.result.overlap * this.result.overlap_x,
                        this.result.overlap * this.result.overlap_y
                    )));
                }
            }
        }

        for (let collisionPair of collisionPairs) {
            this.resolveCollisionForPair(collisionPair);
        }
    }

    resolveCollisionForPair(collisionPair: CollisionPair): void {
        this.calculateByAxisFormula(collisionPair.getEntity1(), collisionPair.getEntity2(), collisionPair.getOverlap());
    }

    private calculateByAxisFormula(entity: Entity, anotherEntity: Entity, overlap: Vector) {
        const entityBBox: BBox = entity.getBBox();
        const anotherEntityBBox: BBox = anotherEntity.getBBox();

        const fromEntityToAnother: Vector = Vector.createFromVector(overlap);

        if (fromEntityToAnother.getDis() == 0) {
            return;
        }

        const relativeSpeed: Vector = Vector.createFromVector(entity.getPosition().getSpeed()).subtractVector(anotherEntity.getPosition().getSpeed());
        const relativeSpeedByNormal: Vector = Vector.createFromVector(relativeSpeed).getProjectionOnDir(fromEntityToAnother.getDir());

        if (relativeSpeedByNormal.getDis() < 0) {
            return;
        }

        const relativeSpeedExtra: Vector = Vector.createFromVector(relativeSpeed).subtractVector(relativeSpeedByNormal);

        let entityNormalSpeedScalar;
        let anotherEntityNormalSpeedScalar;

        if (anotherEntityBBox.getMass() == 0) {
            entityNormalSpeedScalar = -relativeSpeedByNormal.getDis();
            anotherEntityNormalSpeedScalar = 0;
        } else if (entityBBox.getMass() == 0) {
            entityNormalSpeedScalar = relativeSpeedByNormal.getDis();
            anotherEntityNormalSpeedScalar = relativeSpeedByNormal.getDis() * 2;
        } else {
            entityNormalSpeedScalar = ((entityBBox.getMass() - anotherEntityBBox.getMass()) * relativeSpeedByNormal.getDis()) / (entityBBox.getMass() + anotherEntityBBox.getMass());
            anotherEntityNormalSpeedScalar = (2 * entityBBox.getMass() * relativeSpeedByNormal.getDis()) / (entityBBox.getMass() + anotherEntityBBox.getMass());
        }

        const entityNormalSpeed = Vector.createFromDirDis(fromEntityToAnother.getDir(), entityNormalSpeedScalar);
        const anotherEntityNormalSpeed = Vector.createFromDirDis(fromEntityToAnother.getDir(), anotherEntityNormalSpeedScalar);

        const entitySpeed = Vector.createFromVector(entityNormalSpeed).addVector(relativeSpeedExtra).subtractVector(relativeSpeed);
        const anotherEntitySpeed = anotherEntityNormalSpeed;

        entity.getPosition().getSpeed().addVector(entitySpeed);
        anotherEntity.getPosition().getSpeed().addVector(anotherEntitySpeed);
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
    }
}