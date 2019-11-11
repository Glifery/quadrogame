import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

export interface ControlInterface {
    commit(): void;
    getMovingVector(): Vector;
    getRotationMoment(): Moment;
    checkFireStatus(): boolean;
    checkCtrlStatus(): boolean;
}