import router from '@ohos.router';

export default {
    data: {
        star1: { x: 0, y: 0 },
        star2: { x: 0, y: 0 },
        star3: { x: 0, y: 0 }
    },
    goPlay() {
        router.replaceUrl({
            uri: 'pages/game/game'
        });
    }
};
