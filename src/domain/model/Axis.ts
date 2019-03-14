import {Moment} from "./Moment";

export class Axis {
    private orientation: number;
    private accel: Moment;
    private rotation: Moment;
    private moments: Moment[];

    constructor(orientation: number) {
        this.orientation = orientation;
        this.rotation = new Moment(0);
        this.accel = new Moment(0);
        this.moments = [];

        this.normalizeDorientation();
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
        this.normalizeDorientation();

        return this;
    }

    setOrientation(orientation: number): Axis {
        this.orientation = orientation;
        this.normalizeDorientation();

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

    getMoments(): Moment[] {
        return this.moments;
    }

    addMoment(moment: Moment): Axis {
        this.moments.push(moment);

        return this;
    }

    clearMoments(): Axis {
        this.moments = [];

        return this;
    }

    private normalizeDorientation() {
        while (this.orientation < 0) {
            this.orientation += 360;
        }

        while (this.orientation >= 360) {
            this.orientation -= 360;
        }
    }
}