import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class GravityBehavior implements BehaviorInterface {
    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);

        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }

            if (anotherEntity.getBBox() == null) {
                continue;
            }

            let gravity: Vector = Vector.createFromXY(
                anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                anotherEntity.getPosition().getY() - entity.getPosition().getY(),
            );

            let gravityAssel = anotherEntity.getBBox().getMass() / Math.pow(gravity.getDis(), 2);

            gravityAssel *= 10;

            if (gravityAssel < 0.001) {
                continue;
            }

            gravity.setDis(gravityAssel);
            finalVector.addVector(gravity);
        }

        if (finalVector.getDis() > 0) {
            entity.getPosition().addVector(finalVector);
        }
    }
}