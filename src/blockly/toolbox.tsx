import logicXMLString from '../blocks/logic/toolbox'
import loopXMLString from '../blocks/loops/toolbox'
import colorXMLString from '../blocks/color/toolbox'
import mathXMLString from '../blocks/math/toolbox'
import textXMLString from '../blocks/text/toolbox'
import timeXMLString from '../blocks/time/toolbox'
import ledXMLString from '../blocks/led/toolbox'
import {COLOR_THEME} from "../core/blockly/constants/colors";
export interface ToolBoxEntries {
    category: ToolBoxCategory;
    name: string;
    toolBoxEntries: ToolBoxEntry[];
    color: COLOR_THEME;
}

export interface ToolBoxEntry {
    name: string;
    xml: string;
}
export enum ToolBoxCategory {
    COMPONENT = 'Component',
    SENSORS = 'Sensors',
    ARDUINO = 'Arduino',
    DATA = 'DATA',
    NONE = 'NONE',
    SEPARATOR = 'SEPARATOR',
}

const defaultToolbox: ToolBoxEntries[] = [
    {
        color: COLOR_THEME.CONTROL,
        category: ToolBoxCategory.NONE,
        name: 'TOP_LEVEL',
        toolBoxEntries: [
            {
                name: 'Logic',
                xml: logicXMLString,
            },
            {
                name: 'Loop',
                xml: loopXMLString,
            },
            {
                name: 'Color',
                xml: colorXMLString,
            },
            {
                name: 'Math',
                xml: mathXMLString,
            },
            {
                name: 'Text',
                xml: textXMLString,
            },
            {
                name: 'Time',
                xml: timeXMLString,
            },
        ],
    },
    {
        color: COLOR_THEME.COMPONENTS,
        category: ToolBoxCategory.COMPONENT,
        name: 'Add-ons',
        toolBoxEntries: [
            { name: 'Led', xml: ledXMLString },
        ],
    }
];
function getMenuItems(toolBoxEntries: ToolBoxEntry[]) {
    return toolBoxEntries.reduce((acc, next) => {
        return acc + next.xml;
    }, '');
}


export const getToolBoxString = (): string => {
    const toolboxOptions = defaultToolbox; // TODO Make this dynamic
    let toolbox = `<xml
    xmlns="https://developers.google.com/blockly/xml"
    id="toolbox-simple"
    style="display: none"
  >`;

    toolbox += toolboxOptions.reduce((acc, next) => {
        if (next.category === ToolBoxCategory.NONE) {
            return acc + getMenuItems(next.toolBoxEntries);
        }

        return (
            acc +
            `<category name="${next.name}" colour="${next.color}">
        ${getMenuItems(next.toolBoxEntries)}
      </category>`
        );
    }, '');

    toolbox += `</xml>`;

    return toolbox;
};