import {injectable} from "inversify";
import {Simulator} from "../../Simulator";
import {Vector} from "../../../../domain/model/Vector";
import {Entity} from "../../../../domain/model/Entity";
import {GlobalBehaviorInterface} from "./GlobalBehaviorInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {BBox} from "../../../../domain/model/bbox/BBox";
import {CircleBBox} from "../../../../domain/model/bbox/CircleBBox";

@injectable()
export class LegacyCollisionBehavior implements GlobalBehaviorInterface {
    initEntity(entity: Entity, simulator: Simulator): void {
    }

    deleteEntity(entity: Entity, simulator: Simulator): void {
    }

    handle(entities: Entity[], multiplier: number, simulator: Simulator): void {
        let collisionPairs: CollisionPair[] = [];

        for (let entity1 of entities) {
            const entity1BBox: BBox = entity1.getHandlerMetadata('CollisionBehavior').get('bbox');

            if (!(entity1BBox instanceof CircleBBox)) {
                continue;
            }

            const entity1BBoxPosition = Vector.createFromXY(
                entity1.getPosition().getX() + entity1BBox.getOffsetX(),
                entity1.getPosition().getY() + entity1BBox.getOffsetY()
            );

            for (let entity2 of entities) {
                if (entity2 == entity1) {
                    continue;
                }

                const entity2BBox: BBox = entity2.getHandlerMetadata('CollisionBehavior').get('bbox');

                if (!(entity2BBox instanceof CircleBBox)) {
                    continue;
                }

                const entity2BBoxPosition = Vector.createFromXY(
                    entity2.getPosition().getX() + entity2BBox.getOffsetX(),
                    entity2.getPosition().getY() + entity2BBox.getOffsetY()
                );

                const distanceFrom1to2: Vector = Vector.createFromXY(
                    entity2BBoxPosition.getX() - entity1BBoxPosition.getX(),
                    entity2BBoxPosition.getY() - entity1BBoxPosition.getY()
                );

                if (distanceFrom1to2.getDis() > (entity1BBox.getRadius() + entity2BBox.getRadius())) {
                    continue;
                }

                collisionPairs.push(new CollisionPair(entity1, entity2));
            }
        }

        for (let collisionPair of collisionPairs) {
            this.resolveCollisionForPair(collisionPair);
        }
    }

    resolveCollisionForPair(collisionPair: CollisionPair): void {
        // this.calculateByOldFormula(collisionPair.getEntity1(), collisionPair.getEntity2());
        // this.calculateByImpulseFormula(collisionPair.getEntity1(), collisionPair.getEntity2());
        this.calculateByAxisFormula(collisionPair.getEntity1(), collisionPair.getEntity2());
    }

    private calculateByAxisFormula(entity: Entity, anotherEntity: Entity) {
        const entityBBox: BBox = entity.getHandlerMetadata('CollisionBehavior').get('bbox');
        const anotherEntityBBox: BBox = anotherEntity.getHandlerMetadata('CollisionBehavior').get('bbox');

        if (!((entityBBox instanceof CircleBBox) && (anotherEntityBBox instanceof CircleBBox))) {
            return;
        }

        const entityBBoxPosition = Vector.createFromXY(
            entity.getPosition().getX() + entityBBox.getOffsetX(),
            entity.getPosition().getY() + entityBBox.getOffsetY()
        );
        const anotherEntityBBoxPosition = Vector.createFromXY(
            anotherEntity.getPosition().getX() + anotherEntityBBox.getOffsetX(),
            anotherEntity.getPosition().getY() + anotherEntityBBox.getOffsetY()
        );

        const fromEntityToAnother: Vector = Vector.createFromXY(
            anotherEntityBBoxPosition.getX() - entityBBoxPosition.getX(),
            anotherEntityBBoxPosition.getY() - entityBBoxPosition.getY()
        );

        if (fromEntityToAnother.getDis() > (entityBBox.getRadius() + anotherEntityBBox.getRadius())) {
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

        // console.log('entityAccel', entitySpeed.getDir(), entitySpeed.getDis());
        // console.log('anotherEntityAccel', anotherEntitySpeed.getDir(), anotherEntitySpeed.getDis());
        // console.log('------------------------');
    }

    // private calculateByImpulseFormula(entity: Entity, anotherEntity: Entity) {
    //     if (entity === anotherEntity) {
    //         return;
    //     }
    //
    //     if (!(anotherEntity instanceof Enemy)) {
    //         return;
    //     }
    //
    //     const relativeSpeed: Vector = Vector.createFromVector(entity.getPosition().getSpeed()).subtractVector(anotherEntity.getPosition().getSpeed());
    //     const initialImpulse: Vector = Vector.createFromVector(relativeSpeed).multiply(entity.getMass());
    //     const fromEntityToAnother: Vector = Vector.createFromXY(
    //         anotherEntity.getPosition().getX() - entity.getPosition().getX(),
    //         anotherEntity.getPosition().getY() - entity.getPosition().getY(),
    //     );
    //
    //     if (fromEntityToAnother.getDis() > 50) {
    //         return;
    //     }
    //     // console.log('initialImpulse', initialImpulse.getDir(), initialImpulse.getDis());
    //
    //     const relativeSpeedByNormal: Vector = Vector.createFromVector(relativeSpeed).getProjectionOnDir(fromEntityToAnother.getDir());
    //     const anotherEntityImpulse: Vector = Vector.createFromVector(initialImpulse).getProjectionOnDir(fromEntityToAnother.getDir());
    //
    //     if (relativeSpeedByNormal.getDis() < 0) {
    //         return;
    //     }
    //
    //     const entityImpulse: Vector = Vector.createFromVector(initialImpulse).subtractVector(anotherEntityImpulse);
    //     // console.log('entityImpulse', entityImpulse.getDir(), entityImpulse.getDis());
    //     // console.log('anotherEntityImpulse', anotherEntityImpulse.getDir(), anotherEntityImpulse.getDis());
    //     // console.log('---');
    //
    //     const entityAntiMass: number = (entity.getMass() == 0) ? 0 : 1 / entity.getMass();
    //     const anotherEntityAntiMass: number = (anotherEntity.getMass() == 0) ? 0 : 1 / anotherEntity.getMass();
    //
    //     const anotherEntitySpeed: Vector = anotherEntityImpulse.multiply(anotherEntityAntiMass);
    //     const anotherEntityAccel = anotherEntitySpeed;
    //
    //     const entitySpeed: Vector = entityImpulse.multiply(entityAntiMass);
    //     const entityAccel: Vector = entitySpeed.subtractVector(relativeSpeed);
    //
    //     // entity.getPosition().addVector(entityAccel);
    //     // anotherEntity.getPosition().addVector(anotherEntityAccel);
    //     entity.getPosition().getSpeed().addVector(entitySpeed);
    //     anotherEntity.getPosition().getSpeed().addVector(anotherEntitySpeed);
    //
    //     // console.log('entityAccel', entitySpeed.getDir(), entitySpeed.getDis());
    //     // console.log('anotherEntityAccel', anotherEntitySpeed.getDir(), anotherEntitySpeed.getDis());
    //     // console.log('------------------------');
    //
    //     const correctionPercent: number = 0.2; // 20% - 80%
    //     const slop: number = 0.01; // 0.01 - 0.1
    //
    //     const correctionDis: number = Math.max((50 - fromEntityToAnother.getDis()) - (50 - fromEntityToAnother.getDis()) * slop, 0) / (entityAntiMass + anotherEntityAntiMass) * correctionPercent;
    //     const correction1: Vector = Vector.createFromDirDis(relativeSpeedByNormal.getDir() + 180, entityAntiMass * correctionDis);
    //     const correction2: Vector = Vector.createFromDirDis(relativeSpeedByNormal.getDir(), anotherEntityAntiMass * correctionDis);
    //
    //     entity.getPosition().setXY(entity.getPosition().getX() + correction1.getX(), entity.getPosition().getY() + correction1.getY());
    //     anotherEntity.getPosition().setXY(anotherEntity.getPosition().getX() + correction2.getX(), anotherEntity.getPosition().getY() + correction2.getY());
    // }
    //
    // private calculateByOldFormula(entity: Entity, anotherEntity: Entity) {
    //     if (entity === anotherEntity) {
    //         return;
    //     }
    //
    //     if (!(anotherEntity instanceof Enemy)) {
    //         return;
    //     }
    //
    //     const fromEntityToAnother: Vector = Vector.createFromXY(
    //         anotherEntity.getPosition().getX() - entity.getPosition().getX(),
    //         anotherEntity.getPosition().getY() - entity.getPosition().getY(),
    //     );
    //     const fromEntityToAnotherDir: number = fromEntityToAnother.getDir();
    //     const fromEntityToAnotherDis: number = fromEntityToAnother.getDis();
    //
    //     // console.log('fromEntityToAnotherDis', fromEntityToAnotherDis);
    //
    //     if (fromEntityToAnotherDis > 50) {
    //         return;
    //     }
    //
    //     const relativeSpeed: Vector = Vector.createFromVector(entity.getPosition().getSpeed())
    //         .addVector(
    //             Vector.createFromVector(anotherEntity.getPosition().getSpeed()).invert()
    //         );
    //     const speedByNormal: Vector = Vector.createFromVector(relativeSpeed).getProjectionOnDir(fromEntityToAnotherDir);
    //
    //     if (speedByNormal.getDis() < 0) {
    //         return;
    //     }
    //
    //     const entityAntiMass: number = (entity.getMass() == 0) ? 0 :1 / entity.getMass();
    //     const anotherEntityAntiMass: number = (anotherEntity.getMass() == 0) ? 0 : 1 / anotherEntity.getMass();
    //
    //     let elasticity = 0.9;
    //     let j = -(1 + elasticity) * speedByNormal.getDis();
    //     j = j / (entityAntiMass + anotherEntityAntiMass);
    //
    //     let impulse1 = Vector.createFromDirDis(fromEntityToAnotherDir, entityAntiMass * j * 1);
    //     let impulse2 = Vector.createFromDirDis(fromEntityToAnotherDir + 180, anotherEntityAntiMass * j * 1);
    //
    //     entity.getPosition().addVector(impulse1);
    //     anotherEntity.getPosition().addVector(impulse2);
    //
    //     // console.log('impulse1', impulse1.getDir(), impulse1.getDis());
    //     // console.log('impulse2', impulse2.getDir(), impulse2.getDis());
    //     // console.log('-------------------');
    //
    //     const correctionPercent: number = 0.2; // 20% - 80%
    //     const slop: number = 0.01; // 0.01 - 0.1
    //
    //     const correctionDis: number = Math.max((50 - fromEntityToAnotherDis) - (50 - fromEntityToAnotherDis) * slop, 0) / (entityAntiMass + anotherEntityAntiMass) * correctionPercent;
    //     const correction1: Vector = Vector.createFromDirDis(speedByNormal.getDir() + 180, entityAntiMass * correctionDis);
    //     const correction2: Vector = Vector.createFromDirDis(speedByNormal.getDir(), anotherEntityAntiMass * correctionDis);
    //
    //     entity.getPosition().setXY(entity.getPosition().getX() + correction1.getX(), entity.getPosition().getY() + correction1.getY());
    //     anotherEntity.getPosition().setXY(anotherEntity.getPosition().getX() + correction2.getX(), anotherEntity.getPosition().getY() + correction2.getY());
    // }
}