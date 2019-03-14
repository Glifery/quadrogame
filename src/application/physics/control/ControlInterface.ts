import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

export interface ControlInterface {
    getMovingVector(): Vector;
    getRotationMoment(): Moment;
}