import {BlockSvg} from "blockly";
import {getWorkspace} from "../../core/blockly/helpers/workspace.helper";

export const createBlock = (
    name: string,
    x: number,
    y: number,
    deletable = false
) => {
    const block = getWorkspace().newBlock(name) as BlockSvg;
    block.setDeletable(deletable);
    block.initSvg();
    block.render();
    block.moveBy(x, y);

    return block;
};