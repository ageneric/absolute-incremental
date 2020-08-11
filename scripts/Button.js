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
