export class Level {
    /** @type {string[]} **/
    letters = []

    /** @type {string[][]} **/
    data = []

    /** @type {{begin: {row: number, col: number}, end: {row: number, col: number}}[]} **/
    answers = []
}

/** @type Level[] **/
const Levels = [
    {
        letters: ['T', 'E', 'S', 'T'],
        data: [
            ['T'],
            ['E'],
            ['S'],
            ['T']
        ],
        answers: [
            { begin: { row: 0, col: 0 }, end: { row: 3, col: 0 } },// TEST
        ]
    },
    {
        letters: ['T', 'E', 'S', 'T'],
        data: [
            ['T', 'E', 'S', 'T']
        ],
        answers: [
            { begin: { row: 0, col: 0 }, end: { row: 0, col: 3 } },// TEST
        ]
    },
    {
        letters: ['C', 'A', 'R', 'T'],
        data: [
            ['_', '_', '_', 'C'],
            ['_', '_', '_', 'A'],
            ['C', 'A', 'R', 'T'],
            ['A', '_', '_', '_'],
            ['R', 'A', 'T', '_']
        ],
        answers: [
            { begin: { row: 0, col: 3 }, end: { row: 2, col: 3 } }, // cat
            { begin: { row: 2, col: 0 }, end: { row: 2, col: 3 } }, // cart
            { begin: { row: 2, col: 0 }, end: { row: 4, col: 0 } }, // car
            { begin: { row: 4, col: 0 }, end: { row: 4, col: 2 } },// rat
        ]
    },
    {
        letters: ['C', 'R', 'A', 'N', 'E'],
        data: [
            ['R', 'A', 'C', 'E', '_'],
            ['_', '_', 'R', '_', '_'],
            ['_', '_', 'A', '_', '_'],
            ['_', '_', 'N', '_', '_'],
            ['_', 'N', 'E', 'A', 'R']
        ],
        answers: [
            { begin: { row: 0, col: 0 }, end: { row: 0, col: 3 } }, // RACE
            { begin: { row: 0, col: 2 }, end: { row: 4, col: 2 } }, // CRANE
            { begin: { row: 4, col: 1 }, end: { row: 4, col: 4 } },// NEAR
        ]
    },
    {
        letters: ['T', 'R', 'A', 'I', 'N'],
        data: [
            ['A', '_', '_', '_', 'T'],
            ['R', '_', '_', '_', 'I'],
            ['T', 'R', 'A', 'I', 'N'],
            ['_', 'A', '_', '_', '_'],
            ['_', 'I', '_', '_', '_'],
            ['_', 'N', '_', '_', '_']
        ],
        answers: [
            { begin: { row: 0, col: 0 }, end: { row: 2, col: 0 } }, // ART
            { begin: { row: 2, col: 0 }, end: { row: 2, col: 4 } }, // TRAIN
            { begin: { row: 2, col: 1 }, end: { row: 5, col: 1 } }, // RAIN
            { begin: { row: 0, col: 4 }, end: { row: 2, col: 4 } },// TIN
        ]
    },
    {
        letters: ['P', 'L', 'A', 'N', 'E', 'T'],
        data: [
            ['L', '_', '_', 'P', '_', '_'],
            ['A', '_', '_', 'A', '_', '_'],
            ['P', 'L', 'A', 'N', 'E', 'T'],
            ['_', '_', 'N', '_', '_', 'E'],
            ['_', '_', 'T', '_', '_', 'N']
        ],
        answers: [
            { begin: { row: 0, col: 0 }, end: { row: 2, col: 0 } }, // LAP
            { begin: { row: 0, col: 3 }, end: { row: 2, col: 3 } }, // PAN
            { begin: { row: 2, col: 0 }, end: { row: 2, col: 5 } }, // PLANET
            { begin: { row: 2, col: 2 }, end: { row: 4, col: 2 } }, // ANT
            { begin: { row: 2, col: 5 }, end: { row: 4, col: 5 } },// TEN
        ]
    },
    {
        letters: ['N', 'T', 'A', 'R', 'I'],
        data: [
            ['_', '_', '_', '_', 'T', '_', '_', '_',],
            ['_', '_', '_', '_', 'A', '_', 'A', '_',],
            ['_', '_', '_', '_', 'R', 'A', 'N', 'T',],
            ['T', 'R', 'A', 'I', 'N', '_', 'T', '_',],
            ['_', '_', 'I', '_', '_', '_', 'I', '_',],
            ['_', '_', 'R', '_', '_', '_', '_', '_',]
        ],
        answers: [
            { begin: { row: 0, col: 4 }, end: { row: 3, col: 4 } }, // TARN
            { begin: { row: 3, col: 0 }, end: { row: 3, col: 4 } }, // TRAIN
            { begin: { row: 2, col: 4 }, end: { row: 2, col: 7 } }, // RANT
            { begin: { row: 1, col: 6 }, end: { row: 4, col: 6 } }, // ANTI
            { begin: { row: 3, col: 2 }, end: { row: 5, col: 2 } },// AIR
        ]
    },
    {
        letters: ['S', 'T', 'A', 'T', 'I', 'O', 'N'],
        data: [
            ['_', 'S', 'I', 'N', '_', '_', '_'],
            ['_', 'I', '_', '_', '_', '_', '_'],
            ['S', 'T', 'A', 'T', 'I', 'O', 'N'],
            ['O', '_', '_', 'A', '_', '_', '_'],
            ['N', '_', '_', 'N', '_', '_', '_']
        ],
        answers: [
            { begin: { row: 0, col: 1 }, end: { row: 0, col: 3 } }, // SIN
            { begin: { row: 0, col: 1 }, end: { row: 2, col: 1 } }, // SIT
            { begin: { row: 2, col: 0 }, end: { row: 2, col: 6 } }, // STATION
            { begin: { row: 2, col: 0 }, end: { row: 4, col: 0 } }, // SON
            { begin: { row: 2, col: 3 }, end: { row: 4, col: 3 } },// TAN
        ]
    },
    {
        letters: ['A', 'I', 'R', 'P', 'L', 'A', 'N', 'E'],
        data: [
            ['_', '_', '_', '_', '_', 'P', 'I', 'N'],
            ['_', '_', '_', '_', '_', 'L', '_', '_'],
            ['A', 'I', 'R', 'P', 'L', 'A', 'N', 'E'],
            ['I', '_', 'A', '_', '_', 'N', '_', '_'],
            ['R', 'A', 'I', 'N', '_', 'E', '_', '_'],
            ['_', '_', 'L', '_', '_', '_', '_', '_']
        ],
        answers: [
            { begin: { row: 0, col: 5 }, end: { row: 0, col: 7 } }, // PIN
            { begin: { row: 2, col: 0 }, end: { row: 2, col: 7 } }, // AIRPLANE
            { begin: { row: 0, col: 5 }, end: { row: 4, col: 5 } }, // PLANE
            { begin: { row: 2, col: 0 }, end: { row: 4, col: 0 } }, // AIR
            { begin: { row: 2, col: 2 }, end: { row: 5, col: 2 } }, // RAIL
            { begin: { row: 4, col: 0 }, end: { row: 4, col: 3 } },// RAIN
        ]
    }
]

export function nextLevel() {
    if (getApp().data.level < Levels.length - 1) {
        getApp().data.level++;
    }
    console.info(`nextLevel: ${getApp().data.level}`)
    return Levels[getApp().data.level];
}

export function restartLevel() {
    return getApp().data.level = 0;
}

export function getLevelIndex() {
    return getApp().data.level;
}

export function getLevel() {
    console.info(`Level: ${getApp().data.level}`)
    return Levels[getApp().data.level];
}

export function allLevelsComplete() {
    return getApp().data.level >= Levels.length - 1;
}

export function numberOfLevels() {
    return Levels.length;
}
