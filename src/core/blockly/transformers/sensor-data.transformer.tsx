import _ from "lodash";
import {timeSetupBlockToComponentState} from "../../../blocks/time/setupblocktocomponentstate";
import {BlockData} from "../dto/block.type";
import {ArduinoComponentState, Timeline} from "../../frames/arduino.frames";
import {Sensor} from "../dto/sensor.type";
import {timeSetupBlockToSensorData} from "../../../blocks/time/setupblocktosensordata";

interface RetrieveSensorData {
    (block: BlockData): Sensor;
}

interface BlockToComponentState {
    (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

const blockToSensorComponent: {
    [blockName: string]: BlockToComponentState;
} = {
    time_setup: timeSetupBlockToComponentState,

};
export const sensorSetupBlockName = _.keys(blockToSensorComponent);

export const convertToState = (
    block: BlockData,
    timeline: Timeline
): ArduinoComponentState => {
    if (!_.isFunction(blockToSensorComponent[block.blockName])) {
        throw new Error("No Sensor Data function found for " + block.blockName);
    }

    try {
        // if the sensor data does not have state for the loop
        // it will error most of the time
        return blockToSensorComponent[block.blockName](block, timeline);
    } catch (e) {
        return blockToSensorComponent[block.blockName](block, {
            iteration: 0,
            function: "pre-setup",
        });
    }
};

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
    time_setup: timeSetupBlockToSensorData,
};

export const convertToSensorData = (block: BlockData): Sensor => {
    if (!_.isFunction(blockToSensorData[block.blockName])) {
        throw new Error("No Sensor Data function found for " + block.blockName);
    }

    return blockToSensorData[block.blockName](block);
};