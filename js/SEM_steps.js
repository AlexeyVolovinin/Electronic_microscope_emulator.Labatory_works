var SEM_step_num = 1;

function next_step() {
    let callback = 'SEM_step_' + SEM_step_num;
    window[callback]()
}

function SEM_step_1() {
    display_instruction();
    for (let i = 1; i <= 105; i++) {
       sprites[i - 1] = document.getElementById("b" + i);
    }
    $("#top-instructions").toggleClass("top-instructions-on", true);
    alpha = 1;
    ctx.globalAlpha = alpha;
    SEMChamberAnimation(false, 0, 10);
    activate_sqr_btn("#btn-vent");
    SEM_step_num = 2;
}

function SEM_step_2() {
    display_instruction();
    deactivate_sqr_btn("#btn-vent");
    activate_sqr_btn("#btn-chamber");
    SEM_step_num = 3;
}

function SEM_step_3() {
    display_instruction();
    stopSEMLoop();
    $("#btn-chamber").html("CLOSE");
    activate_sqr_btn("#btn-chamber");
    $("#btn-chamber").toggleClass("btn-active", false);
    SEM_step_num = 4;
}

function SEM_step_4() {
    display_instruction();
    deactivate_sqr_btn("#btn-chamber");
    activate_sqr_btn("#btn-evacuate");
    SEM_step_num = 5;
}

function SEM_step_5() {
    display_instruction();
    deactivate_sqr_btn("#btn-evacuate");
    activate_slider("#z-pos");
    SEM_step_num = 6;
}

function SEM_step_6() {
    display_instruction();
    deactivate_slider("#z-pos");
    activate_dd("#samples");
    SEM_step_num = 7;
}

function SEM_step_7() {
    display_instruction();
    activate_slider("#acc-volt");
    SEM_step_num = 8;
}

function SEM_step_8() {
    display_instruction();
    activate_sqr_btn("#btn-ht");
    SEM_step_num = 9;
}

function SEM_step_9() {
    display_instruction();
    deactivate_slider("#acc-volt");
    activate_slider("#spot-size");
    SEM_step_num = 10;
}

function SEM_step_10() {
    display_instruction();
    deactivate_slider("#spot-size");
    activate_slider("#z-pos");
    SEM_step_num = 11;
}

function SEM_step_11() {
    display_instruction();
    deactivate_slider("#z-pos");
    activate_slider("#brightness");
    activate_slider("#contrast");
    SEM_step_num = 12;
}

function SEM_step_12() {
    display_instruction();
    activate_slider("#focus-coarse");
    SEM_step_num = 13;
}

function SEM_step_13() {
    display_instruction();
    activate_sqr_btn("#btn-scan1");
    SEM_step_num = 14;
}

function SEM_step_14() {
    $('#top-instructions').css("font-size", "1vw");
    display_instruction();
    activate_slider("#astigmatism-x");
    activate_slider("#astigmatism-y");
    SEM_step_num = 15;
}

function SEM_step_15() {
    display_instruction();
    activate_slider("#acc-volt");
    activate_slider("#spot-size");
    activate_slider("#z-pos");
    activate_slider("#brightness");
    activate_slider("#contrast");
    activate_slider("#magnification");
    $("#btn-se").attr('disabled', false);
    activate_sqr_btn("#btn-scan2");
    activate_sqr_btn("#btn-optimal");
    $(".se-bse-chckbx").toggleClass("btn-disabled",false);
    $(".current-control").toggleClass("current-control", false);
    $(".current-slider").toggleClass("current-slider", false);
    SEM_step_num = 16;
}

function SEM_step_16() {
    $('#top-instructions').css("font-size", "1.2vw");
    display_instruction();
    activate_sqr_btn("#btn-save");
    SEM_step_num = 17;
}

function SEM_step_17() {
    display_instruction();
    // SEM_step_num = 18;
}