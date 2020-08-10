window.onload = e => {
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
    console.log(dbHeight)
    $("#log").addClass('rotateIn');
    setTimeout(()=>{
        $('#log').css('opacity',1);
    },800)
    $("#welcome").css('height', dbHeight + 'px')
    setTimeout(() => {
        $("#log").removeClass('rotateIn')
        $("#log").addClass('lightChange')
    }, 1000);
    let door_left = document.querySelectorAll('.door-left');
    door_left.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
    let door_right = document.querySelectorAll('.door-right');
    door_right.forEach((e, w) => {
        e.style.top = w * dbHeight / 6 + 'px';
    })
    $(".login").click(function () {
        $("#welcome-bg").removeClass("door-light-change").addClass("fade").fadeOut(1000);
        $("#log").removeClass('lightChange').addClass('rotateOut').fadeOut(1200);
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