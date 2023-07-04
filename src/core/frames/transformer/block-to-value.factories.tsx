import {BlockData} from "../../blockly/dto/block.type";
import {VariableData} from "../../blockly/dto/variable.type";
import {ArduinoFrame, Color, Timeline} from "../arduino.frames";
import {findBlockInput} from "./frame-transformer.helpers";
import {colorPicker, randomColor, rgbColor} from "../../../blocks/color/blocktovalue";
import {
    mathArithmetic,
    mathModulus,
    mathNumber,
    mathNumberProperty,
    mathRandom,
    mathRound
} from "../../../blocks/math/blocktovalue";
import {logicBoolean, logicCompare, logicNot, logicOperation} from "../../../blocks/logic/blocktovalue";
import {timeSeconds} from "../../../blocks/time/blocktovalue.time_seconds";

export interface ValueGenerator {
    (
        blocks: BlockData[],
        currentBlock: BlockData,
        variables: VariableData[],
        timeline: Timeline,
        previousState?: ArduinoFrame
    ):
        | number
        | string
        | boolean
        | Color
        | number[]
        | string[]
        | boolean[]
        | Color[];
}

export const valueList: { [blockName: string]: ValueGenerator } = {
    math_number: mathNumber,
    math_arithmetic: mathArithmetic,
    math_modulo: mathModulus,
    math_round: mathRound,
    math_random_int: mathRandom,
    math_number_property: mathNumberProperty,

    logic_boolean: logicBoolean,
    logic_compare: logicCompare,
    logic_operation: logicOperation,
    logic_negate: logicNot,



    color_picker_custom: colorPicker,
    colour_random: randomColor,
    colour_rgb: rgbColor,



    time_seconds: timeSeconds,

};

export const getInputValue = (
    blocks: BlockData[],
    block: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    inputName: string,
    defaultValue: any,
    previousState: ArduinoFrame = undefined
) => {
    const inputBlock = findBlockInput(blocks, block, inputName);

    if (!inputBlock) {
        return defaultValue;
    }
    const value = blockToValue(
        blocks,
        inputBlock,
        variables,
        timeline,
        previousState
    );

    return value === undefined ? defaultValue : value;
};

export const blockToValue: ValueGenerator = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {
    try {
        return valueList[block.blockName](
            blocks,
            block,
            variables,
            timeline,
            previousState
        );
    } catch (e) {
        console.trace();
        console.log(block);

        console.log(e);
        throw e;
    }
};