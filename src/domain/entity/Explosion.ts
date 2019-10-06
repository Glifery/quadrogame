import {TemporaryEntity} from "./TemporaryEntity";

export class Explosion extends TemporaryEntity {
    private maxDistance: number;
    private maxBlastWave: number;

    setMaxDistance(maxDistance: number): Explosion {
        this.maxDistance = maxDistance;

        return this;
    }

    getMaxDistance(): number {
        return this.maxDistance;
    }

    setMaxBlastWave(maxBlastWave: number): Explosion {
        this.maxBlastWave = maxBlastWave;

        return this;
    }

    getMaxBlastWave(): number {
        return this.maxBlastWave;
    }
}