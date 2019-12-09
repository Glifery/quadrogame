import {injectable} from "inversify";
import {ControlInterface} from "./ControlInterface";
import {Vector} from "../../../domain/model/Vector";
import {Moment} from "../../../domain/model/Moment";

@injectable()
export class GamepadControl implements  ControlInterface {
    static BUTTON_A: number = 0;
    static BUTTON_B: number = 1;
    static BUTTON_X: number = 2;
    static BUTTON_Y: number = 3;
    static BUTTON_TRIGGER_L1: number = 4;
    static BUTTON_TRIGGER_R1: number = 5;
    static BUTTON_TRIGGER_L2: number = 6;
    static BUTTON_TRIGGER_R2: number = 7;
    static BUTTON_SELECT: number = 8;
    static BUTTON_START: number = 9;
    static BUTTON_CROSS_L: number = 14;
    static BUTTON_CROSS_R: number = 15;
    static BUTTON_CROSS_U: number = 12;
    static BUTTON_CROSS_D: number = 13;

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

    commit() {}

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
        for (let index of this.gamepadIndexes) {
            let gamepad: any = navigator.getGamepads()[index];

            if (gamepad.buttons[GamepadControl.BUTTON_TRIGGER_R1].pressed == true) {
                return true;
            }

            // for (let buttonIndex: any = 0; buttonIndex < gamepad.buttons.length; buttonIndex++) {
            //     let gamepadButton: any = gamepad.buttons[buttonIndex];
            //
            //     if (gamepadButton.pressed == true) {
            //         console.log('dddd', buttonIndex, gamepadButton);
            //     }
            // }
        }

        return false;
    }

    checkCtrlStatus(): boolean {
        for (let index of this.gamepadIndexes) {
            let gamepad: any = navigator.getGamepads()[index];

            if (gamepad.buttons[GamepadControl.BUTTON_TRIGGER_L1].pressed == true) {
                return true;
            }
        }

        return false;
    }
}
