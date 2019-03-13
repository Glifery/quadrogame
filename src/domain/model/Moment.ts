export class Moment {
    private dir = 0;

    constructor(dir: number) {
        this.dir = dir;
        this.normalizeDir();
    }

    setDir(dir: number): Moment {
        this.dir = dir;
        this.normalizeDir();

        return this;
    }

    addDir(dir: number): Moment {
        this.dir += dir;
        this.normalizeDir();

        return this;
    }

    getDir(): number {
        return this.dir;
    }

    private normalizeDir() {
        while (this.dir < 0) {
            this.dir += 360;
        }

        while (this.dir >= 360) {
            this.dir -= 360;
        }
    }
}