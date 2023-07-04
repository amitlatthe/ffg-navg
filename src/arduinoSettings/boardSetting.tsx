import {MicroControllerType} from "../core/microcontroller/microcontroller";

export interface Settings {
    backgroundColor: string;
    touchSkinColor: string;
    ledColor: string;
    customLedColor: boolean;
    maxTimePerMove: number;
    boardType: MicroControllerType;
}
export const defaultSetting: Settings = {
    backgroundColor: '#d9e4ec',
    touchSkinColor: '#a424d3',
    ledColor: '#AA0000',
    customLedColor: false,
    maxTimePerMove: 20,
    boardType: MicroControllerType.ARDUINO_UNO,
};