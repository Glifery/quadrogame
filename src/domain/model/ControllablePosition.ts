import {Position} from "./Position";

export class ControllablePosition extends Position {
    protected orientation: number;

    constructor(x: number, y: number, mass: number, dir: number = 0) {
        super(x, y, mass, dir);

        this.orientation = 0;
    }

    getOrientation(): number {
        return this.orientation;
    }

    setOrientation(orientation: number): ControllablePosition {
        this.orientation = orientation;

        return this;
    }

    addOrientation(orientation: number): ControllablePosition {
        this.orientation += orientation;

        return this;
    }
}