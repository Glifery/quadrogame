export class Moment {
    private dir = 0;

    static createFromMoment(moment: Moment): Moment {
        return new Moment(moment.getDir());
    }

    constructor(dir: number) {
        this.dir = dir;
    }

    setDir(dir: number): Moment {
        this.dir = dir;

        return this;
    }

    addDir(dir: number): Moment {
        this.dir += dir;

        return this;
    }

    getDir(): number {
        return this.dir;
    }

    addMoment(moment: Moment): Moment {
        this.dir += moment.getDir();

        return this;
    }

    multiply(multiplicator: number): Moment {
        this.dir *= multiplicator;

        return this;
    }

    invert(): Moment {
        this.dir = -this.dir;

        return this;
    }
}