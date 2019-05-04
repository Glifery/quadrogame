import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Enemy} from "../../../domain/entity/Enemy";

@injectable()
export class CollisionBehavior implements BehaviorInterface {
    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);

        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }

            if (!(anotherEntity instanceof Enemy)) {
                continue;
            }

            const fromEntityToAnother: Vector = Vector.createFromXY(
                anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                anotherEntity.getPosition().getY() - entity.getPosition().getY(),
            );
            const fromEntityToAnotherDir: number = fromEntityToAnother.getDir();
            const fromEntityToAnotherDis: number = fromEntityToAnother.getDis();

            if (fromEntityToAnotherDis > 50) {
                continue;
            }

            const relativeSpeed: Vector = Vector.createFromVector(entity.getPosition().getSpeed())
                .addVector(
                    Vector.createFromVector(anotherEntity.getPosition().getSpeed()).invert()
                );
            const speedByNormal: Vector = Vector.createFromVector(relativeSpeed).getProjectionOnDir(fromEntityToAnotherDir);

            if (speedByNormal.getDis() < 0) {
                return;
            }

            const entityAntiMass: number = (entity.getMass() == 0) ? 0 :1 / entity.getMass();
            const anotherEntityAntiMass: number = (anotherEntity.getMass() == 0) ? 0 : 1 / anotherEntity.getMass();

            let elasticity = 0.9;
            let j = -(1 + elasticity) * speedByNormal.getDis();
            j = j / (entityAntiMass + anotherEntityAntiMass);

            let impulse1 = Vector.createFromDirDis(fromEntityToAnotherDir, entityAntiMass * j * 2);
            let impulse2 = Vector.createFromDirDis(fromEntityToAnotherDir + 180, anotherEntityAntiMass * j * 2);

            entity.getPosition().addVector(impulse1);
            anotherEntity.getPosition().addVector(impulse2);

            const correctionPercent: number = 0.2; // 20% - 80%
            const slop: number = 0.01; // 0.01 - 0.1

            const correctionDis: number = Math.max((50 - fromEntityToAnotherDis) - (50 - fromEntityToAnotherDis) * slop, 0) / (entityAntiMass + anotherEntityAntiMass) * correctionPercent;
            const correction1: Vector = Vector.createFromDirDis(speedByNormal.getDir() + 180, entityAntiMass * correctionDis);
            const correction2: Vector = Vector.createFromDirDis(speedByNormal.getDir(), anotherEntityAntiMass * correctionDis);

            entity.getPosition().setXY(entity.getPosition().getX() + correction1.getX(), entity.getPosition().getY() + correction1.getY());
            anotherEntity.getPosition().setXY(anotherEntity.getPosition().getX() + correction2.getX(), anotherEntity.getPosition().getY() + correction2.getY());
        }
    }
}