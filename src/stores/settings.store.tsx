import {defaultSetting, Settings} from "../arduinoSettings/boardSetting";
import {MicroControllerType} from "../core/microcontroller/microcontroller";
import {writable} from "svelte/store";

let settings = defaultSetting
settings['boardType'] = settings.boardType || MicroControllerType.ARDUINO_UNO;

const settingsStore = writable<Settings>(settings);

export default {
    subscribe: settingsStore.subscribe,
    set: settingsStore.set,
    update: settingsStore.update,
};
