import { BlockData } from "../../blockly/dto/block.type";
import {VariableData} from "../../blockly/dto/variable.type";
import {ArduinoFrame, Timeline} from "../arduino.frames";
import {timeSetup} from "../../../blocks/time/blocktoframe.time";
import _ from "lodash";
import {findBlockById, findInputStatementStartBlock} from "../../blockly/helpers/block-data.helpers";
import {ifElse} from "../../../blocks/logic/blocktoframe";
import {delayBlock} from "../../../blocks/time/blocktoframe.delay";
import {forLoop, simpleLoop} from "../../../blocks/loops/blocktoframe";
import {led} from "../../../blocks/led/blocktoframe";

export interface BlockToFrameTransformer {
    (
        blocks: BlockData[],
        block: BlockData,
        variables: VariableData[],
        timeline: Timeline,
        previousState?: ArduinoFrame
    ): ArduinoFrame[];
}

export const generateFrame: BlockToFrameTransformer = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {
    try {
        return blockToFrameTransformerList[block.blockName](
            blocks,
            block,
            variables,
            timeline,
            previousState
        );
    } catch (e) {
        console.log(block.blockName, "block name");
        throw e;
    }
};

const blockToFrameTransformerList: {
    [blockName: string]: BlockToFrameTransformer;
} = {
    time_setup: timeSetup,
    control_if: ifElse,
    controls_ifelse: ifElse,
    controls_repeat_ext: simpleLoop,
    controls_for: forLoop,
    delay_block: delayBlock,
    led: led,
};

export const generateInputFrame = (
    block: BlockData,
    blocks: BlockData[],
    variables: VariableData[],
    timeline: Timeline,
    inputName: string,
    previousState?: ArduinoFrame
): ArduinoFrame[] => {
    // Fixing memory sharing between objects
    previousState = previousState ? _.cloneDeep(previousState) : undefined;
    const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
    if (!startingBlock) {
        return [];
    }
    const arduinoStates = [];
    let nextBlock = startingBlock;
    do {
        const states = generateFrame(
            blocks,
            nextBlock,
            variables,
            timeline,
            previousState
        );
        arduinoStates.push(...states);
        const newPreviousState = states[states.length - 1];
        previousState = _.cloneDeep(newPreviousState);
        nextBlock = findBlockById(blocks, nextBlock.nextBlockId);
    } while (nextBlock !== undefined);

    return arduinoStates;
};