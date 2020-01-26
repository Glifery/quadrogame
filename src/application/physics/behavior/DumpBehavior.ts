import {injectable} from "inversify";
import {BehaviorInterface} from "./BehaviorInterface";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Entity} from "../../../domain/model/Entity";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class DumpBehavior implements BehaviorInterface {
    static getName() {
        return 'dump';
    }

    static readonly movementFriction = 350;
    static readonly rotationFriction = 150;

    public supports(entity: Entity): boolean {
        let supportedBehaviors: string[] = entity.getHandlerMetadata('simulator').get('entity_behaviors');

        return supportedBehaviors && supportedBehaviors.indexOf(DumpBehavior.getName()) > -1;
    }

    handle(entity: Entity, multiplier: number, simulator: Simulator): void {
        const frictionVector = Vector.createFromVector(entity.getPosition().getSpeed());

        for (let vector of entity.getPosition().getVectors()) {
            frictionVector.addVector(vector);
        }
        frictionVector.invert();

        if (entity.getPosition().getSpeed().getDis() > 0) {
            frictionVector.setDis(Math.min(
                frictionVector.getDis() / multiplier,     //speed for stop immediately
                DumpBehavior.movementFriction             //friction limit
            ));
            entity.getPosition().addVector(frictionVector);
        }

        let frictionMoment = Moment.createFromMoment(entity.getAxis().getRotation()).invert();

        if (entity.getAxis().getRotation().getDir() > 0) {
            frictionMoment.setDir(Math.max(
                frictionMoment.getDir() / multiplier,     //speed for stop immediately
                - DumpBehavior.rotationFriction           //friction limit
            ));
            entity.getAxis().addMoment(frictionMoment);
        } else if (entity.getAxis().getRotation().getDir() < 0) {
            frictionMoment.setDir(Math.min(
                frictionMoment.getDir() / multiplier,     //speed for stop immediately
                DumpBehavior.rotationFriction             //friction limit
            ));
            entity.getAxis().addMoment(frictionMoment);
        }

        return;
    }
}