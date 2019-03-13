import {Projection} from "../../../domain/model/Projection";
import {Entity} from "../../../domain/model/Entity";

export interface RendererStrategyInterface {
    renderEntity(entity: Entity, projection: Projection, graphicElement: any): void;
}