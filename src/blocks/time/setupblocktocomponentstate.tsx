import {BlockData} from "../../core/blockly/dto/block.type";
import {ArduinoComponentType, Timeline} from "../../core/frames/arduino.frames";
import {TimeState} from "./state";
import {findFieldValue} from "../../core/blockly/helpers/block-data.helpers";

export const timeSetupBlockToComponentState = (
    block: BlockData,
    timeline: Timeline
): TimeState => {
    return {
        type: ArduinoComponentType.TIME,
        pins: [],
        timeInSeconds:
            +timeline.iteration * +findFieldValue(block, "time_in_seconds"),
    };
};