import {injectable} from "inversify";
import {CollisionHandlerInterface} from "./CollisionHandlerInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";
import {Vector} from "../../../../domain/model/Vector";
import {BBox} from "../../../../domain/model/bbox/BBox";
import {Entity} from "../../../../domain/model/Entity";
import {CollisionEntityInterface} from "../../../../domain/entity/interface/CollisionEntityInterface";
import {Bullet} from "../../../../domain/entity/Bullet";
import {Hero} from "../../../../domain/entity/Hero";

@injectable()
export class BulletCollisionHandler implements CollisionHandlerInterface {
    supports(collisionPair: CollisionPair): boolean {
        const entity1: Entity = collisionPair.getEntity1();
        const entity2: Entity = collisionPair.getEntity2();

        return (((this.isBullet(entity1) && this.isMortal(entity2))) || ((this.isBullet(entity1) && this.isMortal(entity2))));
    }

    handle(collisionPair: CollisionPair, multiplier: number, simulator: Simulator): void {
        collisionPair.getEntity1().getSpace().deleteEntity(collisionPair.getEntity1());
        collisionPair.getEntity2().getSpace().deleteEntity(collisionPair.getEntity2());
    }

    private isBullet(entity: Entity): boolean {
        return (entity instanceof Bullet);
    }

    private isMortal(entity: Entity): boolean {
        return !(entity instanceof Bullet) && !(entity instanceof Hero);
    }
}