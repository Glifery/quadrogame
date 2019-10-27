import {injectable} from "inversify";
import {CollisionHandlerInterface} from "./CollisionHandlerInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";
import {Vector} from "../../../../domain/model/Vector";
import {BBox} from "../../../../domain/model/bbox/BBox";
import {Entity} from "../../../../domain/model/Entity";

@injectable()
export class ReactionCollisionHandler implements CollisionHandlerInterface {
    supports(collisionPair: CollisionPair): boolean {
        return (
            (collisionPair.getEntity1().getHandlerMetadata('CollisionEntityInterface').get('reaction') == true) &&
            (collisionPair.getEntity2().getHandlerMetadata('CollisionEntityInterface').get('reaction') == true)
        );
    }

    handle(collisionPair: CollisionPair, multiplier: number, simulator: Simulator): void {
        const entity: Entity = collisionPair.getEntity1();
        const anotherEntity: Entity = collisionPair.getEntity2();
        const overlap: Vector = collisionPair.getOverlap();

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
}