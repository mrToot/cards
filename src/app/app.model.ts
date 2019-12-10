export interface Player {
    name: string;
    photo: string;
    balance: number;
    score?: number;
    guess?: number;
    actual?: number;
    rebuyCount?: number;
}

export interface CurrentGame {
    playing: boolean;
    lastGameStarted?: Date;
    game?: Game
}

export interface Game {
    gameType: GameType;
    currentBlindlevel?: string;
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
