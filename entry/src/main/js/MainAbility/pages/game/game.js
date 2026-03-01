import router from '@ohos.router';
import { Controller } from '../../lib/controller'
import { Renderer } from '../../lib/renderer'
import { CanvasSettings } from '../../common/settings/canvas-settings';
import { AppSizes } from '../../common/settings/app-sizes';

export default {
    data: {
        /* @type Controller */
        controller: null,
        canvasWidth: CanvasSettings.getInstance().width,
        canvasHeight: CanvasSettings.getInstance().height,
        shufflePos: { x: 0, y: 0 },
        shuffleSize: { width: 0, height: 0 },
        hintPos: { x: 0, y: 0 },
        hintSize: { width: 0, height: 0 },
        hintsLeft: 0
    },
    onInit() {
    },
    onTouchStart(event) {
        this.controller.onTouchStart(event);
    },
    onLongPress(event) {
        this.controller.onLongPress(event);
    },
    onTouchCancel(event) {
        console.info(`Touch canceled`);
    },
    onTouchMove(event) {
        this.controller.onTouchMove(event);
    },
    onTouchEnd(event) {
        this.controller.onTouchEnd(event);
    },
    goBack() {
        router.replaceUrl({ uri: 'pages/index/index' });
    },
    onLevelComplete() {
        router.replaceUrl({ uri: 'pages/win/win' });
    },
    onHintClicked() {
        console.info(`Hint clicked`);
        this.setHintButtonSize(AppSizes.LETTER_CIRCLE_RADIUS - 4)
        setTimeout(() => {
            this.setHintButtonSize()
        }, 300);
        this.hintsLeft = this.controller.useHint()
    },
    onShuffleClicked() {
        console.info(`Shuffle clicked`);
        this.setShuffleButtonSize(AppSizes.LETTER_CIRCLE_RADIUS - 4)
        setTimeout(() => {
            this.setShuffleButtonSize()
        }, 300);
        this.controller.shuffle()
    },
    setShuffleButtonSize(radius = AppSizes.LETTER_CIRCLE_RADIUS) {
        this.shufflePos.x = this.controller.shufflePos.x - radius;
        this.shufflePos.y = this.controller.shufflePos.y - radius;
        this.shuffleSize.width = radius * 2;
        this.shuffleSize.height = this.shuffleSize.width;
    },
    setHintButtonSize(radius = AppSizes.LETTER_CIRCLE_RADIUS) {
        this.hintPos.x = this.controller.hintPos.x - radius;
        this.hintPos.y = this.controller.hintPos.y - radius;
        this.hintSize.width = radius * 2;
        this.hintSize.height = this.hintSize.width;
    },
    onShow() {
        const el = this.$refs.gameCanvas;
        const ctx = el.getContext('2d');
        this.renderer = Renderer.getInstance(ctx);
        this.controller = new Controller(this.renderer, this.onLevelComplete);
        this.controller.draw();
        this.setHintButtonSize()
        this.setShuffleButtonSize()
        this.hintsLeft = this.controller.hintsLeft
    },
};
