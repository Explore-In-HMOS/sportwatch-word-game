import router from '@ohos.router';
import { allLevelsComplete, getLevelIndex, nextLevel, numberOfLevels, restartLevel } from '../../lib/level';

export default {
    data: {
        starFontSize: 45,
        levelId: getLevelIndex() + 1,
        progress: ((getLevelIndex() + 1) / numberOfLevels()) * 100,
        nextText: 'NEXT'
    },
    onInit() {
        this.loopStars();
        console.info(`Completion: %${this.progress}`)
        if (allLevelsComplete()) {
            this.nextText = 'RESTART';
        }

    },
    loopStars() {
        let increment = 1;
        const intervalId = setInterval(() => {
            increment = this.starFontSize > 50 && increment > 0 ? -increment : increment;
            increment = this.starFontSize < 45 && increment < 0 ? -increment : increment;
            this.starFontSize += increment;
        }, 50)
    },
    nextLevel() {
        router.replaceUrl({
            uri: 'pages/game/game'
        });
        if (allLevelsComplete()) {
            restartLevel()
        } else {
            nextLevel()
        }
    },
    goMenu() {
        router.replaceUrl({
            uri: 'pages/index/index'
        });
    }
};
