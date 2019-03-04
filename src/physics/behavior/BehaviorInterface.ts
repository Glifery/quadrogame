import {Simulator} from "../Simulator";
import {Position} from "../../model/Position";

export interface BehaviorInterface {
    handle(position: Position, simulator: Simulator): void;
}