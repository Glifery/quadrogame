import {ProjectionStrategyInterface} from "./ProjectionStrategyInterface";
import {View} from "../View";
import {Projection} from "../../../domain/model/Projection";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";

export class FollowEntity implements ProjectionStrategyInterface {
    private followedEntity: Entity;
    private attachedX: number;
    private attachedY: number;
    private attachedDir: number;

    private shiftVector: Vector;
    private turnDir: number = 0;

    constructor(followedEntity: Entity, attachedX: number, attachedY: number, attachedDir: number) {
        this.followedEntity = followedEntity;
        this.attachedX = attachedX;
        this.attachedY = attachedY;
        this.attachedDir = attachedDir;
    }

    beforeCalculation(view: View): void {
        this.shiftVector = Vector
            .createFromXY(this.followedEntity.getPosition().getX(), this.followedEntity.getPosition().getY())
            .invert()
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY));
        this.turnDir = this.attachedDir - this.followedEntity.getAxis().getOrientation();
    }

    calculateProjection(entity: Entity, view: View): Projection {
        const projectionVector: Vector = Vector
            .createFromXY(entity.getPosition().getX(), entity.getPosition().getY())
            .addVector(this.shiftVector)
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY).invert())
            .rotate(this.turnDir)
            .addVector(Vector.createFromXY(this.attachedX, this.attachedY))
        ;

        return new Projection(projectionVector.getX(), projectionVector.getY(), this.turnDir, 1);
    }
}