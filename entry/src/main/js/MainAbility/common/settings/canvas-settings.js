import { AppSizes } from './app-sizes';

export class CanvasSettings {
    static _instance = null;
    /** @type number **/
    canvasWidth = AppSizes.DISPLAY_WIDTH;
    /** @type number **/
    canvasHeight = AppSizes.DISPLAY_HEIGHT;
    /** @type number **/
    x = 0;
    /** @type number **/
    y = 0;

    /** @type boolean **/
    isFailed = false;

    static CELL_HIGHLIGHT_TIME_MS = 500;

    /**
     * @param {number} canvasWidth;
     * @param {number} canvasHeight;
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasWidth = canvasHeight;
    }

    /**
     * @return {CanvasSettings}
     */
    static getInstance() {
        if (CanvasSettings._instance == null) {
            CanvasSettings._instance = new CanvasSettings(AppSizes.DISPLAY_WIDTH, AppSizes.DISPLAY_HEIGHT);
        }
        return CanvasSettings._instance;
    }

    /**
     * @returns {number}
     */
    get width() {
        return this.canvasWidth;
    }

    /**
     * @param {number} width
     */
    set width(width) {
        this.canvasWidth = width;
    }

    /**
     * @returns {number}
     */
    get height() {
        return this.canvasHeight;
    }

    /**
     * @param {number} height
     */
    set height(height) {
        this.canvasHeight = height;
    }

    getGridTopLeft() {
        return { x: AppSizes.GRID_MARGIN, y: AppSizes.GRID_MARGIN };
    }

    getOuterCircleRadius() {
        return this.canvasWidth < this.canvasHeight ? Math.floor(this.canvasWidth / 2) :
            Math.floor(this.canvasHeight / 2);
    }

    getGridBottomRight() {
        return { x: AppSizes.DISPLAY_WIDTH - AppSizes.GRID_MARGIN, y: AppSizes.DISPLAY_HEIGHT - AppSizes.GRID_MARGIN };
    }

    getGridWidth() {
        return this.getGridBottomRight().x - this.getGridTopLeft().x;
    }

    getGridHeight() {
        return this.getGridBottomRight().y - this.getGridTopLeft().y;
    }

    getGridCellOffset() {
        return {
            x: Math.floor((AppSizes.DISPLAY_WIDTH - this.getGridWidth()) / 2),
            y: Math.floor((AppSizes.DISPLAY_HEIGHT - this.getGridHeight()) / 2)
        };
    }

    getCellTextOffset() {
        return Math.floor(AppSizes.CELL_TEXT_SIZE / 2);
    }

    getRadius() {
        return this.getOuterCircleRadius() - AppSizes.LETTER_CIRCLE_RADIUS * 1.5;
    }
}