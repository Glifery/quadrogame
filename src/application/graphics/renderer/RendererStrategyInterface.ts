import {Representation} from "../../../domain/model/Representation";
import {Entity} from "../../../domain/model/Entity";

export interface RendererStrategyInterface {
    initiateRepresentation(entity: Entity): void;

    renderEntity(representation: Representation): void;
}