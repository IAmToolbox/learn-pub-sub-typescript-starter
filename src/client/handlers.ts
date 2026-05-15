import { handlePause } from "../internal/gamelogic/pause.js";
import { handleMove } from "../internal/gamelogic/move.js";

export function handlerPause(gs: GameState): (ps: PlayingState) => void {
    const ps = { isPaused: gs.isPaused() };

    return (ps) => {
        handlePause(gs, ps);
        console.log("> ");
    };
}

export function handlerMove(gs: GameState): (am: ArmyMove) => void {
    return (am) => {
        handleMove(gs, am);
        console.log("> ");
    }
}
