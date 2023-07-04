import {getBlockByType} from "./block.helper";

export const arduinoLoopBlockShowNumberOfTimesThroughLoop = () => {
    const block = getBlockByType('arduino_loop');
    block.inputList[0].setVisible(false);
    block.inputList[1].setVisible(true);
    block.render();
    return;
};

export const arduinoLoopBlockShowLoopForeverText = () => {
    const block = getBlockByType('arduino_loop');

    block.inputList[0].setVisible(true);
    block.inputList[1].setVisible(false);
    block.render();
};