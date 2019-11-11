import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {BBox} from "../../../domain/model/bbox/BBox";

@injectable()
export class GravityBehavior implements BehaviorInterface {
    static getName() {
        return 'gravity';
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(GravityBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);

        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }

            const anotherEntityBBox: BBox = anotherEntity.getHandlerMetadata('CollisionBehavior').get('bbox');

            if (anotherEntityBBox == null) {
                continue;
            }

            let gravity: Vector = Vector.createFromXY(
                anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                anotherEntity.getPosition().getY() - entity.getPosition().getY(),
            );

            let gravityAssel = anotherEntityBBox.getMass() / Math.pow(gravity.getDis(), 2);

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