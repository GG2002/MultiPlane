window.onload = e => {
    welcomeBGIn();
    logAnimateIn();
    $(".login").click(function () {
        logAnimateOut();
        welcomeBGOut();
    })
}
window.onresize = e => {
    let dbHeight = $(document.body).height();
    let door_left = document.querySelectorAll('.door-left');
    door_left.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
    let door_right = document.querySelectorAll('.door-right');
    door_right.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
}
function logAnimateIn() {
    $("#log").animate({
        opacity: "1",
        border: '1px solid #ffffff',
    }).animate({
        width: "360px"
    }).animate({
        height: "360px",
        padding: "60px 32px",
    })
    setTimeout(() => {
        $("#logo").fadeIn(1000);
        $(".log").fadeIn(1500);
        $("#log-bg").fadeIn(2000);
        $(".login").animate({
            opacity: "1"
        }, 2000);
        $("#log").addClass("flash");
    }, 1500)

}
function logAnimateOut() {
    $("#log").animate({
        opacity: "1",
        height: "0px",
        padding: "0"
    }).animate({
        width: "0"
    }).animate({
        border: '0'
    })
    $(".login").fadeOut()
    $(".log").fadeOut()
    $("#log-bg").animate({
        opacity: "1",
        height: "0px",
        padding: "0"
    }).animate({
        width: "0"
    }).animate({
        border: '0'
    })
}
function welcomeBGIn() {
    let pathEls = document.querySelectorAll('path');
    for (let i = 0; i < pathEls.length; i++) {
        let pathEl = pathEls[i];
        let offset = anime.setDashoffset(pathEl);
        pathEl.setAttribute('stroke-dashoffset', offset);
        anime({
            targets: pathEl,
            strokeDashoffset: [offset, 0],
            duration: anime.random(1000, 3000),
            delay: anime.random(0, 2000),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            autoplay: true
        });
    }
    let dbHeight = $(document.body).height();
    $("#welcome").css('height', dbHeight + 'px')
    let door_left = document.querySelectorAll('.door-left');
    door_left.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
    let door_right = document.querySelectorAll('.door-right');
    door_right.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
}
function welcomeBGOut() {
    $("#welcome-bg").removeClass("door-light-change").addClass("fade").fadeOut(1000);
    setTimeout(() => {
        anime({
            targets: '.door-right',
            translateX: 580,
            delay: anime.stagger(100) // 每个元素的延迟增加100毫秒。
        });
        anime({
            targets: '.door-left',
            translateX: -580,
            delay: anime.stagger(100) // 每个元素的延迟增加100毫秒。
        });
        setTimeout(() => {
            $("#welcome").fadeOut(2500);
            $("#main").fadeIn(3000);
        }, 700);
    }, 1200)
}