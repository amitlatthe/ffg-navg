import {ArduinoComponentState, ArduinoComponentType} from "./arduino.frames";
import _ from "lodash";

export interface ComponentStateToId {
    (state: ArduinoComponentState): string;
}

const genericSingleComponentId = (state: ArduinoComponentState) => {
    return state.type + '_' + state.pins.sort().join('-');
};

const componentStateFuncs: { [key: string]: ComponentStateToId } = {

    [ArduinoComponentType.LED]: genericSingleComponentId,
    [ArduinoComponentType.TIME]: genericSingleComponentId,
};

export const arduinoComponentStateToId = (
    state: ArduinoComponentState
): string => {
    if (_.isFunction(componentStateFuncs[state.type])) {
        return componentStateFuncs[state.type](state);
    }

    throw new Error('No Id generator found for state type ' + state.type);
};