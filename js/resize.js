function doResize(event, ui) {
  var $el = $("#simulator-base");
  var elHeight = $el.outerHeight();
  var elWidth = $el.outerWidth();
  var scale;

  scale = Math.min(
    ui.size.width / elWidth,
    ui.size.height / elHeight
  );

  $el.css({
    //still missing a conditional to check if the H is not long enough to fit the div in screen, if it is then do nothing
    transform: "translate(0%, 0%) " + "scale(" + scale + ")"
  });

}

function triggerResize() {
  var starterData = {
    size: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  doResize(null, starterData);
}