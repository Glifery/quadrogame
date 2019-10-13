import {CollisionPair} from "../../../../domain/model/CollisionPair";
import {Simulator} from "../../Simulator";

export interface CollisionHandlerInterface {
    supports(collisionPair: CollisionPair): boolean;

    handle(collisionPair: CollisionPair, multiplier: number, simulator: Simulator): void;
}