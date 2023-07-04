
import {Element, Svg} from "@svgdotjs/svg.js";
import type {BreadBoardArea, MicroController} from "../microcontroller/microcontroller";
import {arduinoComponentStateToId} from "../frames/arduino-component-id";
import {showPin, takeBoardArea, takeBoardAreaWithExistingComponent} from "./wire";
import {ANALOG_PINS} from "../microcontroller/selectBoard";
import {createComponentEl} from "./svg-helpers";
import {getSvgString} from "./svg-string";
import {addDraggableEvent} from "./component-events.helpers";
import {createWiresLed, ledCreate, ledPosition} from "../../blocks/led/virtual-circuit";
import {ArduinoComponentState, ArduinoComponentType} from "../frames/arduino.frames";
import {Settings} from "../../arduinoSettings/boardSetting";

export default (
    state: ArduinoComponentState,
    draw: Svg,
    arduinoEl: Element,
    board: MicroController,
    settings: Settings
): void => {
    const id = arduinoComponentStateToId(state);
    let componentEl = draw.findOne("#" + id) as Element;
    if (componentEl && componentEl.data("holes")) {
        // make sure the area get taken
        takeBoardAreaWithExistingComponent(componentEl.data("holes").split("-"));
        // Show all the analog pins because they will turn off no matter what
        // in paint.
        state.pins
            .filter((p) => ANALOG_PINS.includes(p))
            .forEach((p) => showPin(draw, p));

        return;
    }

    // only take an area if the component does
    // not exist
    const area = takeBoardArea();

    componentEl = createComponentEl(draw, state, getSvgString(state));
    // addDraggableEvent(componentEl, arduinoEl, draw);
    (window as any)[state.type] = componentEl;
    if (area) {
        componentEl.data("holes", area.holes.join("-"));
        positionComponentHookFunc[state.type](
            state,
            componentEl,
            arduinoEl,
            draw,
            board,
            area
        );
        createWires[state.type](
            state,
            draw,
            componentEl,
            arduinoEl,
            id,
            board,
            area
        );
    }
    createComponentHookFunc[state.type](
        state,
        componentEl,
        arduinoEl,
        draw,
        board,
        settings
    );
};

const positionComponentHookFunc: {
    [key: string]: PositionComponent<ArduinoComponentState>;
} = {

    [ArduinoComponentType.LED]: ledPosition,
};

export interface PositionComponent<T extends ArduinoComponentState>  {
    (
        state: T,
        componentEl: Element,
        arduinoEl: Element,
        draw: Svg,
        board: MicroController,
        area?: BreadBoardArea
    ): void;
}

export interface CreateWire<T extends ArduinoComponentState>{
    (
        state: T,
        draw: Svg,
        component: Element,
        arduinoEl: Element,
        componentId: string,
        board: MicroController,
        area?: BreadBoardArea
    ): void;
}


const createWires: { [key: string]: CreateWire<ArduinoComponentState> } = {
    [ArduinoComponentType.LED]: createWiresLed,
};

const createComponentHookFunc: {
    [key: string]: AfterComponentCreateHook<ArduinoComponentState>;
} = {
    [ArduinoComponentType.LED]: ledCreate,

};

export interface AfterComponentCreateHook<T extends ArduinoComponentState> {
    (
        state: T,
        componentEl: Element,
        arduinoEl: Element,
        draw: Svg,
        board: MicroController,
        settings: Settings
): void;
}