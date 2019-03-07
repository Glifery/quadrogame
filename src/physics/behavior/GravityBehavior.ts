import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {ControlInterface} from "../control/ControlInterface";
import {Position} from "../../model/Position";
import {Vector} from "../../model/Vector";

@injectable()
export class GravityBehavior implements BehaviorInterface {
    handle(position: Position, simulator: Simulator): void {
        let finalVector: Vector = new Vector(0, 0);

        for (let anotherPositions of simulator.getPositions()) {
            if (position === anotherPositions) {
                continue;
            }

            let gravity: Vector = Vector.createFromXY(
                anotherPositions.getX() - position.getX(),
                anotherPositions.getY() - position.getY(),
            );

            let gravityAssel = anotherPositions.getMass() / Math.pow(gravity.getDis(), 2);

            gravityAssel *= 10;

            if (gravityAssel < 0.001) {
                continue;
            }

            gravity.setDis(gravityAssel);
            finalVector.addVector(gravity);
        }

        if (finalVector.getDis() > 0) {
            position.addVector(finalVector);
        }
    }
}