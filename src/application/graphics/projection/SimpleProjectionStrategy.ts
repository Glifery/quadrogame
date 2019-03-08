import {ProjectionStrategyInterface} from "./ProjectionStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {View} from "../View";
import {Projection} from "../../../domain/model/Projection";

export class SimpleProjectionStrategy implements ProjectionStrategyInterface {
    beforeCalculation(view: View): void {}

    calculateProjection(position: Position, view: View): Projection {
        return new Projection(position.getX(), position.getY(), 0, 1);
    }
}