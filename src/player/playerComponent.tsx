import React from 'react';
import {ArduinoFrame} from "../core/frames/arduino.frames";
import {onErrorMessage} from "../help/alert";
import {wait} from "@testing-library/user-event/dist/utils";
import currentFrameStore from "../stores/currentFrame.store";
import currentStepStore from "../stores/currentStep.store";
import frameStore from "../stores/frame.store";
import settingsStore from "../stores/settings.store";

let frames: ArduinoFrame[] = [];
let frameNumber = 1;
let playing = false;
let speedDivisor = 1;
let maxTimePerStep = 1000;

const unsubscribes = [];
function setCurrentFrame(frameNumber) {
    currentFrameStore.set(frames[frameNumber]);
    currentStepStore.set(frameNumber);
}

setCurrentFrame(frameNumber)
let disablePlayer = frames.length === 0;
let frameIndex = frameNumber - 1;

unsubscribes.push(
    currentStepStore.subscribe((currentIndex) => {
        frameNumber = currentIndex;
    })
);

unsubscribes.push(
    frameStore.subscribe((frameContainer) => {
        playing = false;
        const currentFrame = frames[frameNumber];
        frames = frameContainer.frames;

        // If we are starting out with set to first frame in the loop
        // We want to skip all the library and setup blocks
        if (frames.length === 0 || !currentFrame) {
            frameNumber = frames.findIndex(
                (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
            );
            frameNumber = frameNumber < 0 ? 0 : frameNumber;
            if (frames.length > 0) {
                currentFrameStore.set(frames[frameNumber]);
            }
            return;
        }

        frameNumber = navigateToClosestTimeline(currentFrame.timeLine);
        currentFrameStore.set(frames[frameNumber]);
    })
);

unsubscribes.push(
    settingsStore.subscribe((newSettings) => {
        maxTimePerStep = newSettings.maxTimePerMove;
    })
);


function navigateToClosestTimeline(timeLine) {
    // This means we have not left the first iteration
    // If we are starting out with set to first frame in the loop
    // We want to skip all the library and setup blocks
    if (timeLine.function !== "loop" || timeLine.iteration <= 1) {
        frameNumber = frames.findIndex(
            (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
        );
        return frameNumber < 0 ? 0 : frameNumber;
    }

    const lastFrameTimeLine = frames[frames.length - 1].timeLine;

    // This means that there are more frames the previous version than there is now
    // So go to the last iteration in the loop
    if (timeLine.iteration > lastFrameTimeLine.iteration) {
        const loopNumber = lastFrameTimeLine.iteration;
        return frames.findIndex((f) => f.timeLine.iteration === loopNumber);
    }

    const loopNumber = timeLine.iteration;

    return frames.findIndex((f) => f.timeLine.iteration === loopNumber);
}

function isLastFrame() {
    return frameNumber >= frames.length - 1;
}

function moveWait() {
    return new Promise((resolve) =>
        setTimeout(resolve, maxTimePerStep / speedDivisor)
    );
}

async function playFrame() {
    if (!playing || isLastFrame()) {
        return;
    }

    if (frames[frameNumber].delay > 0) {
        await wait(frames[frameNumber].delay);
    }

    currentFrameStore.set(frames[frameNumber]);
    frameNumber += 1;
    await moveWait();
    await playFrame();
    if (isLastFrame()) {
        playing = false;
    }
}

export async function play() {
    playing = !playing;
    if (playing && isLastFrame()) {
        frameNumber = 0;
    }

    if (playing) {
        try {
            playing = true;
            // Because we want to make it look like the first frame has a wait time equal
            await moveWait();
            await playFrame();
        } catch (e) {
            onErrorMessage("Please refresh your browser and try again.", e);
        }
    }

}