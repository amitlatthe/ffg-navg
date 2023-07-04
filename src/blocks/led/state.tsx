import {ARDUINO_PINS} from "../../core/microcontroller/selectBoard";
import {ArduinoComponentState} from "../../core/frames/arduino.frames";

export interface LedState extends ArduinoComponentState {
    pin: ARDUINO_PINS;
    state: number;
    fade: boolean;
}