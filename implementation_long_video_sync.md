# Long Video Synchronization Plan

## Problem
Using a single long video (like YouTube) causes sync issues if the React timer (setInterval) loses sync with the video's actual playback time (due to buffering or user seeking).

## Solution
1. Use `react-youtube` (YouTube Iframe API).
2. The video's internal clock (`player.getCurrentTime()`) becomes the single source of truth, NOT a `setInterval` in React.
3. We define an array of `WorkoutStep` objects, each with a `startTime` and `endTime` (in seconds).
4. A `requestAnimationFrame` loop (or fast `setInterval`) constantly checks `player.getCurrentTime()`.
5. Based on the current time, we determine which step is active and update the UI (Exercise name, time remaining for that specific step).
