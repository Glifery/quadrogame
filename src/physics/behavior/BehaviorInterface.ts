import {Simulator} from "../Simulator";

export interface BehaviorInterface {
    handle(object: Object, simulator: Simulator);
}