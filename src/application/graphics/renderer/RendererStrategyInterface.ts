import {Position} from "../../../domain/model/Position";
import {Projection} from "../../../domain/model/Projection";

export interface RendererStrategyInterface {
    renderPosition(position: Position, projection: Projection, graphicElement: any): void;
}