import {ArduinoFrame} from "../core/frames/arduino.frames";
import {writable} from "svelte/store";

const currentFrameStore = writable<ArduinoFrame>(undefined);

export default {
    subscribe: currentFrameStore.subscribe,
    set: currentFrameStore.set,
};