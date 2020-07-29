window.onload = function () {
    let button = document.querySelector('#target');
    // 监听事件 注意不同浏览器的兼容性问问题　　　　　　　// 错误事件为：fullscreenerror ， 同样注意前缀
    document.addEventListener('fullscreenchange', changeFullScreenButton)
    document.addEventListener('webkitfullscreenchange', changeFullScreenButton)
    document.addEventListener('mozfullscreenchange', changeFullScreenButton)
    document.addEventListener('MSFullscreenChange', changeFullScreenButton)
    // 图片点击切换全屏
    if (isFUllScreenEnabled()) {
        button.addEventListener('click', function () {
            if (hasFullScreenElement()) {
                exitFullScreen();
            } else {
                setFullScreen(document.body);
            }
        });
    } else {
        console.log('此浏览器不支持全屏');
    }
}

// 判断浏览器是否支持全屏
function isFUllScreenEnabled() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
}

// 判断是否有已全屏的元素
function hasFullScreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
}

// 将目标元素设置为全屏展示
function setFullScreen(target) {
    if (target.requestFullscreen) {
        target.requestFullscreen();
    }
    if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
    }
    if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
    }
    if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
    }
}

// 文档退出全屏
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function changeFullScreenButton() {
    if (hasFullScreenElement()) {
        document.querySelector('#target').setAttribute('style', 'visibility: hidden;')
    } else {
        document.querySelector('#target').setAttribute('style', 'position: fixed;top: 0;left: 0;')
    }

}
