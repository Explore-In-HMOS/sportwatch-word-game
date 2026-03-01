import { AppColors } from '../common/settings/app-colors';
import { AppSizes } from '../common/settings/app-sizes';
import { CanvasSettings } from '../common/settings/canvas-settings';
import { State } from './controller';
import { GridCell } from './grid';

export class Renderer {
    static _instance = null;

    /** @type CanvasSettings **/
    canvasSettings = CanvasSettings.getInstance();

    constructor(ctx) {
        this.ctx = ctx
    }

    static getInstance(ctx) {
        if (Renderer._instance == null) {
            Renderer._instance = new Renderer(ctx);
        }
        return Renderer._instance;
    }

    /**
     * @param {GridCell[]} cells
     */
    drawGrid(cells) {
        this.ctx.textAlign = 'left';
        for (let i = 0; i < cells.length; ++i) {
            const cell = cells[i];
            // Ignore empty cells entirely
            if (cell.isEmpty()) {
                continue;
            }
            this.ctx.fillStyle = cell.color;
            this.ctx.fillRect(cell.x, cell.y, cell.edgeLength, cell.edgeLength);
            this.ctx.beginPath();
            this.ctx.strokeStyle = AppColors.BG_COLOR;
            this.ctx.lineWidth = AppSizes.CELL_SPACE_BETWEEN;
            this.ctx.rect(cell.x, cell.y, cell.edgeLength, cell.edgeLength);
            this.ctx.stroke();
            if (cell.textVisible()) {
                this.ctx.fillStyle = cell.textColor;
                this.ctx.font = AppSizes.CELL_TEXT_SIZE;
                this.ctx.fillText(cell.letter, cell.letterX, cell.letterY);
            }
        }
    }

    /**
     * @param {{x: number, y: number}[]} linePoints
     * @param {String} currentSelection
     * @param {State[]} state
     * @param {GridCell[]} cells
     */
    draw(linePoints, currentSelection, state, cells) {
        // Clear canvas
        this.ctx.beginPath();
        this.ctx.fillStyle = AppColors.BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);

        // Draw the grid
        this.drawGrid(cells);

        // Draw lines between selections
        if (linePoints.length > 0) {
            let prev = linePoints[0]
            this.ctx.beginPath()
            this.ctx.lineWidth = AppSizes.CONNECTING_LINE_WIDTH;
            this.ctx.strokeStyle = AppColors.LINE_COLOR;
            for (let i = 1; i < linePoints.length; ++i) {
                const point = linePoints[i];

                const hypotenuse = Math.sqrt((prev.x - point.x)**2 + (prev.y - point.y)**2);
                const sinAlpha = (prev.y - point.y) / hypotenuse;
                const cosAlpha = (prev.x - point.x) / hypotenuse;
                const p1 = {
                    x: prev.x - AppSizes.LETTER_CIRCLE_RADIUS * cosAlpha,
                    y: prev.y - AppSizes.LETTER_CIRCLE_RADIUS * sinAlpha
                };
                const p2 = {
                    x: point.x + AppSizes.LETTER_CIRCLE_RADIUS * cosAlpha,
                    y: point.y + AppSizes.LETTER_CIRCLE_RADIUS * sinAlpha
                };

                this.ctx.moveTo(p1.x, p1.y)
                this.ctx.lineTo(p2.x, p2.y)
                prev = point
            }
            this.ctx.stroke()
        }

        // Draw selected text
        this.ctx.fillStyle = AppColors.SELECTED_LETTER_COLOR;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(currentSelection, this.canvasSettings.width / 2, this.canvasSettings.height / 2);

        // Draw each letter and a circle around it
        for (let i = 0; i < state.length; ++i) {
            const x = state[i].x;
            const y = state[i].y;
            const letterX = state[i].letterX;
            const letterY = state[i].letterY;
            const letter = state[i].letter;
            // Draw the letter circle
            this.ctx.beginPath();
            this.ctx.strokeStyle = AppColors.CIRCLE_COLOR;
            this.ctx.lineWidth = AppSizes.CIRCLE_LINE_WIDTH;
            this.ctx.arc(x, y, AppSizes.LETTER_CIRCLE_RADIUS, 0, Math.PI * 2);
            this.ctx.stroke();
            // Draw the letter
            this.ctx.fillStyle = AppColors.LETTER_COLOR;
            if (state[i].selected) {
                this.ctx.fillStyle = AppColors.SELECTED_LETTER_COLOR;
            }
            this.ctx.font = AppSizes.SELECTOR_TEXT_FONT;
            this.ctx.fillText(letter, letterX, letterY);
        }
    }
};