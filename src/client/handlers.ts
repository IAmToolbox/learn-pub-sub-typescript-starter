import { handlePause } from "../internal/gamelogic/pause.js";

export function handlerPause(gs: GameState): (ps: PlayingState) => void {
    const ps = { isPaused: gs.isPaused() };

    return (ps) => {
        handlePause(gs, ps);
        console.log("> ");
    };
}
