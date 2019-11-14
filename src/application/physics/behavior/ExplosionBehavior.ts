import {injectable} from "inversify";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Enemy} from "../../../domain/entity/Enemy";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";
import {BehaviorInterface} from "./BehaviorInterface";
import {Explosion} from "../../../domain/entity/Explosion";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class ExplosionBehavior implements BehaviorInterface {
    static getName() {
        return 'explosion';
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(ExplosionBehavior.getName()) > -1;
    }

    handle(entity: TemporaryEntity, multiplier: number, simulator: Simulator): void {
        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }

            if (!(entity instanceof Explosion)) {
                throw new Error('Unable to apply ExplosionBehavior on non-Explosion unit')
            }

            if (!(anotherEntity instanceof Enemy)) {
                continue;
            }

            let blastWave: Vector = Vector.createFromXY(
                anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                anotherEntity.getPosition().getY() - entity.getPosition().getY(),
            );
            let distance: number = blastWave.getDis();

            if (distance > entity.getMaxDistance()) {
                continue;
            }

            let multiplier = Math.pow(entity.getMaxDistance() - distance, 2) / Math.pow(entity.getMaxDistance(), 2);

            anotherEntity.getPosition().addVector(blastWave.setDis(entity.getMaxBlastWave()).multiply(multiplier));
        }
    }
}