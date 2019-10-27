import {injectable} from "inversify";
import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class GamepadControl implements  ControlInterface {
    private gamepadIndexes: number[];

    constructor() {
        this.configure();
    }

    private configure(): void {
        this.gamepadIndexes = [];

        for (let gamepad of navigator.getGamepads()) {
            if (gamepad && gamepad.mapping == 'standard') {
                console.log(
                    "%d: %s is found. %d buttons, %d axes.",
                    gamepad.index,
                    gamepad.id,
                    gamepad.buttons.length,
                    gamepad.axes.length
                );

                this.gamepadIndexes.push(gamepad.index);
            }
        }

        window.addEventListener('gamepadconnected', (e: any) => {
            if (e.gamepad.mapping == 'standard') {
                console.log(
                    "%d: %s is connected. %d buttons, %d axes.",
                    e.gamepad.index,
                    e.gamepad.id,
                    e.gamepad.buttons.length,
                    e.gamepad.axes.length
                );

                this.gamepadIndexes.push(e.gamepad.index);
            }
        });

        window.addEventListener('gamepaddisconnected', (e: any) => {
            console.log(
                "%d: %s is disconnected",
                e.gamepad.index, e.gamepad.id
            );

            this.gamepadIndexes.splice(this.gamepadIndexes.indexOf(e.gamepad.index), 1);
        });
    }

    getMovingVector(): Vector {
        let vector = new Vector(0, 0);

        for (let index of this.gamepadIndexes) {
            let gamepad: any = navigator.getGamepads()[index];

            vector.addVector(Vector.createFromXY(gamepad.axes[0], gamepad.axes[1]));
        }

        return vector;
    }

    getRotationMoment(): Moment {
        let moment: Moment = new Moment(0);

        for (let index of this.gamepadIndexes) {
            let gamepad: any = navigator.getGamepads()[index];

            moment.addMoment(new Moment(-gamepad.axes[2]));
        }

        return moment;
    }

    checkFireStatus(): boolean {
        return false;
    }

    checkCtrlStatus(): boolean {
        return false;
    }
}
