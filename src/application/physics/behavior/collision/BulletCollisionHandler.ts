import {injectable} from "inversify";
import {CollisionHandlerInterface} from "./CollisionHandlerInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";
import {Hero} from "../../../../domain/entity/Hero";
import {SimpleOsd} from "../../../graphics/osd/SimpleOsd";
import {Weapon} from "../../../../domain/game/Weapon";
import {Unit} from "../../../../domain/entity/Unit";

@injectable()
export class BulletCollisionHandler implements CollisionHandlerInterface {
    private simpleOcd: SimpleOsd = new SimpleOsd(
        null,
        300, 100, 10, 0
    );

    constructor() {
        this.simpleOcd.startRendering(10);
    }

    supports(collisionPair: CollisionPair): boolean {
        const entity1: Entity = collisionPair.getEntity1();
        const entity2: Entity = collisionPair.getEntity2();

        return (((this.isBullet(entity1) && this.isMortal(entity2))) || ((this.isBullet(entity1) && this.isMortal(entity2))));
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
            return;
        }

        const armor = entity.getArmor();

        this.simpleOcd.setEntity(entity);

        bullet.getSpace().deleteEntity(bullet);
        armor.decreaseHealth(this.getDamage(bullet) - armor.getArmor());

        if (armor.getHealth() <= 0) {
            this.simpleOcd.setEntity(null);
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