import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";

export interface GlobalBehaviorInterface {
    initEntity(entity: Entity, simulator: Simulator): void;

    deleteEntity(entity: Entity, simulator: Simulator): void;

    handle(entities: Entity[], multiplier: number, simulator: Simulator): void;
}