import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";

export interface GlobalBehaviorInterface {
    initiateEntity(entity: Entity, simulator: Simulator): void;

    handle(entities: Entity[], multiplier: number, simulator: Simulator): void;
}