import {ProjectionStrategyInterface} from "./ProjectionStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {View} from "../View";
import {Projection} from "../../../domain/model/Projection";
import {Entity} from "../../../domain/model/Entity";

export class SimpleProjectionStrategy implements ProjectionStrategyInterface {
    beforeCalculation(view: View): void {}

    calculateProjection(entity: Entity, view: View): Projection {
        return new Projection(entity.getPosition().getX(), entity.getPosition().getY(), 0, 1);
    }
}