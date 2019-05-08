import {Space} from "../../domain/model/Space";
import {Simulator} from "../physics/Simulator";

export interface SpaceFixtureInterface {
    up(space: Space, simulator: Simulator): void;
}