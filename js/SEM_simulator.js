/* SEM_simulator javascript functions    

Created  by Andres Vasquez for Microscopy Australia's www.myscope.training
 —— www.andresvasquez.net ——
copyright:This work is licensed under a Creative Commons Attribution 4.0 International License.

************************************************************************/
var canvas = document.querySelector("#micrograph-canvas");
var ctx = canvas.getContext("2d");
var bufferCanvas = document.createElement("canvas");
var bufferCanvasCtx = bufferCanvas.getContext("2d");
// var bufferCanvas2 = document.createElement("canvas");
// var bufferCanvasCtx2 = bufferCanvas2.getContext("2d");
// var bufferCanvasMag = document.createElement("canvas");
// var bufferCanvasCtxMag = bufferCanvasMag.getContext("2d");
var bufferCanvasAstigmTrim = document.createElement("canvas");
var bufferCanvasCtxAstigmTrim = bufferCanvasAstigmTrim.getContext("2d");
// var bufferCanvasZposTrim = document.createElement("canvas");
// var bufferCanvasCtxZposTrim = bufferCanvasZposTrim.getContext("2d");
var example_img = document.getElementById("example-img");
var w = 930;
var h = 698;
canvas.width = w;
canvas.height = h;
bufferCanvas.width = w;
bufferCanvas.height = h;
bufferCanvasAstigmTrim.width = w;
bufferCanvasAstigmTrim.height = h;

var promise_fullfilled_num = 0;
var promises_total = 10;
var sprites = [];

var alpha = 0;
var delta = 0.005;
var counter = 0;
var tvCounter = 2;

var noise_toggle = true;
var voltage_arr = ["0Kv","5Kv",  "10Kv", "15Kv", "20Kv", "30Kv"];
var spot_arr = ["1nm", "5nm", "10nm", "15nm", "20nm"];
var zpos_arr = ["25mm", "20mm", "15mm", "10mm", "5mm", "0mm"];


const promise1 = Loader.jpg("../images/simulator/SEM/wood_SE.jpg", "SE-sample1");
const promise2 = Loader.jpg("../images/simulator/SEM/pollen_SE.jpg", "SE-sample2");
const promise3 = Loader.jpg("../images/simulator/SEM/rock_SE.jpg", "SE-sample3");
const promise4 = Loader.jpg("../images/simulator/SEM/steel_SE.jpg", "SE-sample4");
const promise5 = Loader.jpg("../images/simulator/SEM/wood_BSE.jpg", "BSE-sample1");
const promise6 = Loader.jpg("../images/simulator/SEM/pollen_BSE.jpg", "BSE-sample2");
const promise7 = Loader.jpg("../images/simulator/SEM/rock_BSE.jpg", "BSE-sample3");
const promise8 = Loader.jpg("../images/simulator/SEM/steel_BSE.jpg", "BSE-sample4");
const samples_arr = [promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8];

const optimalImg1 = Loader.jpg("../images/simulator/SEM/optimal/wood_SE.jpg", "optimal_SE-sample1");
const optimalImg2 = Loader.jpg("../images/simulator/SEM/optimal/pollen_SE.jpg", "optimal_SE-sample2");
const optimalImg3 = Loader.jpg("../images/simulator/SEM/optimal/rock_SE.jpg", "optimal_SE-sample3");
const optimalImg4 = Loader.jpg("../images/simulator/SEM/optimal/steel_SE.jpg", "optimal_SE-sample4");
const optimalImg5 = Loader.jpg("../images/simulator/SEM/optimal/wood_BSE.jpg", "optimal_BSE-sample1");
const optimalImg6 = Loader.jpg("../images/simulator/SEM/optimal/pollen_BSE.jpg", "optimal_BSE-sample2");
const optimalImg7 = Loader.jpg("../images/simulator/SEM/optimal/rock_BSE.jpg", "optimal_BSE-sample3");
const optimalImg8 = Loader.jpg("../images/simulator/SEM/optimal/steel_BSE.jpg", "optimal_BSE-sample4");
const optimalImg_arr = [optimalImg1, optimalImg2, optimalImg3, optimalImg4, optimalImg5, optimalImg6, optimalImg7, optimalImg8];

var currentSEsample;
var currentBSEsample;
var optimalSEsample;
var optimalBSEsample;
var stageRotation_value = 0;
var stageRotation_minValue = 72;
var stageRotation_maxValue = 105;
var stageRotation_sample1;
var stageRotation_sample2;
var stageRotation_sample3;
var stageRotation_sample4;
var maxBlur;
var minBlur;
var minFineBlur;
var allFocus;
var spotsizeFocus = -7;
var brightSlider = 0;
var contrastSlider = -182;
var focusFine = 0;
var focus1 = 0;
var zposFocus = 0;
var reducedBlur;
var zposTrim = 0;
var magnifcTrim = 1;
var astigmXTrim = 0.03;
var astigmYTrim = 1;
var tempx, tempy;
var astig_x;
var astig_y;
var astig_xSlider = 0;
var astig_ySlider = 0;

var accVoltSlider;
var spotsizeBright = 30;
var currentMicrograph = new Image();
var optimalMicrograph = new Image();
var htOn = false;
var noise = "tv_rate";
var dotvNoise;
var doTheNoise;
var p1 = 0.3;
var p2 = 0.59;
var p3 = 0.11;
var er = 0; // extra red
var eg = 0; // extra green
var eb = 0; // extra blue
var fRate = 20;
var fromScanModes = false;
var imgData;
var imgData_forScan;
var scaleBar_size;
var scaleBar_unit;
bse_switch = false;

var brght_bol = false;
var cntrs_bol = false;
var focusTimeout;


// ======================= START ======================== //
const sample_reset_fn = () => {
    maxBlur = getRandomInt(80, 180);
    minBlur = getRandomInt(30, 70);
    minFineBlur = getRandomInt(-60, -140);
    contrastSlider = getRandomInt(-182, 182);
    reducedBlur = (getRandomInt(28, 50)) / 10;
    astig_x = getRandomInt(0, 16);
    astig_y = getRandomInt(0, 16);
    astig_xSlider = 0;
    astig_ySlider = 0;
}
// ======================= END ======================== //
// ======================= START ======================== //

var activate_sqr_btn = (dom_name) => {
    $(dom_name).toggleClass("btn-disabled", false);
    $(dom_name).prop('disabled', false);
    $(dom_name).css("cursor", "pointer");
    $(dom_name).toggleClass("current-control", true);
}

var deactivate_sqr_btn = (dom_name, on_off = "off") => {
    $(dom_name).toggleClass("btn-disabled", true);
    $(dom_name).toggleClass("btn-active", false);
    $(dom_name).prop('disabled', true);
    $(dom_name).prop('value', on_off);
    $(dom_name).toggleClass("current-control", false);
}

var activate_slider = (dom_name) => {
    $(dom_name).slider("enable");
    $(dom_name).toggleClass("current-slider", true);
}

var deactivate_slider = (dom_name) => {
    $(dom_name).slider("disable");
    $(dom_name).toggleClass("current-slider", false);
}

var activate_dd = (dom_name) => {
    $(dom_name).selectmenu("enable");
    $(dom_name + "-button").toggleClass("current-control", true);
}

var deactivate_dd = (dom_name) => {
    $(dom_name).selectmenu("disable");
    $(dom_name + "-button").toggleClass("current-control", false);
}
// ======================= END ======================== //
// ======================= START ======================== //
const loadChamber = (id_str, arr) => {
    let data_promises = [];
    for (let i = 1; i <= 105; i++) {
        var promise = Loader.jpg(`images/simulator/SEM/chamber/chamber_00${i}.jpg`, `b${i}`);
        data_promises.push(promise);
    }
    Promise.all(data_promises).then(messages => {
        SEM_step_1();
    }).catch(error => {
        console.error("Rejected!", error);
    });
}
// =======================  END END  ==================== //
// ======================= START ======================== //

// ======================= START ======================== //
const load_samples = () => {
    Promise.all(samples_arr).then(messages => {
        loadChamber();
    }).catch(error => {
        console.error("Rejected!", error);
    });
}
load_samples();
// =======================  END END  ==================== //

// ======================= START ======================== //
const load_optimals = () => {
    Promise.all(optimalImg_arr).then(messages => {
        console.log("optimal images loaded");
    }).catch(error => {
        console.error("Rejected!", error);
    });
}
load_optimals();
// =======================  END END  ==================== //
// ======================= START INSTRUCTIONS ======================== //
const display_instruction = () => {
    // instruct_text = SEM_step_num + '. ' + eval('instruction_step_' + SEM_step_num);
    instruct_text = eval('instruction_step_' + SEM_step_num);
    $("#top-instructions-txt").fadeTo(100, 0, function () {
        $("#top-instructions-txt").html(instruct_text);
        $("#top-instructions-txt").fadeTo(1000, 1);
    });

};
// =======================  END END  ==================== //

// ======================= ================ END END SIMULATOR (INIT)================= ==================== //
// ======================= ============== START SLIDERS ============= ======================== //
$(document).ready(function () {
    if (localStorage.getItem('cookies')) {
        setConsent();
    } else {
        $('#cookies-modal').toggleClass('totally-hidden', false);
    }
    sample_reset_fn();
    $("#acc-volt").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 5,
        animate: true,
        start: function (event, ui) {
            $("#acc-volt").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            accVoltSlider = parseInt(scroll_equation(ui.value, 0, 4, -20, 50));
            if (htOn) drawIt();
        },
        stop: function (event, ui) {
            accVoltSlider = parseInt(scroll_equation(ui.value, 0, 4, -20, 50));
            if (SEM_step_num == 8) {
                $("#btn-ht").toggleClass("btn-disabled", false);
                next_step();
            }
        }
    });
    $("#acc-volt").slider("pips", {
        rest: "label",
        labels: voltage_arr
    })
    $("#acc-volt").slider("disable");
    $("#spot-size").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 4,
        step: 1,
        animate: true,
        start: function (event, ui) {
            $("#spot-size").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            spotsizeBright = parseInt(scroll_equation(ui.value, 0, 4, -15, 30));
            if (spotsizeBright < 0) {
                spotsizeBright *= -2;
            };
            spotsizeFocus = parseInt(scroll_equation(ui.value, 0, 5, -7, 21));
            focus_fn();
        },
        stop: function (event, ui) {
            if (SEM_step_num == 10) next_step();
        }
    });
    $("#spot-size").slider("pips", {
        rest: "label",
        labels: spot_arr
    })
    $("#spot-size").slider("disable");
    $("#z-pos").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 5,
        step: 1,
        animate: true,
        start: function (event, ui) {
            $("#z-pos").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            zposFocus = parseInt(scroll_equation(ui.value, 0, 5, 0, 8));
            zposTrim = scroll_equation(ui.value, 0, 5, 0, 0.20);
            if (SEM_step_num == 6 && ui.value > 3 && ui.value <= 5) {
                return false;
            } else {
                focus_fn();
            }
        },
        stop: function (event, ui) {
            if (SEM_step_num == 6 && ui.value <= 3 && ui.value != 0 ) {
                $("#z-pos").toggleClass("current-slider", false);;
                $("#z-pos").slider("disable");
                stopSEMLoop();
                SEMChamberAnimation(true, 55, 66, liftStage);
            }

            if (SEM_step_num != 6 && zposFocus == 8) {
                $("#micrograph-wrapper").toggleClass("totally-hidden", true);
                $(".broken").toggleClass("totally-hidden", false);
            }

            if (SEM_step_num == 11) {
                next_step();
            }
        }
    });
    $("#z-pos").slider("pips", {
        rest: "label",
        labels: zpos_arr
    })
    $("#z-pos").slider("disable");
    $("#brightness").slider({
        range: "min",
        min: -100,
        max: 150,
        value: 0,
        animate: true,
        start: function (event, ui) {
            $("#brightness").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            brightSlider = ui.value;
            drawIt();
        },
        stop: function (event, ui) {
            brght_bol = true;
            if (SEM_step_num == 12 && cntrs_bol == true) next_step();
        },
        disabled: true
    });
    $("#contrast").slider({
        range: "min",
        min: -182,
        max: 182,
        value: contrastSlider,
        animate: true,
        start: function (event, ui) {
            $("#contrast").toggleClass("current-slider", false);
            contrastSlider = ui.value;
        },
        slide: function (event, ui) {
            contrastSlider = ui.value;
            drawIt();
        },
        stop: function (event, ui) {
            cntrs_bol = true;
            if (SEM_step_num == 12 && brght_bol == true) next_step();
        },
        disabled: true
    });
    $("#magnification").slider({
        range: "min",
        min: 10,
        max: 35,
        value: 10,
        animate: true,
        start: function (event, ui) {
            $("#magnification").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            magnifcTrim = ui.value / 10;
            drawIt();
        },
        disabled: true
    });
    $("#focus-coarse").slider({
        range: "min",
        min: 1,
        max: maxBlur,
        value: 30,
        animate: true,
        start: function (event, ui) {
            $("#focus-coarse").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            focus_fn();
        },
        stop: function (event, ui) {
            if (SEM_step_num == 13 && allFocus <= 6.5) next_step();
        },
        disabled: true
    });
    $("#focus-fine").slider({
        range: "min",
        min: 0,
        max: 100 + minBlur,
        value: 10,
        animate: true,
        start: function (event, ui) {
            $("#focus-fine").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            focusFine = ui.value / 10;
            if (focusFine > allFocus) focusFine = allFocus - (focusFine - allFocus);
            focus_fn();
        },
        stop: function (event, ui) {
            if (SEM_step_num == 14) next_step();
        },
        disabled: true
    });
    $("#astigmatism-x").slider({
        range: "min",
        min: 0,
        max: 40,
        value: 0,
        animate: true,
        start: function (event, ui) {
            $("#astigmatism-x").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            astig_xSlider = ui.value;
            astigm_fn(astig_x, astig_y);
            drawIt();
        },
        stop: function (event, ui) {
           let aa = astig_x - astig_xSlider;
           let bb = astig_y - astig_ySlider;
            if ((aa) < 0) aa = aa * (-1);
            if ((bb) < 0) bb = bb * (-1);
            if (SEM_step_num == 15 && aa <=4 && bb <=4) next_step();
        },
        disabled: true
    });
    $("#astigmatism-y").slider({
        range: "min",
        min: 0,
        max: 40,
        value: 0,
        animate: true,
        start: function (event, ui) {
            $("#astigmatism-y").toggleClass("current-slider", false);
        },
        slide: function (event, ui) {
            astig_ySlider = ui.value;
            astigm_fn(astig_x, astig_y);
            drawIt();
        },
        stop: function (event, ui) {
           let aa = astig_x - astig_xSlider;
           let bb = astig_y - astig_ySlider;
            if ((aa) < 0) aa = aa * (-1);
            if ((bb) < 0) bb = bb * (-1);
            if (SEM_step_num == 15 && aa <=4 && bb <=4) next_step();
        },
        disabled: true
    });
    $("#samples").selectmenu({
        select: function (event, data) {
            $("#samples-button").toggleClass("current-control", false);
            switch (data.item.value) {
                case "sample1":
                    clear_Intervals();
                    currentSEsample = document.getElementById("SE-sample1");
                    currentBSEsample = document.getElementById("BSE-sample1");
                    optimalSEsample = document.getElementById("optimal_SE-sample1");
                    optimalBSEsample = document.getElementById("optimal_BSE-sample1");
                    scaleBar_size = 5.4;
                    scaleBar_unit = 20;
                    if (stageRotation_value != 76 && htOn == false) {
                        stageRotation_sample1 = new stageRotation(stageRotation_value, 76);
                        stageRotation_sample1.start();
                    }
                    break;
                case "sample2":
                    clear_Intervals();
                    currentSEsample = document.getElementById("SE-sample2");
                    currentBSEsample = document.getElementById("BSE-sample2");
                    optimalSEsample = document.getElementById("optimal_SE-sample2");
                    optimalBSEsample = document.getElementById("optimal_BSE-sample2");
                    scaleBar_size = 5.3;
                    scaleBar_unit = 5;
                    if (stageRotation_value != 88 && htOn == false) {
                        stageRotation_sample2 = new stageRotation(stageRotation_value, 88);
                        stageRotation_sample2.start();
                    }
                    break;
                case "sample3":
                    clear_Intervals();
                    currentSEsample = document.getElementById("SE-sample3");
                    currentBSEsample = document.getElementById("BSE-sample3");
                    optimalSEsample = document.getElementById("optimal_SE-sample3");
                    optimalBSEsample = document.getElementById("optimal_BSE-sample3");
                    scaleBar_size = 4.1;
                    scaleBar_unit = 10;
                    if (stageRotation_value != 93 && htOn == false) {
                        stageRotation_sample3 = new stageRotation(stageRotation_value, 93);
                        stageRotation_sample3.start();
                    }
                    break;
                case "sample4":
                    clear_Intervals();
                    currentSEsample = document.getElementById("SE-sample4");
                    currentBSEsample = document.getElementById("BSE-sample4");
                    optimalSEsample = document.getElementById("optimal_SE-sample4");
                    optimalBSEsample = document.getElementById("optimal_BSE-sample4");
                    scaleBar_size = 6.6;
                    scaleBar_unit = 5;
                    if (stageRotation_value != 99 && htOn == false) {
                        stageRotation_sample4 = new stageRotation(stageRotation_value, 99);
                        stageRotation_sample4.start();
                    }
                    break;
            }
            currentMicrograph.src = currentSEsample.src;
            optimalMicrograph.src = optimalSEsample.src;
            example_img.src = optimalMicrograph.src;
            sample_reset_fn();
            if (htOn) {   
            astigm_fn(astig_x, astig_y); 
            $("#astigmatism-x").slider("value", 0);
            $("#astigmatism-y").slider("value", 0); 
            $("#focus-fine").slider("option", "max", 100 + minBlur); 
            $("#focus-fine").slider("value", 10);
            $("#focus-fine").slider("value", $("#focus-fine").slider("value"));         
            $("#focus-coarse").slider("option", "max", maxBlur);
            $("#focus-coarse").slider("value", 30);
            $("#focus-coarse").slider("value", $("#focus-coarse").slider("value"));  
            $("#contrast").slider("value", contrastSlider);
            $("#brightness").slider("value", 0);
            brightSlider = $("#brightness").slider("value"); 
            focusTimeout = setTimeout(changeSample_fn, 100);
                }
        },
        disabled: true
    });
    $("#optimal-div").resizable();
    $(".modal").draggable({handles: "n, e, s, w, sw, se, nw, ne"});
    triggerResize();
});
// ===================== ============== END SLIDERS END ============= ======================== //
triggerResize();
window.onresize = triggerResize;

// ======================= START ======================== //
$('.btn').click(function (e) {
    if (e.target.value == "off") {
        e.target.value = "on";
        $("#" + e.target.id).toggleClass("btn-active", true);
    } else {
        e.target.value = "off";
        $("#" + e.target.id).toggleClass("btn-active", false);
    }
    e.target.disabled = true;
    $("#" + e.target.id).css("cursor", "not-allowed");
    $("#" + e.target.id).toggleClass("current-control", false);
    cancelAnimationFrame(tvNoise);
    switch (e.target.id) {
        case "btn-vent":
            cancelAnimationFrame(doTheNoise);
            bufferCanvasCtx.drawImage(sprites[0], 0, 0, w, h);
            startChamber = requestAnimationFrame(chamberStarts);
            break;
        case "btn-chamber":
            stopSEMLoop();
            if (e.target.value == "off") {
                SEMChamberAnimation(true, 43, 49, chamberClosed);
            } else {
                SEMChamberAnimation(true, 0, 43, next_step);
            }
            break;
        case "btn-evacuate":
            evacuating();
            break;
        case "btn-reload":
            location.reload();
            location.reload(true);
            break;
        case "btn-tvrate":
            $("#btn-scan1").toggleClass("btn-active", false);
            $("#btn-scan1").prop('disabled', false);
            $("#btn-scan1").val("off");
            $("#btn-scan1").css("cursor", "pointer");
            if(SEM_step_num >= 16){
            $("#btn-scan2").toggleClass("btn-active", false);
            $("#btn-scan2").prop('disabled', false);
            $("#btn-scan2").val("off");
            $("#btn-scan2").css("cursor", "pointer");
            }
            tvCounter = 2;
            fRate = 20;
            noise = "tv_rate";
            fromScanModes = true;
            drawIt();
            tvNoise();
            break;
        case "btn-scan1":
            $("#btn-tvrate").toggleClass("btn-active", false);
            $("#btn-tvrate").prop('disabled', false);
            $("#btn-tvrate").val("off");
            $("#btn-tvrate").css("cursor", "pointer");
            if(SEM_step_num >= 16){
            $("#btn-scan2").toggleClass("btn-active", false);
            $("#btn-scan2").prop('disabled', false);
            $("#btn-scan2").val("off");
            $("#btn-scan2").css("cursor", "pointer");
            }
            tvCounter = 2;
            fRate = 6;
            noise = "scan1";
            fromScanModes = true;
            drawIt();
            tvNoise();
            if(SEM_step_num == 14) activate_slider("#focus-fine");
            break;
        case "btn-scan2":
            $("#btn-tvrate").toggleClass("btn-active", false);
            $("#btn-tvrate").prop('disabled', false);
            $("#btn-tvrate").val("off");
            $("#btn-tvrate").css("cursor", "pointer");
            $("#btn-scan1").toggleClass("btn-active", false);
            $("#btn-scan1").prop('disabled', false);
            $("#btn-scan1").val("off");
            $("#btn-scan1").css("cursor", "pointer");
            tvCounter = 2;
            fRate = 2;
            noise = "scan2";
            fromScanModes = true;
            drawIt();
            tvNoise();
            break;
        case "btn-save":
            saveCANVAS(canvas, "image from the SEM simulator - www.myscope.training.png");
            $(this).toggleClass("btn-active", false);
            $(this).prop('disabled', false);
            $(this).css("cursor", "pointer");
            this.value = "off";
            next_step();
            break;
        case "btn-optimal":
            $("#optimal-div").toggleClass("totally-hidden", false);
            $(this).toggleClass("btn-active", false);
            $(this).prop('disabled', false);
            $(this).css("cursor", "pointer");
            this.value = "off";
            next_step();
            break;
        case "btn-":
            break;
        default:
            //        code block
    }
});
// ======================= END ======================== //
// ======================= START ======================== //
$('#btn-ht').click(function (e) {
    htOn = !htOn;
    if (this.value == "off") {
        $("#contrast").slider("value", contrastSlider);
        $("#astigmatism-x").slider("value", 0);
        $("#astigmatism-y").slider("value", 0);
        this.value = "on";
        $(this).toggleClass("ht-btn-active", true);
        $("#scalebar-div").toggleClass("totally-hidden", false);
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        focus_fn();
        if (SEM_step_num == 9) next_step();
    } else {
        this.value = "off";
        $(this).toggleClass("ht-btn-active", false);
        $("#scalebar-div").toggleClass("totally-hidden", true);
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[stageRotation_value - 1], 0, 0, w, h);
    }
    $(this).toggleClass("current-control", false);
});

$("#close-example").click(function (e) {
    e.preventDefault();
    $("#btn-settings").toggleClass("totally-hidden", false);
    $("#example-settings").css("opacity","0");
    $("#optimal-div").toggleClass("totally-hidden", true);
});

$("#btn-settings").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("btn-active", false);
    $(this).prop('disabled', false);
    $(this).css("cursor", "pointer");
    this.value = "off";
    $(this).toggleClass("totally-hidden", true);
    $("#example-settings").css("opacity","1");
});

$(".info-icon").click(function (e) {
    e.preventDefault();
    switch (e.target.id) {
        case "accvolt-info":
        $("#info-txt").html(accvolt_info);
            break;
        case "spotz-info":
        $("#info-txt").html(spotz_info);
            break;
        case "zpos-info":
        $("#info-txt").html(zpos_info);
            break;
        case "se-bse-info":
        $("#info-txt").html(se_bse_info);
            break;
        case "focus-info":
        $("#info-txt").html(focus_info);
            break;
        case "astigmatism-info":
        $("#info-txt").html(astigmatism_info);
            break;
        case "bright-contrast-info":
        $("#info-txt").html(bright_contrast_info);
            break;
        case "scan-info":
        $("#info-txt").html(scan_info);
            break;
    }
    $("#info-modal").toggleClass("totally-hidden", false);
});

$("#close-info").click(function (e) {
    e.preventDefault();
    $("#info-modal").toggleClass("totally-hidden", true);
});
// ======================= END ======================== //
// ======================= ================START================= ======================== //


$('#btn-se').click(function () {
    if (!bse_switch) {
        $(this).toggleClass("switch-btn", false);
        $(this).toggleClass("switch-btn-active", true);
        currentMicrograph.src = currentBSEsample.src;
        example_img.src = optimalBSEsample.src;
    }
    else {
        $(this).toggleClass("switch-btn", true);
        $(this).toggleClass("switch-btn-active", false);
        currentMicrograph.src = currentSEsample.src;
        example_img.src = optimalSEsample.src;
    }
        drawIt();
    bse_switch = !bse_switch;
});
// ======================= END ======================== //
// ======================= ================START================= ======================== //
function chamberStarts() {
    alpha -= 0.005;
    if (alpha <= 0.75) {
        cancelAnimationFrame(startChamber);
        SEM_step_2();
    } else {
        startChamber = requestAnimationFrame(chamberStarts);
    }
    ctx.globalAlpha = alpha;
}
// ======================= ================ END END ================= ==================== //
function SEMChamberAnimation(exit, initIMG, topIMG, nextFun = empty_fn) {
    SEMChamberTimeout = setTimeout(function () {
        SEMChamber = requestAnimationFrame(function () {
            SEMChamberAnimation(exit, initIMG, topIMG, nextFun);
        });
        counter++;
        if (counter >= topIMG) {
            if (exit) {
                currentImg = topIMG - 1;
                nextFun();
            } else {
                counter = initIMG;
                stageRotation_value = topIMG;
            }
        }
    }, 1000 / 15);
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprites[counter], 0, 0, w, h);
};

function stopSEMLoop() {
    clearTimeout(SEMChamberTimeout);
    cancelAnimationFrame(SEMChamber);
}
// ======================= ================START================= ======================== //

function evacuating() {
    stopSEMLoop();
    alpha += delta;
    SEMChamberAnimation(false, 49, 55);
    if (alpha >= 1) {
        alpha = 1;
        cancelAnimationFrame(evacuating);
        next_step();
    } else {
        evac = requestAnimationFrame(evacuating);
    }
}
// ======================= ================ END END ================= ==================== //
// ======================= ================START================= ======================== //
function chamberClosed() {
    stopSEMLoop();
    SEMChamberAnimation(false, 49, 55);
    next_step();
}
// ======================= ================ END END ================= ==================== //
// ======================= ================START================= ======================== //
function liftStage() {
    stopSEMLoop();
    SEMChamberAnimation(false, 66, 72);
    next_step();
}
// ======================= ================ END END ================= ==================== //
// ======================= ================ START STAGE ROTATIONS================= ======================== //
class stageRotation {
    constructor(start_val, end_val, current = stageRotation_value, bool = false) {
        (stageRotation_value < start_val) ? this.current = start_val - 1: this.current = current - 1;
        this.start_val = start_val;
        this.end_val = end_val;
        this.bool = bool;
    }
    start() {
        this.interval = setInterval(() => {
            this.current++;
            if (this.current === stageRotation_maxValue + 1) {
                this.current = stageRotation_minValue;
            } else if (this.current === this.start_val) {
                this.bool = true;
            } else if (this.bool === true && this.current === this.end_val) {
                stageRotation_value = this.current;
                if (SEM_step_num == 7) next_step();
                clearInterval(this.interval);
            }
            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = alpha;
            ctx.drawImage(sprites[this.current - 1], 0, 0, w, h);
        }, 1000 / 10);
    }
    stop() {
        clearInterval(this.interval);
    }
}
// ======================= ================ END STAGE ROTATIONS END ================= ==================== //
// ======================= ================START================= ======================== //

function clear_Intervals() {

    stopSEMLoop();
    if (stageRotation_sample1 != undefined) {
        stageRotation_sample1.stop();
    }
    if (stageRotation_sample2 != undefined) {
        stageRotation_sample2.stop();
    }
    if (stageRotation_sample3 != undefined) {
        stageRotation_sample3.stop();
    }
    if (stageRotation_sample4 != undefined) {
        stageRotation_sample4.stop();
    }
}
// ======================================= END END ================= ==================== //
// ======================= ================================= =============================== //
function filterCanvas(brightF, contrastF, blurF) {
    let imageData = bufferCanvasCtx.getImageData(0, 0, w, h);

    brightF(imageData);
    contrastF(imageData);
    blurF(imageData);

    bufferCanvasCtx.putImageData(imageData, 0, 0);
}

function setFilter(a, b, c) {
    brightFilter = a;
    contrFilter = b;
    blurFilter = c;
    filterCanvas(brightFilter, contrFilter, blurFilter);
}

contrastImage = function (delta) {
    return function (pixels) {

        var data = pixels.data;
        var factor = (259 * (delta + 255)) / (255 * (259 - delta));

        for (var i = 0; i < data.length; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }
        return pixels;
    };
};

brightnessImage = function (delta) {
    return function (pixels) {
        var data = pixels.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] += delta; // red
            data[i + 1] += delta; // green
            data[i + 2] += delta; // blue
        }
        return pixels;
    };
};
// ======================= ================================= =============================== //
function changeSample_fn() {
    clearTimeout(focusTimeout);
    focus_fn();
}

function focus_fn() {
    focus1 = $("#focus-coarse").slider("value") - minBlur;
    allFocus = focus1 + spotsizeFocus + zposFocus;
    if (allFocus < 0) allFocus = allFocus * (-1);
    allFocus += reducedBlur;
    if (htOn) drawIt();
}
// ======================= ================================= =============================== //

// ======================= =================START SCAN ================ =============================== //
var test_color;

function tvDraw() {
    if (fromScanModes) {
        bufferCanvasCtxAstigmTrim.putImageData(imgData_forScan, 0, 0);
        astigm_fn(astig_x, astig_y, bufferCanvasAstigmTrim, bufferCanvasCtxAstigmTrim);
        imgData_forScan = bufferCanvasCtxAstigmTrim.getImageData(0, 0, w, h);
        test_color = "tvdrw";
    }
    fromScanModes = false;
    ctx.putImageData(imgData_forScan, 0, 0, 0, 0, w, (tvCounter - 1));
}

function tvNoise() {
    if (tvCounter < h) {
        tvDraw();
        dotvNoise = requestAnimationFrame(tvNoise);
        tvCounter += fRate;
    } else {
        cancelAnimationFrame(tvNoise);
        tvCounter = 2;
    };
};
// ======================= ================ END SCAN ================= =============================== //
// ======================= ================================= =============================== //
// ======================= =============START DRAWING IT================= ======================== //
function drawIt() {
    document.getElementById("scale-unit").innerHTML = scaleBar_unit + "&micro;m";
    document.getElementById("scalebar").style.width = (scaleBar_size * magnifcTrim) + "%";
    // ====================================== //
    let total_magnification = magnifcTrim + zposTrim;
    astigmXTrim += total_magnification;
    bufferCanvasCtx.drawImage(currentMicrograph, (w - (w * total_magnification)) / 2, (h - (h * total_magnification)) / 2, w * total_magnification, h * total_magnification);
    console.log({allFocus} , {focusFine});
    filterCanvas(brightnessImage(brightSlider + accVoltSlider + spotsizeBright), contrastImage(contrastSlider), blurImage(allFocus - focusFine));
    // ======================= =================================//
    if (!fromScanModes) {
        ctx.drawImage(bufferCanvas, 0, 0, w, h);
        imgData_forScan = ctx.getImageData(0, 0, w, h);
        test_color = "drwit-noscan";
    } else {
        bufferCanvasCtx.drawImage(bufferCanvas, 0, 0, w, h);
        imgData_forScan = bufferCanvasCtx.getImageData(0, 0, w, h);
        bufferCanvasCtxAstigmTrim.putImageData(imgData_forScan, 0, 0);
        test_color = "drwit-yesscan";
    }
    // ======================= =================================//   
    switch (noise) {
        case "tv_rate":
            scanNoise(0.8, 1.5);
            scanNoise(0.4, 0.7);
            break;
        case "scan1":
            scanNoise(0.6, 1);
            break;
        case "scan2":
            if (!fromScanModes) {
                ctx.putImageData(imgData_forScan, 0, 0);
                astigm_fn(astig_x, astig_y);
            }
            break;
    }
}

function scanNoise(factor1, factor2) {
    for (var i = 0; i < imgData_forScan.data.length; i += 4) {
        var randColor1 = factor1 + Math.random() * factor2;
        var randColor2 = factor1 + Math.random() * factor2;
        var randColor3 = factor1 + Math.random() * factor2;
        imgData_forScan.data[i] = imgData_forScan.data[i] * 1 * randColor1; // green
        imgData_forScan.data[i + 1] = imgData_forScan.data[i + 1] * 1 * randColor2; // green
        imgData_forScan.data[i + 2] = imgData_forScan.data[i + 2] * 1 * randColor3; // blue
        var grayscale = imgData_forScan.data[i] * p1 + imgData_forScan.data[i + 1] * p2 + imgData_forScan.data[i + 2] * p3;
        imgData_forScan.data[i] = grayscale + er; // red
        imgData_forScan.data[i + 1] = grayscale + eg; // green
        imgData_forScan.data[i + 2] = grayscale + eb; // blue
    }
    test_color = "scanNoise";
    bufferCanvasCtxAstigmTrim.putImageData(imgData_forScan, 0, 0);
    imgData_forScan = bufferCanvasCtxAstigmTrim.getImageData(0, 0, w, h);
    if (!fromScanModes) {
        ctx.putImageData(imgData_forScan, 0, 0);
        astigm_fn(astig_x, astig_y);
    }
};
// ==================== ================ END DRAWING IT END ================= ==================== //
// ======================= ================================= =============================== //
function astigm_fn(x, y, c = canvas, cx = ctx, ) {
    x -= astig_xSlider;
    y -= astig_ySlider;
    if ((x) < 0) x = x * (-1);
    if ((y) < 0) y = y * (-1);
    _x = x;
    _y = y;
    (x > y) ? num = x: num = y;
    if (cx == ctx) cx.drawImage(c, 0, 0, w, h);
    for (let i = -num; i <= num; i++) {
        if (i != 0) {
            (x < _x) ? x++ : x = -_x;
            (y < _y) ? y++ : y = -_y;
            cx.globalAlpha = 0.05;
            cx.drawImage(c, x, y, w, h);
        }
    }
    cx.globalAlpha = 1;
}
// ======================= ================================= =============================== //
// ======================= ================================= =============================== //
// ======================= START ======================== //                
function saveCANVAS(thecanvas, filename) {
    var lnk = document.createElement('a');
    lnk.download = filename;
    lnk.href = thecanvas.toDataURL();
    lnk.click();
}
// ======================= END ======================== //
// =======================  START  ==================== //
$("#close-resize").click(() => {
    toogle_fn("#modal-resize", "totally-hidden", false);
});
// =======================   END END   ======================== //
// =========== COOKIES  ================== //
function setConsent() {
    var accept_cookies = localStorage.getItem('cookies');
    if (accept_cookies === "accept") {
        console.log("cookie accepted");
        consentGranted();
    } 
}
$("#accept-cookies-btn").click(function (e) {
    e.preventDefault();
    localStorage.setItem("cookies", "accept");
    $('#cookies-modal').toggleClass('totally-hidden', true);
    setConsent();
});
$("#deny-cookies-btn").click(function (e) {
    e.preventDefault();
    localStorage.setItem("cookies", "deny");
    $('#cookies-modal').toggleClass('totally-hidden', true);
    setConsent();
});
// ======================= END END END COOKIES ================== //
// ======================= SITEMAP ================== //
var acc = document.getElementsByClassName("sitemap-section-title");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var sitemap_section_list = this.nextElementSibling;
        if (sitemap_section_list.style.display === "block") {
            sitemap_section_list.style.display = "none";
        } else {
            sitemap_section_list.style.display = "block";
        }
    });
}
$("#close-sitemap").click(() => {
    $('#modal-sitemap').toggleClass('totally-hidden', true);
});
$("#myscope-logo").click(() => {
    $('#modal-sitemap').toggleClass('totally-hidden', false);
});
// ======================= END END END SITEMAP ================== //
// ======================= ================================= =============================== //


// ======================= ================================= =============================== //