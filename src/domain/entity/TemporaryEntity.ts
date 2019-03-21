import {Entity} from "../model/Entity";

export class TemporaryEntity extends Entity {
    private lifetime: number = 0;
    private maxLifetime: number;

    getLifetime(): number {
        return this.lifetime;
    }

    addLifetime(lifetime: number): TemporaryEntity {
        this.lifetime += lifetime;

        return this;
    }

    getMaxLifetime(): number {
        return this.maxLifetime;
    }

    setMaxLifetime(maxLifetime: number): TemporaryEntity {
        this.maxLifetime = maxLifetime;

        return this;
    }
}