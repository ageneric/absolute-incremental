var temperature = 0.0; // Main currency where negative is cold and positive is hot.
var clickMomentum = 0.0; // Clicks contribute temperature over time. Ranges from -1 to 1.

var delta = 0.0; // Change in temperature since last cycle.
var generating = 0.0;
var worldLeak = 1.0;

var absoluteZeroPoint = -500;

var maxTemperatureExponent = 308; // Limit of 1e308.
var decayTruncate = 1e2;
var decayZeroOffset = Math.max(1, 0.99 + 1/maxTemperatureExponent * Math.log10(decayTruncate));

var playing = true;
var infinity = false;

var clickBase = 0.25; // A direct multiplier on click power
var clickInfusion = 0.0; // Multiplier on click power based on root(temperature)
var clickLinearDecay = 0.05; // Constant "momentum" reduction per cycle. Higher values reduce "momentum" to zero faster.
var clickExponentialDecay = 1.0; // Reduces "momentum" from a click exponentially faster over time, based on this factor.


function pretty(value, maxDecimalPlaces = 2) {
  if (value > 0) {
    if (Math.abs(value) < 1)
      return "+" + value.toFixed(maxDecimalPlaces)
    else if (Math.abs(value) < 1e3)
      return "+" + value.toPrecision(3)
    else
      return "+e" + Math.log10(value).toFixed(1)
  }
  else {
    if (Math.abs(value) < 1)
      return value.toFixed(maxDecimalPlaces)
    else if (Math.abs(value) < 1e3)
      return value.toPrecision(3)
    else
      return "-e" + Math.log10(-value).toFixed(1)
  }
}

function clampPercentage(proportion) {
  return 100 * Math.min(1, Math.max(0, proportion))
}

function updateDisplayEarly() {
  StokeButton.displayMagnitude($("#btn-hot"), Math.max(clickMomentum, 0))
  StokeButton.displayMagnitude($("#btn-cold"), Math.max(-clickMomentum, 0))
  
  if (playing)
    $("#decay-measure").width(clampPercentage(1 - delta/generating).toString() + "%")
  $("#absolute-zero-measure").width(clampPercentage(temperature/absoluteZeroPoint).toString() + "%")
}

function updateDisplayLate() {
  $("#temperature-text").html(pretty(temperature))
  $("#delta-text").html(pretty(delta * 10, 3))
  
  if (clickInfusion > 0) {
    $("#infusion-reading").html("Your clicks are infused and are " + pretty(
      (clickInfusion*Math.sqrt(Math.abs(temperature))), 1) + "x stronger.")
  }
  
  /* Example generators */
  if (temperature < 6)
    $("#generator-cold-1").css("color", "var(--button-disabled-color)")
  else
    $("#generator-cold-1").removeAttr("style")
  if (temperature > -6)
    $("#generator-hot-1").css("color", "var(--button-disabled-color)")
  else
    $("#generator-hot-1").removeAttr("style")
  
  if (temperature > 30 && clickInfusion <= 0) {
    $("#btn-infusion").prop("disabled", false)
    $("#infusion").removeAttr("style")
  }
}

function cycleClick() {
  let hot = (clickMomentum > 0)
  let clickMagnitude = Math.abs(clickMomentum)

  clickMagnitude -= (1 - clickMagnitude)*clickExponentialDecay + clickLinearDecay
  
  if (hot) 
    clickMomentum = Math.max(0, clickMagnitude)
  else
    clickMomentum = -Math.max(0, clickMagnitude)
}

function cycle() {
  if (playing) {
    cycleClick()

    prevTemperature = temperature

    if (temperature < Math.pow(10, maxTemperatureExponent)) {
      worldLeak = decayZeroOffset -
        Math.log10(Math.abs(temperature)+decayTruncate)/maxTemperatureExponent;
      
      temperature *= worldLeak
    }
    else {
      temperature = Math.pow(10, maxTemperatureExponent)
      infinity = true
    }

    temperature += generating
    delta = temperature - prevTemperature
    temperature += clickMomentum * clickBase
      * (clickInfusion*Math.sqrt(Math.abs(temperature)) + 1);
  }
  else {
    /* Paused */
  }
}

function mainLoop() {
  updateDisplayEarly()
  cycle()
  updateDisplayLate()
}

function slowLoop() {
  if (temperature > significantTemperature) {
    if (temperature > 1000)
      $(".core").css("background-color", "#30211a")
    else
      $(".core").css("background-color", "#2a211a")
  }
  else if (temperature < -significantTemperature) {
    if (temperature < -1000)
      $(".core").css("background-color", "#1a2130")
    else
      $(".core").css("background-color", "#1a212a")
  }
  else {
    $(".core").css("background-color", "#1f211f")
  }
  
  if (Math.abs(generating) < significantTemperature) 
    $("#decay-measure").height("0")
  else
    $("#decay-measure").height("0.2em")
  if (temperature < -100)
    $("#absolute-zero-measure").height("0.2em")
}

setInterval(mainLoop, 100);
setInterval(slowLoop, 800);