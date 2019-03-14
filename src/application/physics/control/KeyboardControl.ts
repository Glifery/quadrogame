import {injectable} from "inversify";
import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

type MovingKeyData = {w:number, a:number, s:number, d:number};
type RotationKeyData = {q:number, e:number};

@injectable()
export class KeyboardControl implements ControlInterface {
    private trackedKeyStatuses: any;

    private trackedKeys: string[] = ['q', 'w', 'e', 'a', 's', 'd'];
    private movingKeyData: MovingKeyData = {
        w: 90,
        a: 180,
        s: 270,
        d: 0
    };
    private rotationKeyData: RotationKeyData = {
        q: 1,
        // a: 1,
        e: -1
        // d: -1
    };

    constructor() {
        this.configure();
    }

    getMovingVector() {
        let vector: Vector = new Vector(0, 0);
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

    getRotationMoment(): Moment {
        let moment: Moment = new Moment(0);
        let keys: string[] = Object.keys(this.trackedKeyStatuses);

        for (let key of keys) {
            if (this.trackedKeyStatuses[key] === false) {
                continue;
            }
            if (!this.rotationKeyData.hasOwnProperty(key)) {
                continue;
            }

            moment.addMoment(new Moment(this.rotationKeyData[key]));
        }

        return moment;
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