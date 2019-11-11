import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

@injectable()
export class NullBehavior implements BehaviorInterface {
    static getName() {
        return 'null';
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(NullBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        entity.getPosition().addVector(Vector.createFromXY(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        ));
    }
}