import {Space} from "../../domain/model/Space";

export interface SpaceFixtureInterface {
    up(space: Space): void;
}