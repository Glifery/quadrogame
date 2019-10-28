import {injectable} from "inversify";
import {CollisionHandlerInterface} from "./CollisionHandlerInterface";
import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";
import {Hero} from "../../../../domain/entity/Hero";
import {SimpleOsd} from "../../../graphics/osd/SimpleOsd";

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

        const armor = entity.getArmor();

        this.simpleOcd.setEntity(entity);

        bullet.getSpace().deleteEntity(bullet);
        armor.decreaseHealth(10 - armor.getArmor());

        console.log(armor.getHealth());
        if (armor.getHealth() <= 0) {
            this.simpleOcd.setEntity(null);
            entity.getSpace().deleteEntity(entity);
        }
    }

    private isBullet(entity: Entity): boolean {
        return (entity.getHandlerMetadata('CollisionBehavior').get('bullet') == true);
    }

    private isMortal(entity: Entity): boolean {
        return !(entity.getHandlerMetadata('CollisionBehavior').get('bullet') == true) && !(entity instanceof Hero);
    }
}