export interface Player {
    key: string;
    name: string;
    photo: string;
    balance: number;
    isPlaying: boolean;
    shots: number;
    pokerWinnings?: number;
    boughtIn?: number;
    score?: number;
    guess?: number;
    actual?: number;
    rebuyCount?: number;
}

export interface Team {
    key: string;
    name: string;
    players: TeamPlayer[];
    photo: string;
    balance: number;
    isPlaying: boolean;
    score?: number;
}

export interface TeamPlayer {
    name: string;
}

export interface CurrentGame {
    playing: boolean;
    playersSelected: boolean;
    lastGameStarted?: number;
    gameNotStarted?: boolean;
    isCashgame?: boolean;
    currentBlindlevel?: number;
    game?: Game
}

export interface Game {
    gameType: GameType;
    blindLevels?: string[];
    potAmount?: number;
    rebuyCount?: number;
    round?: number;

}

export enum GameType {
    Poker = 'Poker',
    Boerenbridge = 'Boerenbrige',
    Hartenjagen = 'Hartenjagen'
}
