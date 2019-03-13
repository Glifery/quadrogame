import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {Projection} from "../../../domain/model/Projection";
import {Entity} from "../../../domain/model/Entity";

export class SimpleRendererStrategy implements RendererStrategyInterface {
    renderEntity(entity: Entity, projection: Projection, graphicElement: any): void {
        graphicElement.attr({
            type: "circle",
            cx: projection.getX(),
            cy: projection.getY(),
            r: (3 + (entity.getMass() / 100)) * projection.getScale(),
            fill: 'red'
        });
    }
}