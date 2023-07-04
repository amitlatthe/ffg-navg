// @ts-ignore
import Blockly, {BlockSvg, WorkspaceSvg} from 'blockly';
export const getWorkspace = () => {
    return Blockly.getMainWorkspace() as WorkspaceSvg;
};

export const getArduinoCode = () => {
    return Blockly['Arduino'].workspaceToCode(getWorkspace()) as string;
};