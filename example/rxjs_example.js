var Rx = require('rxjs/Rx');
var Observable = require('rxjs/Observable').Observable;

$(window).load(function () {
    var SECTION_DIV = "section > div";
    var $SELECTION = $("div.selection");
    var $selected = $();
    var point = [0, 0];


    $(SECTION_DIV).on("mousedown touchstart", function (e) {
        if (e.which === 1 || e.type == "touchstart") {
            if (!e.ctrlKey) {
                $(SECTION_DIV).removeClass("marked mark");
            }
            $(this).addClass("marked mark");
        }
    });
    $("body").on("mousedown touchstart", function (i) {
        if (i.which === 1 && !$(i.target).is(SECTION_DIV)) {
            if (!i.ctrlKey && !($(i.target).is(SECTION_DIV))) {
                $(SECTION_DIV).removeClass("marked mark");
            } else {
                console.log(i.target);
            }

            if ((point[0] != i.pageX && point[1] != i.pageY) || i.type == "mousedown") {
                point[0] = i.pageX;
                point[1] = i.pageY;
                $SELECTION.css({
                    "top": i.pageY,
                    "left": i.pageX
                });
                $SELECTION.removeClass("hide");
            }
            $(this).on("mousemove", function (f) {

                var rect = {
                    x: i.pageX > f.pageX ? f.pageX : i.pageX,
                    y: i.pageY > f.pageY ? f.pageY : i.pageY,
                    w: i.pageX > f.pageX ? i.pageX - f.pageX : f.pageX - i.pageX,
                    h: i.pageY > f.pageY ? i.pageY - f.pageY : f.pageY - i.pageY
                };
                $SELECTION.css({
                    "top": rect.y - 1,
                    "left": rect.x - 1,
                    "width": rect.w + 1,
                    "height": rect.h + 1
                });
                var $marked;
                var filterUnmark = function (index) {
                    if ($(this).is(".marked") && f.ctrlKey) {
                        return (false);
                    } else {
                        return (true);
                    }
                };
                // ------------------------------------
                console.log(rect);
                $selected = $(SECTION_DIV).overlap({
                    rect: rect,
                    mark: "mark",
                    filterUnmark: filterUnmark,
                    unmark: true
                });
                //-------------------------------------
            });
        }
        i.preventDefault();
    }).on("mouseup ", function (e) {
        console.log('mouseup')
        if (this === e.target || $SELECTION[0] === e.target || e.type != "mouseup") {
            if (e.which === 1 || e.type != "mouseup") {
                $(this).off("mousemove");
                $SELECTION.addClass("hide").removeAttr("style");
                $selected.addClass("marked");
                e.preventDefault();
            }
        }
    });
});