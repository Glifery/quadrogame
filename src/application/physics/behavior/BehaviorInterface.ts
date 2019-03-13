import {Simulator} from "../Simulator";
import {Entity} from "../../../domain/model/Entity";

export interface BehaviorInterface {
    handle(entity: Entity, simulator: Simulator): void;
}