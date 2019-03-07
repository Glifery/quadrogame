import {Simulator} from "../Simulator";
import {Position} from "../../../domain/model/Position";

export interface BehaviorInterface {
    handle(position: Position, simulator: Simulator): void;
}