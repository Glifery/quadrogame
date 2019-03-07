import {Position} from "./Position";

export class Space {
    private positions: Position[] = [];

    addPosition(position: Position): Space {
        this.positions.push(position);

        return this;
    }

    getPositions(): Position[] {
        return this.positions;
    }
}