import type { Element, Svg } from "@svgdotjs/svg.js";

import {arduinoComponentStateToId} from "../frames/arduino-component-id";
import { Line } from "@svgdotjs/svg.js";
import {ArduinoComponentState} from "../frames/arduino.frames";

export const createComponentEl = (
    draw: Svg,
    state: ArduinoComponentState,
    svgText: string
) => {
    const componentEl = draw.svg(svgText).last();
    componentEl.addClass("component");
    componentEl.attr("id", arduinoComponentStateToId(state));
    componentEl.data("component-type", state.type);
    (componentEl as Svg).viewbox(0, 0, componentEl.width() as number, componentEl.height() as number);

    return componentEl;
};
export const findMicronControllerEl = (draw: Svg): Element => {
    return draw.findOne("#microcontroller_main_svg") as Element | Svg;
};

export const findSvgElement = (
    id: string,
    draw: Svg | Element
): Svg | Element => {
    return draw.findOne("#" + id) as Svg|Element;
};

export const findComponentConnection = (
    element: Element,
    connectionId: string
) => {
    const connection = findSvgElement(connectionId, element);

    return {
        x: (connection.cx() as number) + (element.x() as number),
        y: (connection.y() as number) + (connection.height() as number) + (element.y() as number),
    };
};

export const findArduinoConnectionCenter = (
    element: Element,
    connectionId: string
) => {
    const connection = findSvgElement(connectionId, element);

    if (connection instanceof Line) {
        return {
            x: (connection.cx() as number) + (element.x() as number),
            y: (connection.plot()[0][1] as number) + (element.y() as number),
        };
    }

    return {
        x: (connection.cx() as number) + (element.x() as number),
        y: (connection.cy() as number) + (element.y() as number),
    };
};

export enum LED_COLORS {
    LED_ON = "#ffa922",
    LED_OFF = "#F2F2F2",
    POWER_ON = "#49ff7e",
}