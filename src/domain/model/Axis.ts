import {Moment} from "./Moment";

export class Axis {
    private orientation: number;
    private rotation: Moment;
    private accel: Moment;

    constructor(orientation: number) {
        this.orientation = orientation;
        this.rotation = new Moment(0);
        this.accel = new Moment(0);
    }

    getOrientation(): number {
        return this.orientation;
    }

    getRotation(): Moment {
        return this.rotation;
    }

    getAccel(): Moment {
        return this.accel;
    }

    addOrientation(orientation: number): Axis {
        this.orientation += orientation;

        return this;
    }

    setOrientation(orientation: number): Axis {
        this.orientation = orientation;

        return this;
    }

    setRotation(rotation: Moment): Axis {
        this.rotation = rotation;

        return this;
    }

    setAccel(accel: Moment): Axis {
        this.accel = accel;

        return this;
    }
}