import { AppColors } from '../common/settings/app-colors';
import { AppSizes } from '../common/settings/app-sizes';
import { CanvasSettings } from '../common/settings/canvas-settings';
import { getLevelIndex } from './level';

const CellState = Object.freeze({
    Empty: 1,
    Hidden: 2,
    Highlight: 3,
    Found: 3
})

export const EmptyLetter = '_';

// Encapsulates both logical and visual cell data
export class GridCell {
    static textOffset = { x: 0, y: 0 };
    letter = EmptyLetter;
    state = CellState.Empty;
    color = AppColors.CELL_COLOR;
    textColor = AppColors.CELL_TEXT_COLOR;
    edgeLength = 0; // Dynamically configured depending on matrix size
    x = 0;
    y = 0;
    letterX = 0;
    letterY = 0;

    textVisible() {
        return this.state === CellState.Found || this.state === CellState.Highlight;
    }

    isEmpty() {
        return this.letter === EmptyLetter;
    }
}

export class Grid {
    nFound = 0;

    /** @type CanvasSettings **/
    canvasSettings = CanvasSettings.getInstance();

    /** @type GridCell[] **/
    data = [];

    /** @type {{word: string, found: boolean, cells: {r: number, c: number}[] }[]} **/
    answers = [];

    dimensions = {
        rows: 0,
        columns: 0
    };

    constructor(sampleData, sampleAnswers) {
        this.readRows(sampleData)
        this.readAnswers(sampleAnswers)
    }

    readRows(data) {
        if (data.length <= 0 || data[0].length <= 0) {
            console.error(`Can't read from ${data}`);
            return;
        }
        this.dimensions.rows = data.length;
        this.dimensions.columns = data[0].length;

        for (let i = 0; i < this.dimensions.rows * this.dimensions.columns; ++i) {
            this.data.push(new GridCell())
        }
        const gridWidth = this.canvasSettings.getGridBottomRight().x - this.canvasSettings.getGridTopLeft().x;
        const gridHeight = this.canvasSettings.getGridBottomRight().y - this.canvasSettings.getGridTopLeft().y;

        const edgeX = Math.floor(gridWidth / this.dimensions.columns);
        const edgeY = Math.floor(gridHeight / this.dimensions.rows);
        const cellEdgeLength = edgeX < edgeY ? edgeX : edgeY;

        const sizeAwareOffsetX = edgeX < edgeY ? 0 : (gridWidth - this.dimensions.columns * cellEdgeLength) / 2;
        const sizeAwareOffsetY = edgeX > edgeY ? 0 : (gridHeight - this.dimensions.rows * cellEdgeLength) / 2;

        const cellTextOffsetY = Math.floor((cellEdgeLength - AppSizes.CELL_TEXT_SIZE) / 2);
        const cellTextOffsetX = Math.floor((cellEdgeLength - AppSizes.CELL_TEXT_SIZE) / 2);

        for (let r = 0; r < this.dimensions.rows; ++r) {
            for (let c = 0; c < this.dimensions.columns; ++c) {
                let cell = new GridCell();
                cell.edgeLength = cellEdgeLength;
                cell.x = c * cell.edgeLength + this.canvasSettings.getGridCellOffset().x + sizeAwareOffsetX;
                cell.y = r * cell.edgeLength + this.canvasSettings.getGridCellOffset().y + sizeAwareOffsetY;
                cell.letterX = cell.x + cellTextOffsetX;
                cell.letterY = cell.y + cellTextOffsetY;
                cell.letter = data[r][c];
                cell.state = cell.letter === EmptyLetter ? CellState.Empty : CellState.Hidden;
                this.setElem(r, c, cell);
            }
        }
    }

    /** @param {{begin: {row: number, col: number}, end: {row: number, col: number}}[]} answers **/
    readAnswers(answers) {
        for (let i = 0; i < answers.length; ++i) {
            const ans = answers[i]
            let cells = [];
            let str = ''
            const rStart = ans.begin.row;
            const rEnd = ans.end.row;
            const cStart = ans.begin.col;
            const cEnd = ans.end.col;
            for (let row = rStart; row <= rEnd; ++row) {
                for (let col = cStart; col <= cEnd; ++col) {
                    const elem = this.getElem(row, col);
                    str += elem.letter;
                    cells.push({ r: row, c: col });
                }
            }
            this.answers.push({ word: str, found: false, cells: cells });
        }
    }

    index2Cord(index) {
        let row = Math.floor(index / this.dimensions.columns);
        let col = index % this.dimensions.columns;
        return { row, col }
    }

    cord2Index(row, col) {
        return this.dimensions.columns * row + col;
    }

    setElem(row, col, cellData) {
        const index = this.cord2Index(row, col);
        if (index >= this.data.length) {
            console.error(`setElem: Index ${index} out of bounds for ${{ row, col }}`);
            return;
        }
        this.data[index] = cellData;
    }

    getElem(row, col) {
        const index = this.cord2Index(row, col);
        if (index >= this.data.length) {
            console.error(`getElem: Index ${index} out of bounds for ${{ row, col }}`);
            return new GridCell();
        }
        return this.data[index];
    }

    searchWord(word, drawCb, levelCompleteCb) {
        for (let i = 0; i < this.answers.length; ++i) {
            let answer = this.answers[i];
            console.info(`Answer: ${answer.word} Candidate: ${word}`)
            if (word === answer.word) {
                console.info(`Found one! Answer: ${answer.word} Candidate: ${word}`)

                const success = !answer.found;
                this.answers[i].found = true;

                if (success) {
                    ++this.nFound;
                }

                // Highlight found word
                for (let j = 0; j < answer.cells.length; ++j) {
                    const r = answer.cells[j].r;
                    const c = answer.cells[j].c;
                    this.getElem(r, c).state = CellState.Highlight;
                    this.getElem(r, c).color =
                        success ? AppColors.CELL_HIGHLIGHT_COLOR : AppColors.CELL_FAILED_HIGHLIGHT_COLOR;
                }

                // Clear highlight
                setTimeout(() => {
                    for (let j = 0; j < answer.cells.length; ++j) {
                        const r = answer.cells[j].r;
                        const c = answer.cells[j].c;
                        this.getElem(r, c).state = CellState.Found;
                        this.getElem(r, c).color = AppColors.CELL_COLOR;
                    }
                    drawCb();
                }, CanvasSettings.CELL_HIGHLIGHT_TIME_MS);

                if (this.levelComplete()) {
                    setTimeout(() => {
                        levelCompleteCb()
                    }, CanvasSettings.CELL_HIGHLIGHT_TIME_MS * 2);
                }

                return success;
            }
        }
        // Shake entire grid if no matches
        if (word.length > 1) {
            // NOTE: Move these values to settings after refactoring settings
            const shakeDistance = 4;
            const shakeTimeMS = 600;
            const shakeCount = 10; // Has to be even
            const frameTimeMS = shakeTimeMS / shakeCount;
            for (let n = 0; n < shakeCount; ++n) {
                const distance = n % 2 === 0 ? -shakeDistance : shakeDistance;
                setTimeout(() => {
                    for (let i = 0; i < this.data.length; ++i) {
                        let cell = this.data[i];
                        cell.x += distance;
                        cell.letterX += distance;
                        if (n === 0) {
                            cell.color = AppColors.CELL_FAILED_HIGHLIGHT_COLOR;
                        } else if (n === shakeCount - 1) {
                            cell.color = AppColors.CELL_COLOR;
                        }
                    }
                    drawCb();
                }, n * frameTimeMS);
            }
        }
        return false;
    }

    levelComplete() {
        return this.nFound === this.answers.length;
    }

    useHint(drawCb) {
        // Pick random non empty, non found cell and set it to found revealing it
        let found = false;
        let index = 0;
        let iter = 0;
        while (!found && iter < this.data.length**2) {
            index = Math.floor(Math.random() * 100) % this.data.length;
            let cell = this.data[index];
            console.info(`check hint at: ${index}`)
            if (cell.state === CellState.Hidden) {
                found = true;
            }
            ++iter;
        }
        if (found) {
            console.info(`Use hint at: ${index}`)
            this.data[index].state = CellState.Found;
            drawCb();
        }
    }
};
