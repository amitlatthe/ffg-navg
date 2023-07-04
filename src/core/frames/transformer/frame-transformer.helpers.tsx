import {BlockData} from "../../blockly/dto/block.type";
import {findBlockById} from "../../blockly/helpers/block-data.helpers";
import {ArduinoComponentState, ArduinoFrame, Timeline, Variable, Color} from "../arduino.frames";
import { VariableTypes } from "../../blockly/dto/variable.type";
import {arduinoComponentStateToId} from "../arduino-component-id";
import _ from "lodash";

export const findBlockInput = (
    blocks: BlockData[],
    block: BlockData,
    inputName: string
) => {
    const input = block.inputBlocks.find((i) => i.name === inputName);
    if (!input || !input.blockId) {
        return undefined;
    }

    return findBlockById(blocks, input.blockId);
};

export const arduinoFrameByComponent = (
    blockId: string,
    blockName: string,
    timeline: Timeline,
    newComponent: ArduinoComponentState,
    explanation: string,
    previousFrame: ArduinoFrame = undefined,
    txLedOn = false,
    builtInLedOn = false,
    delay = 0
): ArduinoFrame => {
    const variables = previousFrame ? { ...previousFrame.variables } : {};
    const previousComponents = previousFrame ? [...previousFrame.components] : [];

    const components = [
        ...previousComponents.filter(
            (c) =>
                arduinoComponentStateToId(c) !== arduinoComponentStateToId(newComponent)
        ),
        newComponent,
    ];

    return {
        blockId,
        blockName,
        sendMessage: "",
        timeLine: { ...timeline },
        variables,
        txLedOn,
        builtInLedOn: builtInLedOn,
        components,
        explanation,
        delay,
        powerLedOn: true,
        frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
    };
};

export const arduinoFrameByExplanation = (
    blockId: string,
    blockName: string,
    timeline: Timeline,
    explanation: string,
    previousFrame: ArduinoFrame = undefined,
    txLedOn = false,
    builtInLedOn = false,
    delay = 0
): ArduinoFrame => {
    const components = previousFrame ? _.cloneDeep(previousFrame.components) : [];

    const variables = previousFrame ? { ...previousFrame.variables } : {};

    return {
        blockId,
        blockName,
        sendMessage: "",
        timeLine: { ...timeline },
        variables,
        txLedOn,
        builtInLedOn,
        components,
        explanation,
        delay,
        powerLedOn: true,
        frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
    };
};

export const arduinoFrameByVariable = (
    blockId: string,
    blockName: string,
    timeline: Timeline,
    newVariable: Variable,
    explanation: string,
    previousFrame: ArduinoFrame = undefined,
    txLedOn = false,
    builtInLedOn = false,
    delay = 0
): ArduinoFrame => {
    const variables = previousFrame ? _.cloneDeep(previousFrame.variables) : {};
    variables[newVariable.name] = newVariable;
    const components = previousFrame ? _.cloneDeep(previousFrame.components) : [];

    return {
        blockId,
        blockName,
        sendMessage: "",
        timeLine: { ...timeline },
        variables,
        txLedOn,
        builtInLedOn,
        components,
        explanation,
        delay,
        powerLedOn: true,
        frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
    };
};

export const getDefaultValueList = (type: VariableTypes) => {
    switch (type) {
      case VariableTypes.COLOUR:
        return { red: 0, green: 0, blue: 0 };
      case VariableTypes.STRING:
        return "";
      case VariableTypes.BOOLEAN:
        return false;
      case VariableTypes.NUMBER:
        return 0;
      default:
        return undefined;
    }
  };
  
  export const valueToString = (
    value: Color | string | boolean | number,
    type: VariableTypes
  ) => {
    if (type === VariableTypes.COLOUR) {
      const color = value as Color;
      return value
        ? `(red=${color.red},green=${color.green},blue=${color.blue})`
        : "(red=0,green=0,blue=0)";
    }
  
    if (type === VariableTypes.STRING) {
      return `"${value}"`;
    }
  
    return value;
  };