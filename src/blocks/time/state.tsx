import {ArduinoComponentState} from "../../core/frames/arduino.frames";
import {Sensor} from "../../core/blockly/dto/sensor.type";

export interface TimeState extends ArduinoComponentState {
    timeInSeconds: number;
}
export interface TimeSensor extends Sensor {
    time_in_seconds: number;
}
