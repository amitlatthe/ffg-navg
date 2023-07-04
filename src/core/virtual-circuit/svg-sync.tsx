
import {Element, Svg} from "@svgdotjs/svg.js";
import {arduinoComponentStateToId} from "../frames/arduino-component-id";
import {resetLed, updateLed} from "../../blocks/led/virtual-circuit";
import {ArduinoComponentState, ArduinoComponentType, ArduinoFrame} from "../frames/arduino.frames";
import _ from "lodash";


const resetComponent = {
    [ArduinoComponentType.LED]: resetLed
};

export interface ResetComponent {
    (componentEl: Element): void;
}

export interface SyncComponent {
    (
        state: ArduinoComponentState,
        componentEl: Element,
        draw: Svg,
        frame: ArduinoFrame | undefined
    ): void;
}

const syncComponent = {
    [ArduinoComponentType.LED]: updateLed,

};
export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
    frame.components
        .filter((state) => state.type !== ArduinoComponentType.TIME)
        .filter((state) => _.isFunction(syncComponent[state.type]))
        .filter(
            (state) =>
                state.type === ArduinoComponentType.MESSAGE ||
                draw.findOne("#" + arduinoComponentStateToId(state))
        )
        .map((state) => [
            state,
            syncComponent[state.type],
            draw.findOne("#" + arduinoComponentStateToId(state)),
        ])
        .forEach(
            ([state, func, compoenntEl]: [
                ArduinoComponentState,
                SyncComponent,
                Element
            ]) => {
                func(state, compoenntEl, draw,frame);
            }
        );

    //Reset all components elements that don't have state in the frame
    const componentIds = frame.components
        .filter((c) => c.type !== ArduinoComponentType.TIME)
        .map((c) => arduinoComponentStateToId(c));

    draw
        .find(".component")
        .filter((componentEl) => !componentIds.includes(componentEl.id()))
        .filter((componentEl) => _.isFunction(resetComponent[componentEl.data("component-type")]))
        .map((componentEl) => [
            componentEl,
            resetComponent[componentEl.data("component-type")],
        ])
        .forEach(([componentEl, func]: [Element, ResetComponent]) =>
            func(componentEl)
        );
};
