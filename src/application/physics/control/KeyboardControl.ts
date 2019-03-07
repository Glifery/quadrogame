import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";

type KeyData = {direction: number, status: boolean};
type KeyStatuses = {w:KeyData, a:KeyData, s:KeyData, d:KeyData};

export class KeyboardControl implements ControlInterface {
    private keyStatuses: KeyStatuses = {
        w: {
            direction: 90,
            status: false,
        },
        a: {
            direction: 180,
            status: false,
        },
        s: {
            direction: 270,
            status: false,
        },
        d: {
            direction: 0,
            status: false,
        }
    };

    constructor() {
        this.configure();
    }

    getVector() {
        let vector = new Vector(0, 0);
        let keys = Object.keys(this.keyStatuses);

        for (let key of keys) {
            if (this.keyStatuses[key].status === false) {
                continue;
            }

            vector.addVector(Vector.createFromDirDis(this.keyStatuses[key].direction, 1));
        }

        return vector;
    }

    private configure(): void {
        let trackedKeys: string[] = ['w', 'a', 's', 'd'];

        document.addEventListener('keydown', (event) => {
            event.preventDefault();

            if ((event.key in this.keyStatuses) === false) {
                return;
            }

            this.keyStatuses[event.key].status = true;
        }, false);

        document.addEventListener('keyup', (event) => {
            event.preventDefault();

            if ((event.key in this.keyStatuses) === false) {
                return;
            }

            this.keyStatuses[event.key].status = false;
        }, false);
    }
}