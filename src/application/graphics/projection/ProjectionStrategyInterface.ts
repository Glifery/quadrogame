import {Projection} from "../../../domain/model/Projection";
import {View} from "../View";
import {Entity} from "../../../domain/model/Entity";

export interface ProjectionStrategyInterface {
    beforeCalculation(view: View): void;

    calculateProjection(entity: Entity, view: View): Projection;
}