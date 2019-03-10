import {Vector} from "../../../domain/model/Vector";

export interface ControlInterface {
    getMovingVector(): Vector;
    getRotationDir(): number;
}