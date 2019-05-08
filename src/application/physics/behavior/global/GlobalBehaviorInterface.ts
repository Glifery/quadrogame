import {Simulator} from "../../Simulator";
import {Entity} from "../../../../domain/model/Entity";

export interface GlobalBehaviorInterface {
    handle(entities: Entity[], multiplier: number, simulator: Simulator): void;
}