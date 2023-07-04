import {ArduinoComponentType} from "../../core/frames/arduino.frames";
import {findFieldValue} from "../../core/blockly/helpers/block-data.helpers";
import {TimeState} from "./state";
import {arduinoFrameByComponent} from "../../core/frames/transformer/frame-transformer.helpers";
import {BlockToFrameTransformer} from "../../core/frames/transformer/block-to-frame.transformer";

export const timeSetup: BlockToFrameTransformer = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {
    const timeComonent: TimeState = {
        pins: block.pins,
        timeInSeconds: +findFieldValue(block, "time_in_seconds"),
        type: ArduinoComponentType.TIME,
    };

    return [
        arduinoFrameByComponent(
            block.id,
            block.blockName,
            timeline,
            timeComonent,
            "Setting up Arduino time.",
            previousState
        ),
    ];
};