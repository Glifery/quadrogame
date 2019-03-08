import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {Projection} from "../../../domain/model/Projection";

export class SimpleRendererStrategy implements RendererStrategyInterface {
    renderPosition(position: Position, projection: Projection, graphicElement: any): void {
        graphicElement.attr({
            type: "circle",
            cx: projection.getX(),
            cy: projection.getY(),
            r: (3 + (position.getMass() / 100)) * projection.getScale(),
            fill: 'red'
        });
    }
}