import {MicroControllerType} from "../core/microcontroller/microcontroller";
import {ArduinoFrameContainer} from "../core/frames/arduino.frames";
import {writable} from "svelte/store";

const stateStore = writable<ArduinoFrameContainer>({
    frames: [],
    board: MicroControllerType.ARDUINO_UNO,
    error: false,
    settings: null,
});

export default {
    subscribe: stateStore.subscribe,
    set: stateStore.set,
    update: stateStore.update,
};