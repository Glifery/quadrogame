import {Entity} from "../../../domain/model/Entity";
import {AbstractOsd} from "./AbstractOsd";

export abstract class EntityRelatedOsd extends AbstractOsd {
    protected entity: Entity;

    constructor(entity: Entity, width: number, height: number, offsetX: number, offsetY: number, zIndex: number = 0) {
        super(width, height, offsetX, offsetY, zIndex);

        this.entity = entity;
    }

    resetEntity(entity: Entity = null): this {
        this.entity = entity;

        return this;
    }
}