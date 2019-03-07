import {Projection} from "../../../domain/model/Projection";
import {Position} from "../../../domain/model/Position";
import {View} from "../View";

export interface ProjectionStrategyInterface {
    calculateProjection(position: Position, view: View): Projection;
}