import {injectable} from "inversify";
import {CollisionHandlerInterface} from "./CollisionHandlerInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";
import {Hero} from "../../../../domain/entity/Hero";
import {Weapon} from "../../../../domain/game/Weapon";
import {Unit} from "../../../../domain/entity/Unit";
import {EnemyOsd} from "../../../graphics/osd/EnemyOsd";

@injectable()
export class BulletCollisionHandler implements CollisionHandlerInterface {
    private enemyOsd: EnemyOsd;

    constructor() {
        this.enemyOsd = new EnemyOsd(
            null,
            300, 100, 20, 0
        ).startRendering(10);
    }

    supports(collisionPair: CollisionPair): boolean {
        const entity1: Entity = collisionPair.getEntity1();
        const entity2: Entity = collisionPair.getEntity2();

        return this.isBullet(entity1) || this.isBullet(entity2);

        // return (((this.isBullet(entity1) && this.isMortal(entity2))) || ((this.isBullet(entity1) && this.isMortal(entity2))));
    }

    handle(collisionPair: CollisionPair, multiplier: number, simulator: Simulator): void {
        let bullet: Entity;
        let entity: Entity;

        if (this.isBullet(collisionPair.getEntity1())) {
            bullet = collisionPair.getEntity1();
            entity = collisionPair.getEntity2();
        } else {
            bullet = collisionPair.getEntity2();
            entity = collisionPair.getEntity1();
        }

        if (!(entity instanceof Unit)) {
            bullet.getSpace().deleteEntity(bullet);

            return;
        }

        const armor = entity.getArmor();

        if (!(entity instanceof Hero)) {
            this.enemyOsd.resetEntity(entity);
        }

        bullet.getSpace().deleteEntity(bullet);
        armor.decreaseHealth(this.getDamage(bullet) - armor.getArmor());

        if (armor.getHealth() <= 0) {
            this.enemyOsd.resetEntity();
            entity.getSpace().deleteEntity(entity);
        }
    }

    private isBullet(entity: Entity): boolean {
        return (entity.getHandlerMetadata('CollisionBehavior').get('bullet') == true);
    }

    private isMortal(entity: Entity): boolean {
        return (!(entity.getHandlerMetadata('CollisionBehavior').get('bullet') == true)) && (entity instanceof Unit);
    }

    private getDamage(bullet: Entity): number {
        let weapon: Weapon = bullet.getHandlerMetadata('CollisionBehavior').get('weapon');

        return weapon.getDamage();
    }
}