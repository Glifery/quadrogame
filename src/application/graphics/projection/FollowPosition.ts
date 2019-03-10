import {ProjectionStrategyInterface} from "./ProjectionStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {View} from "../View";
import {Projection} from "../../../domain/model/Projection";
import {Vector} from "../../../domain/model/Vector";
import {ControllablePosition} from "../../../domain/model/ControllablePosition";

export class FollowPosition implements ProjectionStrategyInterface {
    private followedPosition: ControllablePosition;
    private attachedX: number;
    private attachedY: number;
    private attachedDir: number;

    private shiftVector: Vector;
    private turnDir: number = 0;

    constructor(followedPosition: ControllablePosition, attachedX: number, attachedY: number, attachedDir: number) {
        this.followedPosition = followedPosition;
        this.attachedX = attachedX;
        this.attachedY = attachedY;
        this.attachedDir = attachedDir;
    }

    beforeCalculation(view: View): void {
        this.shiftVector = Vector
            .createFromXY(this.followedPosition.getX(), this.followedPosition.getY())
            .invert()
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY));
        this.turnDir = this.attachedDir - this.followedPosition.getOrientation();
    }

    calculateProjection(position: Position, view: View): Projection {
        const projectionVector: Vector = Vector
            .createFromXY(position.getX(), position.getY())
            .addVector(this.shiftVector)
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY).invert())
            .rotate(this.turnDir)
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY))

        return new Projection(projectionVector.getX(), projectionVector.getY(), this.turnDir, 1);
    }
}