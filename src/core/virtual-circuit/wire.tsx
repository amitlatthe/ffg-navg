import type {Breadboard, BreadBoardArea, MicroController} from "../microcontroller/microcontroller";
import _ from "lodash";
import {Element, Svg} from "@svgdotjs/svg.js";
import {findArduinoConnectionCenter, findComponentConnection, findSvgElement} from "./svg-helpers";
import resistorSvg from "../virtual-circuit/commonsvgs/resistors/resistor-small.svg";
import horizontalResistorSvg from "../virtual-circuit/commonsvgs/resistors/resistor-small-horizontal.svg";
import {ohmsToBands} from "./resistor-color-calculator";
import {ANALOG_PINS, ARDUINO_PINS } from "../microcontroller/selectBoard";

let breadboard: Breadboard = {
    areas: [],
    order: [],
};
export const resetBreadBoardHoles = (board: MicroController) => {
    breadboard = _.cloneDeep(board.breadboard);
};

export const takeBoardAreaWithExistingComponent = (holes: number[]) => {
    const areas = breadboard.areas;
    const areaIndex = areas.findIndex(
        (a) => a.holes.sort().join("-") === holes.sort().join("-")
    );
    breadboard.areas[areaIndex].taken = true;
};

export const showPin = (draw, pin) => {
    if (ANALOG_PINS.includes(pin)) {
        const wire = draw.findOne(`#${pin}`);
        if (wire) {
            wire.show();
        }
    }
};

export const takeBoardArea = (): BreadBoardArea | null => {
    const areas = breadboard.areas;
    for (let orderIndex in breadboard.order) {
        const areaIndex = breadboard.order[orderIndex];
        const area = areas[areaIndex];
        if (!area.taken) {
            breadboard.areas[areaIndex].taken = true;
            return breadboard.areas[areaIndex];
        }
    }

    return null;
};
export const hideAllAnalogWires = (draw: Svg)=> {
    ANALOG_PINS.forEach((pin) => {
        const wire = draw.findOne(`#${pin}`);
        if (wire) {
            wire.hide();
        }
    });
};

export const updateWires = (element, draw, arduino) => {
    const wires = (draw.find(
        `[data-component-id=${element.id()}]`
    ));
    wires
        .filter((w) => {
            return w.data("type") === "wire" && w.data("update-wire");
        })
        .forEach((w) => {
            const holeId = w.data("hole-id");
            const hole = findSvgElement(holeId, arduino);
            const holeX = hole.cx() + arduino.x();
            const holeY = hole.cy() + arduino.y();

            const connectionId = w.data("connection-id");
            const componentPin = findComponentConnection(element, connectionId);
            w.plot(holeX, holeY, componentPin.x, componentPin.y);
        });
};

const getGroundorPowerWireLetter = (
    isDown: boolean,
    type: "ground" | "power"
) => {
    if (isDown && type === "power") {
        return "W";
    }

    if (isDown && type === "ground") {
        return "X";
    }

    if (!isDown && type === "power") {
        return "Y";
    }

    return "Z";
};

export const findBreadboardHoleXY = (
    pinHoleId,
    arduino: Element,
    draw: Svg
) => {
    const hole = findSvgElement(pinHoleId, draw);
    return {
        x: Number(hole.cx()) + Number(arduino.x()),
        y: Number(hole.cy()) + Number(arduino.y()),
    };
};

export const createWireComponentToBreadboard = (
    holeId: string,
    componentEl: Element,
    draw,
    arduinoEl: Svg | Element,
    componentConnectionId: string,
    componentId: string,
    color: string
) => {
    const hole = findBreadboardHoleXY(holeId, arduinoEl, draw);
    const componentPin = findComponentConnection(
        componentEl,
        componentConnectionId
    );
    const line = draw
        .line()
        .plot(hole.x, hole.y, componentPin.x, componentPin.y)
        .stroke({ width: 2, color, linecap: "round" });
    line.data("connection-id", componentConnectionId);
    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", true);
    line.data("hole-id", holeId);
};

export const createGroundOrPowerWire = (
    hole: number,
    isDown: boolean,
    componentEl: Element,
    draw: Svg,
    arduino: Element,
    componentId: string,
    type: "ground" | "power"
) => {
    const groundHole = `pin${hole}${isDown ? "E" : "F"}`;
    const pinConnectionId = type === "ground" ? "PIN_GND" : "PIN_POWER";
    const color = type === "ground" ? "#000" : "#AA0000";
    const breadBoardHoleA = `pin${hole}${isDown ? "A" : "J"}`;
    const breadBoardHoleB = `pin${hole}${getGroundorPowerWireLetter(
        isDown,
        type
    )}`;

    createWireComponentToBreadboard(
        groundHole,
        componentEl,
        draw,
        arduino,
        pinConnectionId,
        componentId,
        color
    );

    createWireBreadboard(
        breadBoardHoleA,
        breadBoardHoleB,
        color,
        draw,
        arduino as Svg,
        componentId
);
};

export const createWireBreadboard = (
    holeIdA: string,
    holeIdB: string,
    color: string,
    draw: Svg,
    arduinoEl: Svg,
    componentId: string
) => {
    const holeA = findBreadboardHoleXY(holeIdA, arduinoEl, draw);
    const holeB = findBreadboardHoleXY(holeIdB, arduinoEl, draw);

    const line = draw
        .line()
        .plot(holeA.x, holeA.y, holeB.x, holeB.y)
        .stroke({ width: 2, color, linecap: "round" });

    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", false);
};

export const createResistor = (
    arduino: Svg | Element,
    draw: Svg,
    hole: number,
    isConnecting: boolean, // This means that it's connecting the top and bottom of the breadboard
    componentId: string,
    direction: "vertical" | "horizontal",
    ohms: number
) => {
    const svgString =
        direction === "vertical" ? `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="6" height="16.25" viewBox="0 0 6 16.25">
  <g id="WIRE_2">
    <line x1="3" y1="1" x2="3" y2="3" style="fill: none;stroke: #999;stroke-linecap: round;stroke-linejoin: round;stroke-width: 2px"/>
  </g>
  <g id="WIRE_1">
    <line x1="3" y1="11.75" x2="3" y2="15.25" style="fill: none;stroke: #999;stroke-linecap: round;stroke-miterlimit: 10;stroke-width: 2px"/>
  </g>
  <g id="base">
    <rect y="2.57" width="6" height="10" style="fill: #efd49e"/>
  </g>
  <line id="BAND_4" x1="6" y1="11" y2="11" style="fill: #c1272d;stroke: #ffff4d;stroke-miterlimit: 10"/>
  <line id="BAND_3" x1="6" y1="8.52" y2="8.52" style="fill: #c1272d;stroke: #93581c;stroke-miterlimit: 10"/>
  <line id="BAND_2" x1="6" y1="6.26" y2="6.26" style="fill: #c1272d;stroke: #1d9135;stroke-miterlimit: 10"/>
  <line id="BAND_1" x1="6" y1="4" y2="4" style="fill: #c1272d;stroke: #93581c;stroke-miterlimit: 10"/>
</svg>` : `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="16.25" height="6" viewBox="0 0 16.25 6">
  <g id="WIRE_2">
    <line x1="1" y1="3" x2="3" y2="3" style="fill: none;stroke: #999;stroke-linecap: round;stroke-linejoin: round;stroke-width: 2px"/>
  </g>
  <g id="WIRE_1">
    <line x1="11.75" y1="3" x2="15.25" y2="3" style="fill: none;stroke: #999;stroke-linecap: round;stroke-miterlimit: 10;stroke-width: 2px"/>
  </g>
  <g id="base">
    <rect x="2.57" width="10" height="6" style="fill: #efd49e"/>
  </g>
  <line id="BAND_4" x1="11" x2="11" y2="6" style="fill: #c1272d;stroke: #ffff4d;stroke-miterlimit: 10"/>
  <line id="BAND_3" x1="8.52" x2="8.52" y2="6" style="fill: #c1272d;stroke: #93581c;stroke-miterlimit: 10"/>
  <line id="BAND_2" x1="6.26" x2="6.26" y2="6" style="fill: #c1272d;stroke: #1d9135;stroke-miterlimit: 10"/>
  <line id="BAND_1" x1="4" x2="4" y2="6" style="fill: #c1272d;stroke: #93581c;stroke-miterlimit: 10"/>
</svg>
`;
    const resistorEl = draw.svg(svgString).last();

    const [bandColor1, bandColor2, bandColor3] = ohmsToBands(ohms);

    resistorEl.findOne("#BAND_1").node.style.stroke = bandColor1;
    resistorEl.findOne("#BAND_2").node.style.stroke = bandColor2;
    resistorEl.findOne("#BAND_3").node.style.stroke = bandColor3;
    resistorEl.data("component-id", componentId);
    const holeId = `pin${hole}${isConnecting ? "F" : "D"}`;

    const { x, y } = findResistorBreadboardHoleXY(holeId, arduino, draw);
    if (direction === "vertical") {
        resistorEl.cx(x);
        resistorEl.y(y);
    } else {
        resistorEl.x(x - 1);
        resistorEl.y(y - 2);
    }

    if (isConnecting) {
        createWireComponentToBreadboard(
            `pin${hole}E`,
            resistorEl,
            draw,
            arduino,
            "WIRE_1",
            componentId,
            "#999"
        );
    }
};

export const findResistorBreadboardHoleXY = (
    holeId: string,
    arduino: Element,
    draw: Svg
) => {
    const hole = findSvgElement(holeId, draw);
    (window as any).hole = hole;
    return {
        x: Number(hole.cx()) + Number(arduino.x()),
        y: Number((hole.findOne("circle") as Element).cy()) + Number(arduino.y()) - 1,
};
};

export const createWireFromArduinoToBreadBoard = (
    pin: ARDUINO_PINS,
    arduinoEl: Svg,
    draw: Svg,
    breadBoardHoleId,
    componentId: string,
    board: MicroController
) => {
    showPin(draw, pin);

    const hole = findBreadboardHoleXY(breadBoardHoleId, arduinoEl, draw);
    const pinConnection = board.pinConnections[pin];
    const arduinoPin = findArduinoConnectionCenter(arduinoEl, pinConnection.id);

    const line = draw
        .line()
        .plot(hole.x, hole.y, arduinoPin.x, arduinoPin.y)
        .stroke({ width: 2, color: pinConnection.color, linecap: "round" });

    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", false);
};