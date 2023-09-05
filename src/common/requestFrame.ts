
type FrameCallback = () => void;
let requestFrameId: number | null = null;
let requestFrames = new Set<FrameCallback>();
export function requestFrame(callback: FrameCallback) {
    requestFrames.add(callback);

    if (!requestFrameId) {
        requestFrameId = requestAnimationFrame(() => {
            requestFrameId = null;
            let current = requestFrames;
            requestFrames = new Set();
            for (let callback of current) {
                callback();
            }
        })
    }
}
export function unrequestFrame(callback: FrameCallback) {
    requestFrames.delete(callback);
}