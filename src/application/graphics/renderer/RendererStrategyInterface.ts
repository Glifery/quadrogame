import {Representation} from "../../../domain/model/Representation";
import {Entity} from "../../../domain/model/Entity";

export interface RendererStrategyInterface {
    initiateRenderer(entity: Entity): void;

    deleteRenderer(entity: Entity): void;

    rerenderEntity(representation: Representation): void;

    finalizeRender(): void;
}