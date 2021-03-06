import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Entity} from "../../../domain/model/Entity";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";

@injectable()
export class LifetimeBehavior implements BehaviorInterface {
    static getName() {
        return 'lifetime';
    }

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(LifetimeBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        if (!(entity instanceof TemporaryEntity)) {
            throw new Error('Unable to append LifetimeBehavior to not TemporaryEntity');
        }

        if (entity.getLifetime() >= entity.getMaxLifetime()) {
            this.deleteEntity(entity, multiplier, simulator);
        } else {
            entity.addLifetime(multiplier);
        }
    }

    protected deleteEntity(entity: TemporaryEntity, multiplier: number, simulator: Simulator): void {
        entity.getSpace().deleteEntity(entity);
    }
}