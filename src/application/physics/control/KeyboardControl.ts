import {injectable} from "inversify";
import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";

type MovingKeyData = {w:number, s:number};
type RotationKeyData = {a:number, d:number};

@injectable()
export class KeyboardControl implements ControlInterface {
    private trackedKeyStatuses: any;

    private trackedKeys: string[] = ['q', 'w', 'e', 'a', 's', 'd'];
    private movingKeyData: MovingKeyData = {
        w: 0,
        // a: 90,
        s: 180,
        // d: 270
    };
    private rotationKeyData: RotationKeyData = {
        // q: 1,
        a: 1,
        // e: -1
        d: -1
    };

    constructor() {
        this.configure();
    }

    getMovingVector() {
        let vector = new Vector(0, 0);
        let keys: string[] = Object.keys(this.trackedKeyStatuses);

        for (let key of keys) {
            if (this.trackedKeyStatuses[key] === false) {
                continue;
            }
            if (!this.movingKeyData.hasOwnProperty(key)) {
                continue;
            }

            vector.addVector(Vector.createFromDirDis(this.movingKeyData[key], 1));
        }

        return vector;
    }

    getRotationDir() {
        let direction: number = 0;
        let keys: string[] = Object.keys(this.trackedKeyStatuses);

        for (let key of keys) {
            if (this.trackedKeyStatuses[key] === false) {
                continue;
            }
            if (!this.rotationKeyData.hasOwnProperty(key)) {
                continue;
            }

            direction += this.rotationKeyData[key];
        }

        return direction;
    }

    private configure(): void {
        this.trackedKeyStatuses = {};

        for (let key of this.trackedKeys) {
            this.trackedKeyStatuses[key] = false;
        }

        document.addEventListener('keydown', (event) => {
            event.preventDefault();

            if ((event.key in this.trackedKeyStatuses) === false) {
                return;
            }

            this.trackedKeyStatuses[event.key] = true;
        }, false);

        document.addEventListener('keyup', (event) => {
            event.preventDefault();

            if ((event.key in this.trackedKeyStatuses) === false) {
                return;
            }

            this.trackedKeyStatuses[event.key] = false;
        }, false);
    }
}