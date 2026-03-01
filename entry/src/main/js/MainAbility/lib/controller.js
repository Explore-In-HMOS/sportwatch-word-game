import { Renderer } from './renderer';
import { Grid } from './grid';
import { getLevel, getLevelIndex } from './level';
import { CanvasSettings } from '../common/settings/canvas-settings';
import { AppSizes } from '../common/settings/app-sizes';
import { AppColors } from '../common/settings/app-colors';

let touchEnd = { x: 0, y: 0 };

export class State {
    letter = '0'
    x = 0
    y = 0
    letterX = 0;
    letterY = 0;
    selected = false
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export class Controller {
    /** @type CanvasSettings **/
    canvasSettings = CanvasSettings.getInstance();

    /** @type string[] **/
    letters = [];

    currentSelection = "";

    /** @type State[] **/
    selectionState = [];

    /** @type number **/
    angleIncrement = Math.PI / 10;

    /** @type {{x: number, y: number}[]} **/
    linePoints = [];

    /** @type Grid **/
    grid = null;

    /** @type {{x: number, y: number}} **/
    shufflePos = { x: 0, y: 0 };

    /** @type {{x: number, y: number}} **/
    hintPos = { x: 0, y: 0 };

    hintsLeft = 2;

    constructor(renderer, levelCompleteCb) {
        this.letters = getLevel().letters;
        this.grid = new Grid(getLevel().data, getLevel().answers);
        /** @type Renderer **/
        this.renderer = renderer
        this.initSelectorCoordinates();
        this.levelCompleteCb = levelCompleteCb;
    }

    getInstance() {
        if (Controller._instance == null) {
            Controller._instance = new Controller()
        }
        return Controller._instance;
    }

    initSelectorCoordinates() {
        this.selectionState = [];
        console.info('Init start')
        // Initialize state data, update select
        const nButtons = this.letters.length + 2;
        this.angleIncrement = (2 * Math.PI) / nButtons;
        const radius = this.canvasSettings.getRadius();
        // Generate radial points
        let points = []
        for (let i = 0; i < nButtons; ++i) {
            const angle = (i + 1.5) * this.angleIncrement - Math.PI / 2;
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let cX = this.canvasSettings.width / 2;
            let cY = this.canvasSettings.height / 2;
            x += cX;
            y += cY;
            points.push({ x: x, y: y });

        }

        // Shuffle Button
        this.shufflePos = points[nButtons-1];

        // Hint Button
        this.hintPos = points[nButtons-2];

        for (let i = 0; i < this.letters.length; ++i) {
            const x = points[i].x;
            const y = points[i].y;
            let letterX = x; // NOTE: Centered using textAlign
            let letterY =
                y - Math.floor(AppSizes.SELECTOR_TEXT_SIZE / 2); // NOTE: Can't center with textBaseline
            this.selectionState.push({
                letter: this.letters[i],
                x: x,
                y: y,
                letterX: letterX,
                letterY: letterY,
                selected: false
            })
        }
        console.info(this.letters.toString())
        console.info('Init complete')
    }

    draw() {
        this.renderer.draw(this.linePoints, this.currentSelection, this.selectionState,
            this.grid.data)
    }

    updateSelections() {
        for (let i = 0; i < this.selectionState.length; ++i) {
            const x = this.selectionState[i].x;
            const y = this.selectionState[i].y;
            const distance = (touchEnd.x - x)**2 + (touchEnd.y - y)**2;
            if (distance <= (AppSizes.LETTER_CIRCLE_TOUCH_RADIUS**2)) {
                if (!this.selectionState[i].selected) {
                    this.currentSelection = this.currentSelection + this.selectionState[i].letter;
                    this.linePoints.push({ x: x, y: y });
                }
                if (!this.selectionState[i].selected) {
                    this.selectionState[i].selected = true
                    this.draw()
                }
            }
        }
    }

    clearSelections() {
        for (let i = 0; i < this.selectionState.length; ++i) {
            this.selectionState[i].selected = false
        }
        this.currentSelection = "";
        this.linePoints = []
    }

    onTouchStart(event) {
        console.info(`TouchStart X: ${event.globalX}`);
        console.info(`TouchStart Y: ${event.globalY}`);
        touchEnd = { x: event.globalX, y: event.globalY };
        this.updateSelections()
    }

    onLongPress(event) {
        console.info(`TouchLongPress X: ${event.globalX}`);
        console.info(`TouchLongPress Y: ${event.globalY}`);
        // NOTE: Touch end isn't triggered when a long press is 
        // released so have to disable it for now
    }

    onTouchMove(event) {
        touchEnd = { x: event.globalX, y: event.globalY };
        this.updateSelections()
    }

    onTouchEnd(event) {
        console.info(`TouchEnd X: ${event.globalX}`);
        console.info(`TouchEnd Y: ${event.globalY}`);
        touchEnd = { x: event.globalX, y: event.globalY };
        // NOTE: SELECTION COMPLETE, UPDATE GAME DATA HERE BEFORE CLEARING IT!
        console.info(`Selected: ${this.currentSelection}`);
        if (this.currentSelection.length > 1) {
            this.checkWord();
        }
        // Clear selection for new input
        this.clearSelections()
        this.draw()
    }

    onClick(event) {
        const pt = { x: event.globalX, y: event.globalY };
    }

    checkWord() {
        this.grid.searchWord(this.currentSelection, () => {
            this.draw()
        }, this.levelCompleteCb)
    }

    shuffle() {
        shuffleArray(this.letters)
        this.initSelectorCoordinates();
        this.draw()
    }

    useHint() {
        if (this.hintsLeft > 0) {
            this.grid.useHint(() => {
                this.draw();
            })
            this.hintsLeft--;
        }
        return this.hintsLeft;
    }
};