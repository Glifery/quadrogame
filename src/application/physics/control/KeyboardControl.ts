import {injectable} from "inversify";
import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

type MovingKeyData = {w:number, a:number, s:number, d:number};
type RotationKeyData = {q:number, e:number};

@injectable()
export class KeyboardControl implements ControlInterface {
    private keyStatuses: any;
    private keyPressedStatuses: any;
    private keyReleasedStatuses: any;
    private keyPressedImpulseStatuses: any;
    private keyWaitForReleaseStatuses: any;

    private trackedKeys: string[] = ['q', 'w', 'e', 'a', 's', 'd', ' ', 'c'];
    private movingKeyData: MovingKeyData = {
        w: 90,
        a: 180,
        s: 270,
        d: 0
    };
    private rotationKeyData: RotationKeyData = {
        q: 1,
        e: -1
    };

    constructor() {
        this.configure();
    }

    commit() {
        for (let key of this.trackedKeys) {
            this.keyPressedImpulseStatuses[key] = false;

            if ((this.keyPressedStatuses[key] === true) && (this.keyWaitForReleaseStatuses[key] === false)) {
                this.keyPressedImpulseStatuses[key] = true;
                this.keyWaitForReleaseStatuses[key] = true;
            }

            if (this.keyReleasedStatuses[key] === true) {
                this.keyWaitForReleaseStatuses[key] = false;
            }

            this.keyPressedStatuses[key] = false;
            this.keyReleasedStatuses[key] = false;
        }
    }

    getMovingVector() {
        let vector: Vector = new Vector(0, 0);
        let keys: string[] = Object.keys(this.keyStatuses);

        for (let key of keys) {
            if (this.keyStatuses[key] === false) {
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
        let keys: string[] = Object.keys(this.keyStatuses);

        for (let key of keys) {
            if (this.keyStatuses[key] === false) {
                continue;
            }
            if (!this.rotationKeyData.hasOwnProperty(key)) {
                continue;
            }

            moment.addMoment(new Moment(this.rotationKeyData[key]));
        }

        return moment;
    }

    checkFireStatus(): boolean {
        return this.keyStatuses[' '];
    }

    checkCtrlStatus(): boolean {
        return this.keyPressedImpulseStatuses['c'];
    }

    private configure(): void {
        this.keyStatuses = {};
        this.keyPressedStatuses = {};
        this.keyReleasedStatuses = {};
        this.keyPressedImpulseStatuses = {};
        this.keyWaitForReleaseStatuses = {};

        for (let key of this.trackedKeys) {
            this.keyStatuses[key] = false;
            this.keyPressedStatuses[key] = false;
            this.keyReleasedStatuses[key] = false;
            this.keyPressedImpulseStatuses[key] = false;
            this.keyWaitForReleaseStatuses[key] = false;
        }

        document.addEventListener('keydown', (event) => {
            event.preventDefault();

            if ((event.key in this.keyStatuses) === false) {
                return;
            }

            this.keyStatuses[event.key] = true;
            this.keyPressedStatuses[event.key] = true;
        }, false);

        document.addEventListener('keyup', (event) => {
            event.preventDefault();

            if ((event.key in this.keyStatuses) === false) {
                return;
            }

            this.keyStatuses[event.key] = false;
            this.keyReleasedStatuses[event.key] = true;
        }, false);
    }
}