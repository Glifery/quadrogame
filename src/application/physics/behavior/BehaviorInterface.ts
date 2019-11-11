import {Simulator} from "../Simulator";
import {Entity} from "../../../domain/model/Entity";

export interface BehaviorInterface {
    supports(entity: Entity): boolean;
    handle(entity: Entity, multiplier: number, simulator: Simulator): void;
}