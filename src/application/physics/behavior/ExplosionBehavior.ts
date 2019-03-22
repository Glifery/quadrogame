import {injectable} from "inversify";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Enemy} from "../../../domain/entity/Enemy";
import {LifetimeBehavior} from "./LifetimeBehavior";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";

@injectable()
export class ExplosionBehavior extends LifetimeBehavior{
    static readonly maxBlastWave = 7000;
    static readonly maxDistance = 500;

    protected deleteEntity(entity: TemporaryEntity, multiplier: number, simulator: Simulator) {
        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }

            if (!(anotherEntity instanceof Enemy)) {
                continue;
            }

            let blastWave: Vector = Vector.createFromXY(
                anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                anotherEntity.getPosition().getY() - entity.getPosition().getY(),
            );
            let distance: number = blastWave.getDis();

            if (distance > ExplosionBehavior.maxDistance) {
                continue;
            }

            let multiplier = Math.pow(ExplosionBehavior.maxDistance - distance, 2) / Math.pow(ExplosionBehavior.maxDistance, 2);

            anotherEntity.getPosition().addVector(blastWave.setDis(ExplosionBehavior.maxBlastWave).multiply(multiplier));
        }

        super.deleteEntity(entity, multiplier, simulator);
    }
}