import {Representation} from "../../../domain/model/Representation";

export interface RendererStrategyInterface {
    renderEntity(representation: Representation): void;
}