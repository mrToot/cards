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
    key?: string;
    name: string;
    players: TeamPlayer[];
    score?: number;
}

export interface TeamPlayer {
    name: string;
}

export interface CurrentGame {
    playing: boolean;
    namesSelected?: boolean;
    playerSelected?: boolean;
    gameStarted?: boolean;
    blindLevel?: number;
    currentPlayer?: string;
}

export interface TempNames {
    names: string;
    currentName: string;
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
