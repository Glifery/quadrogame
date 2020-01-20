import {LifetimeBehavior} from "./LifetimeBehavior";
import {Simulator} from "../Simulator";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";
import {Explosion} from "../../../domain/entity/Explosion";
import {inject, injectable} from "inversify";
import {ExplosionBehavior} from "./ExplosionBehavior";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class ExplodeOnLifetimeBehavior extends LifetimeBehavior {
    static getName() {
        return 'explode_on_lifetime';
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(ExplodeOnLifetimeBehavior.getName()) > -1;
    }

    protected deleteEntity(entity: TemporaryEntity, multiplier: number, simulator: Simulator): void {
        let explosion: Explosion = new Explosion(entity.getPosition().getX(), entity.getPosition().getY());

        explosion.setMaxLifetime(0.4);
        explosion.setMaxDistance(300);
        explosion.setMaxBlastWave(1300);

        entity.getSpace().addEntity(explosion);

        super.deleteEntity(entity, multiplier, simulator);
    }
}