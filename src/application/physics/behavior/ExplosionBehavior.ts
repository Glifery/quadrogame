import {injectable} from "inversify";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Enemy} from "../../../domain/entity/Enemy";
import {LifetimeBehavior} from "./LifetimeBehavior";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";

@injectable()
export class ExplosionBehavior extends LifetimeBehavior{
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

            if (blastWave.getDis() > 700) {
                continue;
            }

            console.log('@@@', Math.sqrt(700 - blastWave.getDis()));
            anotherEntity.getPosition().addVector(blastWave.setDis(
                Math.pow((700 - blastWave.getDis()) / 70, 2))
            );
        }

        super.deleteEntity(entity, multiplier, simulator);
    }
}