import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class DumpBehavior implements BehaviorInterface {
    handle(entity: Entity, simulator: Simulator): void {
        let vector = Vector.createFromVector(entity.getPosition().getSpeed());

        vector.invert().setDis(Math.min(vector.getDis(), 7));
        entity.getPosition().addVector(vector);

        let moment = Moment.createFromMoment(entity.getAxis().getRotation());
        let minMomentDir = Math.min(Math.abs(moment.getDir()), 5);

        if (moment.getDir() < 0) {
            minMomentDir = -minMomentDir;
        }
        moment.setDir(minMomentDir).invert();

        entity.getAxis().addMoment(moment);
    }
}