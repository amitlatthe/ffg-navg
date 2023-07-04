import Blockly, {BlocklyOptions, WorkspaceSvg} from 'blockly';
import {getToolBoxString} from "../../blockly/toolbox";
import {theme} from "./theme";
import './blocks';
import {connectToArduinoBlock, createBlock, getAllBlocks} from "./helpers/block.helper";
import {LED_COMMENT} from "../../blocks/led/toolbox";
import {ARDUINO_PINS} from "../microcontroller/selectBoard";
import {DELAY_COMMENT} from "../../blocks/time/toolbox";
import { MutableRefObject, RefObject} from 'react';
import {addListener, createFrames} from "./registerEvents";
import registerCodeMenu from "../../blocks/arduino/menu";
import '../../core/blockly/generators/index';
import frameStore from "../../stores/frame.store";
import registerListMenu from "../../blocks/list/menu";
import {getWorkspace} from "./helpers/workspace.helper";
import currentFrameStore from "../../stores/currentFrame.store";

const startBlockly = (blocklyElement) => {
    const workspace = createWorkspace(blocklyElement)
    registerListMenu(workspace);
    addListener(workspace);
    registerCodeMenu(workspace);

    const arduinoBlock = createBlock('arduino_loop',0,0,false)

    createLedWithDelay(0.2,false)
    createLedWithDelay(0.2,true)

    createFrames({
        type: Blockly.Events.MOVE,
        blockId: arduinoBlock.id,
    });
}

const createWorkspace = (blocklyElement: RefObject<HTMLDivElement> | MutableRefObject<undefined>)=>{
    Blockly.inject(blocklyElement.current,createBlockConfig())
    return Blockly.getMainWorkspace() as WorkspaceSvg
}

const createBlockConfig = (): BlocklyOptions =>{
    let toolboxConfig = getToolBoxString()
    return {
        toolbox: toolboxConfig,
        collapse: true,
        comments: true,
        disable: false,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://blockly-demo.appspot.com/static/media/',
        rtl: false,
        sounds: true,
        theme,
        oneBasedIndex: true,
        move: {
            scrollbars: false,
        },
        zoom: {
            controls: true,
            wheel: false,
            startScale: 1,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
        },
    };
}

const createLedWithDelay = (seconds = 1, isOn = true) => {
    const ledBlock = createBlock('led', 0, 0, true);
    ledBlock.setCommentText(LED_COMMENT);
    ledBlock.comment.setBubbleSize(460, 145);
    ledBlock.setFieldValue(ARDUINO_PINS.PIN_13, 'PIN');
    ledBlock.setFieldValue(isOn ? 'ON' : 'OFF', 'STATE');
    connectToArduinoBlock(ledBlock);
    const delayBlock = createBlock('delay_block', 0, 0, true);

    delayBlock.setCommentText(DELAY_COMMENT);
    delayBlock.comment.setBubbleSize(460, 90);
    const numberBlock1 = createBlock('math_number', 0, 0, true);
    numberBlock1.setFieldValue(seconds.toString(), 'NUM');
    delayBlock
        .getInput('DELAY')
        .connection.connect(numberBlock1.outputConnection);
    ledBlock.nextConnection.connect(delayBlock.previousConnection);
};

export default startBlockly;