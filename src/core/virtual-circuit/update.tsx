import {
    findSvgElement,
    LED_COLORS,
    findMicronControllerEl,
} from "./svg-helpers";
import { syncComponents } from "./svg-sync";
import {ArduinoFrame} from "../frames/arduino.frames";
import {Svg} from "@svgdotjs/svg.js";
import {updateLed} from "../../blocks/led/virtual-circuit";

export default (draw: Svg, frame = undefined) => {
    if (!frame) {
        return;
    }

    if (frame) {
        syncComponents(frame, draw);
    }
    const arduino = findMicronControllerEl(draw);

    if (arduino) {
        findSvgElement("TX_LED", arduino as Svg).fill(
            frame.sendMessage.length > 0 ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
        );

        findSvgElement("BUILT_IN_LED", arduino as Svg).fill(
            frame.builtInLedOn ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
        );
    }
};