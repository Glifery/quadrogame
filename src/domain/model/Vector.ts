export class Vector {
    private x: number = 0;
    private y: number = 0;
    private dir: number = 0;
    private dis: number = 0;

    static createFromXY(x: number, y: number): Vector {
        return new Vector(x, y);
    }

    static createFromDirDis(dir: number, dis: number): Vector {
        return new Vector(0, 0).setDirDis(dir, dis);
    }

    static createFromVector(vector: Vector): Vector {
        return new Vector(vector.getX(), vector.getY());
    }

    static degToRad(deg: number): number {
        return(deg * Math.PI) / 180;
    }

    static radToDeg(rad: number): number {
        return(rad * 180) / Math.PI;
    }

    constructor(x: number, y: number) {
        this.setXY(x, y);
        this.xyToDirdis();
    }

    getX(): number {
        return this.x;
    }

    setX(x: number): Vector {
        this.x = x;
        this.xyToDirdis();

        return this;
    }

    getY(): number {
        return this.y;
    }

    setY(y: number): Vector {
        this.y = y;
        this.xyToDirdis();

        return this;
    }

    getDir(): number {
        return this.dir;
    }

    setDir(dir: number): Vector {
        this.dir = dir;
        this.dirdisToXy();

        return this;
    }

    getDis(): number {
        return this.dis;
    }

    setDis(dis: number): Vector {
        this.dis = dis;
        this.dirdisToXy();

        return this;
    }

    setXY(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        this.xyToDirdis();

        return this;
    }

    setDirDis(dir: number, dis: number): Vector {
        this.dir = dir;
        this.dis = dis;
        this.dirdisToXy();

        return this;
    }

    setVector(vector: Vector): Vector {
        this.setXY(vector.getX(), vector.getY());

        return this;
    }

    addVector(vector: Vector): Vector {
        this.setXY(this.getX() + vector.getX(), this.getY() + vector.getY());

        return this;
    }

    subtractVector(vector: Vector): Vector {
        this.setXY(this.getX() - vector.getX(), this.getY() - vector.getY());

        return this;
    }

    getProjectionOnDir(dir: number): Vector {
        let dis: number = Vector.createFromVector(this).rotate(-dir).getX();

        return Vector.createFromDirDis(dir, dis);
    }

    cutOnDir(dir: number): Vector {
        this.addVector(this.getProjectionOnDir(dir).invert());

        return this;
    }

    multiply(multiplicator: number): Vector {
        if (multiplicator === 0) {
            this.setXY(0, 0);

            return this;
        }

        this.setDis(this.getDis() * multiplicator);

        return this;
    }

    rotate(rotationDir: number): Vector {
        this.dir += rotationDir;
        this.dirdisToXy();
        this.xyToDirdis();

        return this;
    }

    clear(): Vector {
        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.dis = 0;
        this.xyToDirdis();

        return this;
    }

    invert(): Vector {
        this.x = -this.x;
        this.y = -this.y;
        this.xyToDirdis();

        return this;
    }

    /**
     * set DirDis by XY
     *
     * @returns {Vector}
     */
    private xyToDirdis(): Vector {
        if ((this.x === 0) && (this.y === 0)) {
            this.dis = 0;
        } else {
            const dis: number = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
            const dir: number = Vector.radToDeg(Math.atan2(-this.y, this.x));

            this.dis = this.roundTo(dis, 8);
            this.dir = this.roundTo(dir, 8);
        }

        return this;
    }

    /**
     * set XY by DirDis
     *
     * @returns {Vector}
     */
    private dirdisToXy(): Vector {
        if (this.dis == 0) {
            this.x = 0;
            this.y = 0;
        } else {
            const x: number = Math.cos(Vector.degToRad(this.dir)) * this.dis;
            const y: number = -Math.sin(Vector.degToRad(this.dir)) * this.dis;

            this.x = this.roundTo(x, 8);
            this.y = this.roundTo(y, 8);
        }

        return this;
    }

    private roundTo(value: number, fractionDigit: number): number {
        if (Math.round(value) === value) {
            return value;
        }

        if(Math.abs(Math.round(value) - value) < Math.pow(0.1, fractionDigit)) {
            return Math.round(value);
        }

        return value;
    }
}