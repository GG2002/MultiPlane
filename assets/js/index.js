window.onload = e => {
    let dbWidth = $(document.body).width();
    $("#log-light").css("left", (dbWidth / 2 - 190) + "px")
    logAnimateIn();
    $(".login").click(function () {
        logAnimateOut();
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
    let dbWidth = $(document.body).width();
    $("#log-light").css("left", (dbWidth / 2 - 190) + "px")
}
function logAnimateIn() {
    welcomeBGIn();
    $(".log-light").animate({
        opacity: '1'
    }, 300).animate({
        width: "800px"
    },100);
    setTimeout(() => {
        $(".log-light").animate({
            height: "360px"
        });
        setTimeout(() => {
            $("#log").animate({
                opacity: "1",
            }, 800).animate({
                border: '1px solid #ffffff'
            },100).animate({
                padding: "60px 32px",
            },200).css("backgroundColor", "rgba(0, 120, 200, 0.3)").css("box-shadow", "0 0 10px 1px #ffffff inset").addClass("flash");
            $(".log-light").addClass("flash");

            setTimeout(() => {
                $("#logo").fadeIn(500);
                $(".log").fadeIn(750);
                $("#log-bg").fadeIn(1000);
                $(".login").animate({
                    opacity: "1"
                }, 750);
            }, 500)
        }, 300)
    }, 300)

}
function logAnimateOut() {
    $(".login").fadeOut(400)
    $(".log").fadeOut(400)
    $("#log").animate({
        padding: "0",
        border: '0'
    }).animate({
        opacity: "0",
    }, 500);
    $("#log-bg").animate({
        opacity: "0",
        padding: "0"
    }).animate({
        border: '0'
    })
    setTimeout(() => {
        $(".log-light").animate({
            height: "0"
        }, 200).fadeOut();
        setTimeout(() => {
            welcomeBGOut()
        }, 500);
    }, 1000)

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
            $("#main").fadeIn(2000);
        }, 700);
    }, 1200)
}