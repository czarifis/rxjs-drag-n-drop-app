var Rx = require('rxjs/Rx');
var Observable = require('rxjs/Observable').Observable;

$(window).load(function () {
    var SECTION_DIV = "section > div";
    var $SELECTION = $("div.selection");
    var $selected=$();

    const bodyMouseDown$ = Rx.Observable.fromEvent($("body"), "mousedown touchstart");
    const bodyMouseUp$ = Rx.Observable.fromEvent($("body"), "mouseup touchend touchcancel");
    const documentMouseMove$ = Rx.Observable.fromEvent($("section"), "mousemove touchmove");

    const bodyDrag$ =
        bodyMouseDown$
            // if the mouse down started inside a square, do not perform selection
            .filter(e => !$(e.target).is("div"))
            .flatMap(mouseDown =>
                documentMouseMove$
                    .map(mouseMove => {
                        mouseMove.preventDefault();

                        return {
                            filterUnmark : function () {
                                if ($(this).is(".marked") && f.ctrlKey) {
                                    return (false);
                                } else {
                                    return (true);
                                }
                            },
                            selected: {
                                rect: {
                                    x: mouseDown.pageX > mouseMove.pageX ? mouseMove.pageX : mouseDown.pageX,
                                    y: mouseDown.pageY > mouseMove.pageY ? mouseMove.pageY : mouseDown.pageY,
                                    w: mouseDown.pageX > mouseMove.pageX ? mouseDown.pageX - mouseMove.pageX : mouseMove.pageX - mouseDown.pageX,
                                    h: mouseDown.pageY > mouseMove.pageY ? mouseDown.pageY - mouseMove.pageY : mouseMove.pageY - mouseDown.pageY
                                },
                                mark: 'mark',
                                filterUnmark: this.filterUnmark,
                                unmark: true
                            },
                            selection: {
                                left: Math.min(mouseDown.offsetX, mouseMove.clientX),
                                top: Math.min(mouseDown.offsetY, mouseMove.clientY),
                                width: Math.abs(mouseMove.clientX - mouseDown.offsetX),
                                height: Math.abs(mouseMove.clientY - mouseDown.offsetY)
                            }
                        }
                    })
                    .takeUntil(bodyMouseUp$)
        );

    bodyDrag$.subscribe(_ => $SELECTION.removeClass("hide"));

    bodyMouseDown$
        .filter(e => (!e.ctrlKey && !$(e.target).is("div")))
        .subscribe(_ => $selected.removeClass('mark'));

    bodyDrag$.subscribe(d => {
            $SELECTION.css(d.selection);
            $selected = $(SECTION_DIV).overlap(d.selected)
        }
    );

    $(SECTION_DIV).on("mousedown touchstart", function(e) {
        if (e.which === 1 || e.type == "touchstart") {
            if (!e.ctrlKey) {
                $(SECTION_DIV).removeClass("marked mark");
            }
            $(this).addClass("marked mark");
        }
    });

    bodyMouseUp$.subscribe(d =>
        {
            $SELECTION.addClass("hide").removeAttr("style");
            $selected.addClass("marked");
            d.preventDefault();
        }
    );

});