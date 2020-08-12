buttons = {};

// A button that applies an effect, diminishing over time.
var StokeButton = {
	displayMagnitude: function(btn, magnitude) {
        $(".fill", btn).width((magnitude*100).toString() + "%");
	},
    
    instantFill: function(btn, id) {
        skipTransition(document.getElementById(id), function(){
            $(".fill", btn).width("100%");
        })
    }
};

// Button click events.
$(".btn-cooldown").click(function(){
  let btn = $(this)
  btn.prop("disabled", true)
  setTimeout(function(){
    btn.prop("disabled", false)
  }, 8000);
});

$("#btn-hot").click(function(){
  clickMomentum = 1
  StokeButton.instantFill($("#btn-hot"), "fill-hot")
});

$("#btn-cold").click(function(){
  clickMomentum = -1
  StokeButton.instantFill($("#btn-cold"), "fill-cold")
});

$("#btn-infusion").click(function(){
  clickInfusion += 0.1
  $("#btn-infusion").prop("disabled", true)
  $("#infusion").css("display", "none")
});

$("#pause").click(function(){
  playing = !playing
  if (playing) {
    $("#pause").removeAttr("style")
  }
  else {
    $("#pause").css("background-color", "var(--cooldown)")
  }
});

/* Example generators */
$("#generator-cold-1").click(function(){
  if (temperature >= 6) {
    generating -= 0.5 / 10
    temperature -= 6
  }
});

$("#generator-hot-1").click(function(){
  if (temperature <= -6) {
    generating += 0.5 / 10
    temperature += 6
  }
});

$("#sell-all").click(function(){
  generating = 0
});
