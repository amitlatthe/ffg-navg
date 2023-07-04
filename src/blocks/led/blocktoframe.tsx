import {BlockToFrameTransformer} from "../../core/frames/transformer/block-to-frame.transformer";
import {findFieldValue} from "../../core/blockly/helpers/block-data.helpers";
import {ArduinoComponentType} from "../../core/frames/arduino.frames";
import {arduinoFrameByComponent} from "../../core/frames/transformer/frame-transformer.helpers";
import {LedState} from "./state";

export const led: BlockToFrameTransformer = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {
    const pin = findFieldValue(block, "PIN");
    const state = findFieldValue(block, "STATE") === "ON" ? 1 : 0;
    const ledState: LedState = {
        type: ArduinoComponentType.LED,
        pins: [pin],
        pin: pin,
        state,
        fade: false,
    };
    const explanation = `Turning ${state === 1 ? "on" : "off"} led ${pin}.`;

    return [
        arduinoFrameByComponent(
            block.id,
            block.blockName,
            timeline,
            ledState,
            explanation,
            previousState
        ),
    ];
};