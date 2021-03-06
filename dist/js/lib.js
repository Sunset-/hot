;
(function (d) {
	var t = {
		mode: "horizontal",
		slideSelector: "",
		infiniteLoop: !0,
		hideControlOnEnd: !1,
		speed: 500,
		easing: null,
		slideMargin: 0,
		startSlide: 0,
		randomStart: !1,
		captions: !1,
		ticker: !1,
		tickerHover: !1,
		adaptiveHeight: !1,
		adaptiveHeightSpeed: 500,
		video: !1,
		useCSS: !0,
		preloadImages: "visible",
		responsive: !0,
		slideZIndex: 50,
		wrapperClass: "bx-wrapper",
		touchEnabled: !0,
		swipeThreshold: 50,
		oneToOneTouch: !0,
		preventDefaultSwipeX: !0,
		preventDefaultSwipeY: !1,
		pager: !0,
		pagerType: "full",
		pagerShortSeparator: " / ",
		pagerSelector: null,
		buildPager: null,
		pagerCustom: null,
		controls: !0,
		nextText: "Next",
		prevText: "Prev",
		nextSelector: null,
		prevSelector: null,
		autoControls: !1,
		startText: "Start",
		stopText: "Stop",
		autoControlsCombine: !1,
		autoControlsSelector: null,
		auto: !1,
		pause: 4E3,
		autoStart: !0,
		autoDirection: "next",
		autoHover: !1,
		autoDelay: 0,
		autoSlideForOnePage: !1,
		minSlides: 1,
		maxSlides: 1,
		moveSlides: 0,
		slideWidth: 0,
		onSliderLoad: function () {},
		onSlideBefore: function () {},
		onSlideAfter: function () {},
		onSlideNext: function () {},
		onSlidePrev: function () {},
		onSliderResize: function () {}
	};
	d.fn.bxSlider = function (b) {
		if (0 == this.length) return this;
		if (1 < this.length) return this.each(function () {
			d(this).bxSlider(b)
		}), this;
		var a = {},
			c = this,
			e = d(window).width(),
			g = d(window).height(),
			l = function () {
				a.settings = d.extend({}, t, b);
				a.settings.slideWidth = parseInt(a.settings.slideWidth);
				a.children = c.children(a.settings.slideSelector);
				a.children.length < a.settings.minSlides && (a.settings.minSlides = a.children.length);
				a.children.length < a.settings.maxSlides && (a.settings.maxSlides = a.children.length);
				a.settings.randomStart && (a.settings.startSlide = Math.floor(Math.random() * a.children.length));
				a.active = {
					index: a.settings.startSlide
				};
				a.carousel = 1 < a.settings.minSlides || 1 < a.settings.maxSlides;
				a.carousel && (a.settings.preloadImages = "all");
				a.minThreshold = a.settings.minSlides * a.settings.slideWidth + (a.settings.minSlides - 1) * a.settings.slideMargin;
				a.maxThreshold = a.settings.maxSlides * a.settings.slideWidth + (a.settings.maxSlides - 1) * a.settings.slideMargin;
				a.working = !1;
				a.controls = {};
				a.interval = null;
				a.animProp = "vertical" == a.settings.mode ? "top" : "left";
				a.usingCSS = a.settings.useCSS && "fade" != a.settings.mode && function () {
					var f = document.createElement("div"),
						b = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"],
						m;
					for (m in b)
						if (void 0 !== f.style[b[m]]) return a.cssPrefix = b[m].replace("Perspective", "").toLowerCase(), a.animProp = "-" + a.cssPrefix + "-transform", !0;
					return !1
				}();
				"vertical" == a.settings.mode && (a.settings.maxSlides = a.settings.minSlides);
				c.data("origStyle", c.attr("style"));
				c.children(a.settings.slideSelector).each(function () {
					d(this).data("origStyle", d(this).attr("style"))
				});
				k()
			},
			k = function () {
				c.wrap('<div class="' + a.settings.wrapperClass + '"><div class="bx-viewport"></div></div>');
				a.viewport = c.parent();
				a.loader = d('<div class="bx-loading" />');
				a.viewport.prepend(a.loader);
				c.css({
					width: "horizontal" == a.settings.mode ? 100 * a.children.length + 215 + "%" : "auto",
					position: "relative"
				});
				a.usingCSS && a.settings.easing ? c.css("-" + a.cssPrefix + "-transition-timing-function", a.settings.easing) : a.settings.easing || (a.settings.easing = "swing");
				m();
				a.viewport.css({
					width: "100%",
					overflow: "hidden",
					position: "relative"
				});
				a.viewport.parent().css({
					maxWidth: A()
				});
				a.settings.pager || a.viewport.parent().css({
					margin: "0 auto 0px"
				});
				a.children.css({
					"float": "horizontal" == a.settings.mode ? "left" : "none",
					listStyle: "none",
					position: "relative"
				});
				a.children.css("width", f());
				"horizontal" == a.settings.mode && 0 < a.settings.slideMargin && a.children.css("marginRight", a.settings.slideMargin);
				"vertical" == a.settings.mode && 0 < a.settings.slideMargin && a.children.css("marginBottom", a.settings.slideMargin);
				"fade" == a.settings.mode && (a.children.css({
					position: "absolute",
					zIndex: 0,
					display: "none"
				}), a.children.eq(a.settings.startSlide).css({
					zIndex: a.settings.slideZIndex,
					display: "block"
				}));
				a.controls.el = d('<div class="bx-controls" />');
				a.settings.captions && n();
				a.active.last = a.settings.startSlide == p() - 1;
				a.settings.video && c.fitVids();
				var b = a.children.eq(a.settings.startSlide);
				"all" == a.settings.preloadImages && (b = a.children);
				a.settings.ticker ? a.settings.pager = !1 : (a.settings.pager && (a.settings.pagerCustom ? a.pagerEl = d(a.settings.pagerCustom) : (a.pagerEl = d('<div class="bx-pager" />'), a.settings.pagerSelector ? d(a.settings.pagerSelector).html(a.pagerEl) : a.controls.el.addClass("bx-has-pager").append(a.pagerEl), y()), a.pagerEl.on("click", "a", I)), a.settings.controls && (a.controls.next = d('<a class="bx-next" href="">' + a.settings.nextText + "</a>"), a.controls.prev = d('<a class="bx-prev" href="">' + a.settings.prevText + "</a>"), a.controls.next.bind("click", r), a.controls.prev.bind("click", J), a.settings.nextSelector && d(a.settings.nextSelector).append(a.controls.next), a.settings.prevSelector && d(a.settings.prevSelector).append(a.controls.prev), a.settings.nextSelector || a.settings.prevSelector || (a.controls.directionEl = d('<div class="bx-controls-direction" />'), a.controls.directionEl.append(a.controls.prev).append(a.controls.next), a.controls.el.addClass("bx-has-controls-direction").append(a.controls.directionEl))), a.settings.auto && a.settings.autoControls && (a.controls.start = d('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + a.settings.startText + "</a></div>"), a.controls.stop = d('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + a.settings.stopText + "</a></div>"), a.controls.autoEl = d('<div class="bx-controls-auto" />'), a.controls.autoEl.on("click", ".bx-start", q), a.controls.autoEl.on("click", ".bx-stop", K), a.settings.autoControlsCombine ? a.controls.autoEl.append(a.controls.start) : a.controls.autoEl.append(a.controls.start).append(a.controls.stop), a.settings.autoControlsSelector ? d(a.settings.autoControlsSelector).html(a.controls.autoEl) : a.controls.el.addClass("bx-has-controls-auto").append(a.controls.autoEl), B(a.settings.autoStart ? "stop" : "start")), (a.settings.controls || a.settings.autoControls || a.settings.pager) && a.viewport.after(a.controls.el));
				v(b, u)
			},
			v = function (a, f) {
				var b = a.find("img, iframe").length;
				if (0 == b) f();
				else {
					var m = 0;
					a.find("img, iframe").each(function () {
						d(this).one("load", function () {
							++m == b && f()
						}).each(function () {
							this.complete && d(this).load()
						})
					})
				}
			},
			u = function () {
				if (a.settings.infiniteLoop && "fade" != a.settings.mode && !a.settings.ticker) {
					var f = "vertical" == a.settings.mode ? a.settings.minSlides : a.settings.maxSlides,
						b = a.children.slice(0, f).clone().addClass("bx-clone"),
						f = a.children.slice(-f).clone().addClass("bx-clone");
					c.append(b).prepend(f)
				}
				a.loader.remove();
				s();
				"vertical" == a.settings.mode && (a.settings.adaptiveHeight = !0);
				a.viewport.height(x());
				c.redrawSlider();
				a.settings.onSliderLoad(a.active.index);
				a.initialized = !0;
				a.settings.responsive && d(window).bind("resize", E);
				a.settings.auto && a.settings.autoStart && (1 < p() || a.settings.autoSlideForOnePage) && L();
				a.settings.ticker && M();
				a.settings.pager && C(a.settings.startSlide);
				a.settings.controls && F();
				a.settings.touchEnabled && !a.settings.ticker && (a.touch = {
					start: {
						x: 0,
						y: 0
					},
					end: {
						x: 0,
						y: 0
					}
				}, a.viewport.bind("touchstart", N))
			},
			x = function () {
				var f = 0,
					b = d();
				if ("vertical" == a.settings.mode || a.settings.adaptiveHeight)
					if (a.carousel) {
						var m = 1 == a.settings.moveSlides ? a.active.index : a.active.index * h(),
							b = a.children.eq(m);
						for (i = 1; i <= a.settings.maxSlides - 1; i++) b = m + i >= a.children.length ? b.add(a.children.eq(i - 1)) : b.add(a.children.eq(m + i))
					} else b = a.children.eq(a.active.index);
				else b = a.children;
				"vertical" == a.settings.mode ? (b.each(function (a) {
					f += d(this).outerHeight()
				}), 0 < a.settings.slideMargin && (f += a.settings.slideMargin * (a.settings.minSlides - 1))) : f = Math.max.apply(Math, b.map(function () {
					return d(this).outerHeight(!1)
				}).get());
				"border-box" == a.viewport.css("box-sizing") ? f += parseFloat(a.viewport.css("padding-top")) + parseFloat(a.viewport.css("padding-bottom")) + parseFloat(a.viewport.css("border-top-width")) + parseFloat(a.viewport.css("border-bottom-width")) : "padding-box" == a.viewport.css("box-sizing") && (f += parseFloat(a.viewport.css("padding-top")) + parseFloat(a.viewport.css("padding-bottom")));
				return f
			},
			A = function () {
				var f = "100%";
				0 < a.settings.slideWidth && (f = "horizontal" == a.settings.mode ? a.settings.maxSlides * a.settings.slideWidth + (a.settings.maxSlides - 1) * a.settings.slideMargin : a.settings.slideWidth);
				return f
			},
			f = function () {
				var f = a.settings.slideWidth,
					b = a.viewport.width();
				0 == a.settings.slideWidth || a.settings.slideWidth > b && !a.carousel || "vertical" == a.settings.mode ? f = b : 1 < a.settings.maxSlides && "horizontal" == a.settings.mode && !(b > a.maxThreshold) && b < a.minThreshold && (f = (b - a.settings.slideMargin * (a.settings.minSlides - 1)) / a.settings.minSlides);
				return f
			},
			m = function () {
				var f = 1;
				"horizontal" == a.settings.mode && 0 < a.settings.slideWidth ? a.viewport.width() < a.minThreshold ? f = a.settings.minSlides : a.viewport.width() > a.maxThreshold ? f = a.settings.maxSlides : (f = a.children.first().width() + a.settings.slideMargin, f = Math.floor((a.viewport.width() + a.settings.slideMargin) / f)) : "vertical" == a.settings.mode && (f = a.settings.minSlides);
				return f
			},
			p = function () {
				var f = 0;
				if (0 < a.settings.moveSlides)
					if (a.settings.infiniteLoop) f = Math.ceil(a.children.length / h());
					else
						for (var b = 0, p = 0; b < a.children.length;) ++f, b = p + m(), p += a.settings.moveSlides <= m() ? a.settings.moveSlides : m();
				else f = Math.ceil(a.children.length / m());
				return f
			},
			h = function () {
				return 0 < a.settings.moveSlides && a.settings.moveSlides <= m() ? a.settings.moveSlides : m()
			},
			s = function () {
				if (a.children.length > a.settings.maxSlides && a.active.last && !a.settings.infiniteLoop)
					if ("horizontal" == a.settings.mode) {
						var f = a.children.last(),
							b = f.position();
						w(-(b.left - (a.viewport.width() - f.outerWidth())), "reset", 0)
					} else "vertical" == a.settings.mode && (b = a.children.eq(a.children.length - a.settings.minSlides).position(), w(-b.top, "reset", 0));
				else b = a.children.eq(a.active.index * h()).position(), a.active.index == p() - 1 && (a.active.last = !0), void 0 != b && ("horizontal" == a.settings.mode ? w(-b.left, "reset", 0) : "vertical" == a.settings.mode && w(-b.top, "reset", 0))
			},
			w = function (f, b, m, h) {
				if (a.usingCSS) f = "vertical" == a.settings.mode ? "translate3d(0, " + f + "px, 0)" : "translate3d(" + f + "px, 0, 0)", c.css("-" + a.cssPrefix + "-transition-duration", m / 1E3 + "s"), "slide" == b ? (c.css(a.animProp, f), c.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
					c.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
					D()
				})) : "reset" == b ? c.css(a.animProp, f) : "ticker" == b && (c.css("-" + a.cssPrefix + "-transition-timing-function", "linear"), c.css(a.animProp, f), c.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
					c.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
					w(h.resetValue, "reset", 0);
					z()
				}));
				else {
					var p = {};
					p[a.animProp] = f;
					"slide" == b ? c.animate(p, m, a.settings.easing, function () {
						D()
					}) : "reset" == b ? c.css(a.animProp, f) : "ticker" == b && c.animate(p, speed, "linear", function () {
						w(h.resetValue, "reset", 0);
						z()
					})
				}
			},
			y = function () {
				for (var f = "", b = p(), m = 0; m < b; m++) {
					var h = "";
					a.settings.buildPager && d.isFunction(a.settings.buildPager) ? (h = a.settings.buildPager(m), a.pagerEl.addClass("bx-custom-pager")) : (h = m + 1, a.pagerEl.addClass("bx-default-pager"));
					f += '<div class="bx-pager-item"><a href="" data-slide-index="' + m + '" class="bx-pager-link">' + h + "</a></div>"
				}
				a.pagerEl.html(f)
			},
			n = function () {
				a.children.each(function (a) {
					a = d(this).find("img:first").attr("title");
					void 0 != a && ("" + a).length && d(this).append('<div class="bx-caption"><span>' + a + "</span></div>")
				})
			},
			r = function (f) {
				a.settings.auto && c.stopAuto();
				c.goToNextSlide();
				f.preventDefault()
			},
			J = function (f) {
				a.settings.auto && c.stopAuto();
				c.goToPrevSlide();
				f.preventDefault()
			},
			q = function (a) {
				c.startAuto();
				a.preventDefault()
			},
			K = function (a) {
				c.stopAuto();
				a.preventDefault()
			},
			I = function (f) {
				a.settings.auto && c.stopAuto();
				var b = d(f.currentTarget);
				void 0 !== b.attr("data-slide-index") && (b = parseInt(b.attr("data-slide-index")), b != a.active.index && c.goToSlide(b), f.preventDefault())
			},
			C = function (f) {
				var b = a.children.length;
				"short" == a.settings.pagerType ? (1 < a.settings.maxSlides && (b = Math.ceil(a.children.length / a.settings.maxSlides)), a.pagerEl.html(f + 1 + a.settings.pagerShortSeparator + b)) : (a.pagerEl.find("a").removeClass("active"), a.pagerEl.each(function (a, b) {
					d(b).find("a").eq(f).addClass("active")
				}))
			},
			D = function () {
				if (a.settings.infiniteLoop) {
					var f = "";
					0 == a.active.index ? f = a.children.eq(0).position() : a.active.index == p() - 1 && a.carousel ? f = a.children.eq((p() - 1) * h()).position() : a.active.index == a.children.length - 1 && (f = a.children.eq(a.children.length - 1).position());
					f && ("horizontal" == a.settings.mode ? w(-f.left, "reset", 0) : "vertical" == a.settings.mode && w(-f.top, "reset", 0))
				}
				a.working = !1;
				a.settings.onSlideAfter(a.children.eq(a.active.index), a.oldIndex, a.active.index)
			},
			B = function (f) {
				a.settings.autoControlsCombine ? a.controls.autoEl.html(a.controls[f]) : (a.controls.autoEl.find("a").removeClass("active"), a.controls.autoEl.find("a:not(.bx-" + f + ")").addClass("active"))
			},
			F = function () {
				1 == p() ? (a.controls.prev.addClass("disabled"), a.controls.next.addClass("disabled")) : !a.settings.infiniteLoop && a.settings.hideControlOnEnd && (0 == a.active.index ? (a.controls.prev.addClass("disabled"), a.controls.next.removeClass("disabled")) : a.active.index == p() - 1 ? (a.controls.next.addClass("disabled"), a.controls.prev.removeClass("disabled")) : (a.controls.prev.removeClass("disabled"), a.controls.next.removeClass("disabled")))
			},
			L = function () {
				0 < a.settings.autoDelay ? setTimeout(c.startAuto, a.settings.autoDelay) : c.startAuto();
				a.settings.autoHover && c.hover(function () {
					a.interval && (c.stopAuto(!0), a.autoPaused = !0)
				}, function () {
					a.autoPaused && (c.startAuto(!0), a.autoPaused = null)
				})
			},
			M = function () {
				var f = 0;
				"next" == a.settings.autoDirection ? c.append(a.children.clone().addClass("bx-clone")) : (c.prepend(a.children.clone().addClass("bx-clone")), f = a.children.first().position(), f = "horizontal" == a.settings.mode ? -f.left : -f.top);
				w(f, "reset", 0);
				a.settings.pager = !1;
				a.settings.controls = !1;
				a.settings.autoControls = !1;
				a.settings.tickerHover && !a.usingCSS && a.viewport.hover(function () {
					c.stop()
				}, function () {
					var f = 0;
					a.children.each(function (b) {
						f += "horizontal" == a.settings.mode ? d(this).outerWidth(!0) : d(this).outerHeight(!0)
					});
					var b = a.settings.speed / f * (f - Math.abs(parseInt(c.css("horizontal" == a.settings.mode ? "left" : "top"))));
					z(b)
				});
				z()
			},
			z = function (f) {
				speed = f ? f : a.settings.speed;
				f = {
					left: 0,
					top: 0
				};
				var b = {
					left: 0,
					top: 0
				};
				"next" == a.settings.autoDirection ? f = c.find(".bx-clone").first().position() : b = a.children.first().position();
				w("horizontal" == a.settings.mode ? -f.left : -f.top, "ticker", speed, {
					resetValue: "horizontal" == a.settings.mode ? -b.left : -b.top
				})
			},
			N = function (f) {
				a.working ? f.preventDefault() : (a.touch.originalPos = c.position(), f = f.originalEvent, a.touch.start.x = f.changedTouches[0].pageX, a.touch.start.y = f.changedTouches[0].pageY, a.viewport.bind("touchmove", G), a.viewport.bind("touchend", H))
			},
			G = function (f) {
				var b = f.originalEvent,
					m = Math.abs(b.changedTouches[0].pageX - a.touch.start.x),
					h = Math.abs(b.changedTouches[0].pageY - a.touch.start.y);
				3 * m > h && a.settings.preventDefaultSwipeX ? f.preventDefault() : 3 * h > m && a.settings.preventDefaultSwipeY && f.preventDefault();
				"fade" != a.settings.mode && a.settings.oneToOneTouch && ("horizontal" == a.settings.mode ? (b = b.changedTouches[0].pageX - a.touch.start.x, f = a.touch.originalPos.left + b) : (b = b.changedTouches[0].pageY - a.touch.start.y, f = a.touch.originalPos.top + b), w(f, "reset", 0))
			},
			H = function (f) {
				a.viewport.unbind("touchmove", G);
				var b = f.originalEvent;
				f = 0;
				a.touch.end.x = b.changedTouches[0].pageX;
				a.touch.end.y = b.changedTouches[0].pageY;
				"fade" == a.settings.mode ? (b = Math.abs(a.touch.start.x - a.touch.end.x), b >= a.settings.swipeThreshold && (a.touch.start.x > a.touch.end.x ? c.goToNextSlide() : c.goToPrevSlide(), c.stopAuto())) : ("horizontal" == a.settings.mode ? (b = a.touch.end.x - a.touch.start.x, f = a.touch.originalPos.left) : (b = a.touch.end.y - a.touch.start.y, f = a.touch.originalPos.top), !a.settings.infiniteLoop && (0 == a.active.index && 0 < b || a.active.last && 0 > b) ? w(f, "reset", 200) : Math.abs(b) >= a.settings.swipeThreshold ? (0 > b ? c.goToNextSlide() : c.goToPrevSlide(), c.stopAuto()) : w(f, "reset", 200));
				a.viewport.unbind("touchend", H)
			},
			E = function (f) {
				if (a.initialized) {
					f = d(window).width();
					var b = d(window).height();
					if (e != f || g != b) e = f, g = b, c.redrawSlider(), a.settings.onSliderResize.call(c, a.active.index)
				}
			};
		c.goToSlide = function (f, b) {
			if (!a.working && a.active.index != f) {
				a.working = !0;
				a.oldIndex = a.active.index;
				0 > f ? a.active.index = p() - 1 : f >= p() ? a.active.index = 0 : a.active.index = f;
				a.settings.onSlideBefore(a.children.eq(a.active.index), a.oldIndex, a.active.index);
				if ("next" == b) a.settings.onSlideNext(a.children.eq(a.active.index), a.oldIndex, a.active.index);
				else if ("prev" == b) a.settings.onSlidePrev(a.children.eq(a.active.index), a.oldIndex, a.active.index);
				a.active.last = a.active.index >= p() - 1;
				a.settings.pager && C(a.active.index);
				a.settings.controls && F();
				if ("fade" == a.settings.mode) a.settings.adaptiveHeight && a.viewport.height() != x() && a.viewport.animate({
					height: x()
				}, a.settings.adaptiveHeightSpeed), a.children.filter(":visible").fadeOut(a.settings.speed).css({
					zIndex: 0
				}), a.children.eq(a.active.index).css("zIndex", a.settings.slideZIndex + 1).fadeIn(a.settings.speed, function () {
					d(this).css("zIndex", a.settings.slideZIndex);
					D()
				});
				else {
					a.settings.adaptiveHeight && a.viewport.height() != x() && a.viewport.animate({
						height: x()
					}, a.settings.adaptiveHeightSpeed);
					var m = 0,
						k = {
							left: 0,
							top: 0
						};
					if (!a.settings.infiniteLoop && a.carousel && a.active.last)
						if ("horizontal" == a.settings.mode) var s = a.children.eq(a.children.length - 1),
							k = s.position(),
							m = a.viewport.width() - s.outerWidth();
						else k = a.children.eq(a.children.length - a.settings.minSlides).position();
					else a.carousel && a.active.last && "prev" == b ? (k = 1 == a.settings.moveSlides ? a.settings.maxSlides - h() : (p() - 1) * h() - (a.children.length - a.settings.maxSlides), s = c.children(".bx-clone").eq(k), k = s.position()) : "next" == b && 0 == a.active.index ? (k = c.find("> .bx-clone").eq(a.settings.maxSlides).position(), a.active.last = !1) : 0 <= f && (k = f * h(), k = a.children.eq(k).position());
					"undefined" !== typeof k && w("horizontal" == a.settings.mode ? -(k.left - m) : -k.top, "slide", a.settings.speed)
				}
			}
		};
		c.goToNextSlide = function () {
			if (a.settings.infiniteLoop || !a.active.last) {
				var f = parseInt(a.active.index) + 1;
				c.goToSlide(f, "next")
			}
		};
		c.goToPrevSlide = function () {
			if (a.settings.infiniteLoop || 0 != a.active.index) {
				var f = parseInt(a.active.index) - 1;
				c.goToSlide(f, "prev")
			}
		};
		c.startAuto = function (f) {
			a.interval || (a.interval = setInterval(function () {
				"next" == a.settings.autoDirection ? c.goToNextSlide() : c.goToPrevSlide()
			}, a.settings.pause), a.settings.autoControls && !0 != f && B("stop"))
		};
		c.stopAuto = function (f) {
			a.interval && (clearInterval(a.interval), a.interval = null, a.settings.autoControls && !0 != f && B("start"))
		};
		c.getCurrentSlide = function () {
			return a.active.index
		};
		c.getCurrentSlideElement = function () {
			return a.children.eq(a.active.index)
		};
		c.getSlideCount = function () {
			return a.children.length
		};
		c.redrawSlider = function () {
			a.children.add(c.find(".bx-clone")).width(f());
			a.viewport.css("height", x());
			a.settings.ticker || s();
			a.active.last && (a.active.index = p() - 1);
			a.active.index >= p() && (a.active.last = !0);
			a.settings.pager && !a.settings.pagerCustom && (y(), C(a.active.index))
		};
		c.destroySlider = function () {
			a.initialized && (a.initialized = !1, d(".bx-clone", this).remove(), a.children.each(function () {
				void 0 != d(this).data("origStyle") ? d(this).attr("style", d(this).data("origStyle")) : d(this).removeAttr("style")
			}), void 0 != d(this).data("origStyle") ? this.attr("style", d(this).data("origStyle")) : d(this).removeAttr("style"), d(this).unwrap().unwrap(), a.controls.el && a.controls.el.remove(), a.controls.next && a.controls.next.remove(), a.controls.prev && a.controls.prev.remove(), a.pagerEl && a.settings.controls && a.pagerEl.remove(), d(".bx-caption", this).remove(), a.controls.autoEl && a.controls.autoEl.remove(), clearInterval(a.interval), a.settings.responsive && d(window).unbind("resize", E))
		};
		c.reloadSlider = function (a) {
			void 0 != a && (b = a);
			c.destroySlider();
			l()
		};
		l();
		return this
	}
})(jQuery);
(function (d) {
	d.easing.jswing = d.easing.swing;
	d.extend(d.easing, {
		def: "easeOutQuad",
		swing: function (t, b, a, c, e) {
			return d.easing[d.easing.def](t, b, a, c, e)
		},
		easeInQuad: function (d, b, a, c, e) {
			return c * (b /= e) * b + a
		},
		easeOutQuad: function (d, b, a, c, e) {
			return -c * (b /= e) * (b - 2) + a
		},
		easeInOutQuad: function (d, b, a, c, e) {
			return 1 > (b /= e / 2) ? c / 2 * b * b + a : -c / 2 * (--b * (b - 2) - 1) + a
		},
		easeInCubic: function (d, b, a, c, e) {
			return c * (b /= e) * b * b + a
		},
		easeOutCubic: function (d, b, a, c, e) {
			return c * ((b = b / e - 1) * b * b + 1) + a
		},
		easeInOutCubic: function (d, b, a, c, e) {
			return 1 > (b /= e / 2) ? c / 2 * b * b * b + a : c / 2 * ((b -= 2) * b * b + 2) + a
		},
		easeInQuart: function (d, b, a, c, e) {
			return c * (b /= e) * b * b * b + a
		},
		easeOutQuart: function (d, b, a, c, e) {
			return -c * ((b = b / e - 1) * b * b * b - 1) + a
		},
		easeInOutQuart: function (d, b, a, c, e) {
			return 1 > (b /= e / 2) ? c / 2 * b * b * b * b + a : -c / 2 * ((b -= 2) * b * b * b - 2) + a
		},
		easeInQuint: function (d, b, a, c, e) {
			return c * (b /= e) * b * b * b * b + a
		},
		easeOutQuint: function (d, b, a, c, e) {
			return c * ((b = b / e - 1) * b * b * b * b + 1) + a
		},
		easeInOutQuint: function (d, b, a, c, e) {
			return 1 > (b /= e / 2) ? c / 2 * b * b * b * b * b + a : c / 2 * ((b -= 2) * b * b * b * b + 2) + a
		},
		easeInSine: function (d, b, a, c, e) {
			return -c * Math.cos(b / e * (Math.PI / 2)) + c + a
		},
		easeOutSine: function (d, b, a, c, e) {
			return c * Math.sin(b / e * (Math.PI / 2)) + a
		},
		easeInOutSine: function (d, b, a, c, e) {
			return -c / 2 * (Math.cos(Math.PI * b / e) - 1) + a
		},
		easeInExpo: function (d, b, a, c, e) {
			return 0 == b ? a : c * Math.pow(2, 10 * (b / e - 1)) + a
		},
		easeOutExpo: function (d, b, a, c, e) {
			return b == e ? a + c : c * (-Math.pow(2, -10 * b / e) + 1) + a
		},
		easeInOutExpo: function (d, b, a, c, e) {
			return 0 == b ? a : b == e ? a + c : 1 > (b /= e / 2) ? c / 2 * Math.pow(2, 10 * (b - 1)) + a : c / 2 * (-Math.pow(2, -10 * --b) + 2) + a
		},
		easeInCirc: function (d, b, a, c, e) {
			return -c * (Math.sqrt(1 - (b /= e) * b) - 1) + a
		},
		easeOutCirc: function (d, b, a, c, e) {
			return c * Math.sqrt(1 - (b = b / e - 1) * b) + a
		},
		easeInOutCirc: function (d, b, a, c, e) {
			return 1 > (b /= e / 2) ? -c / 2 * (Math.sqrt(1 - b * b) - 1) + a : c / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + a
		},
		easeInElastic: function (d, b, a, c, e) {
			d = 1.70158;
			var g = 0,
				l = c;
			if (0 == b) return a;
			if (1 == (b /= e)) return a + c;
			g || (g = 0.3 * e);
			l < Math.abs(c) ? (l = c, d = g / 4) : d = g / (2 * Math.PI) * Math.asin(c / l);
			return -(l * Math.pow(2, 10 * --b) * Math.sin(2 * (b * e - d) * Math.PI / g)) + a
		},
		easeOutElastic: function (d, b, a, c, e) {
			d = 1.70158;
			var g = 0,
				l = c;
			if (0 == b) return a;
			if (1 == (b /= e)) return a + c;
			g || (g = 0.3 * e);
			l < Math.abs(c) ? (l = c, d = g / 4) : d = g / (2 * Math.PI) * Math.asin(c / l);
			return l * Math.pow(2, -10 * b) * Math.sin(2 * (b * e - d) * Math.PI / g) + c + a
		},
		easeInOutElastic: function (d, b, a, c, e) {
			d = 1.70158;
			var g = 0,
				l = c;
			if (0 == b) return a;
			if (2 == (b /= e / 2)) return a + c;
			g || (g = 0.3 * e * 1.5);
			l < Math.abs(c) ? (l = c, d = g / 4) : d = g / (2 * Math.PI) * Math.asin(c / l);
			return 1 > b ? -0.5 * l * Math.pow(2, 10 * --b) * Math.sin(2 * (b * e - d) * Math.PI / g) + a : l * Math.pow(2, -10 * --b) * Math.sin(2 * (b * e - d) * Math.PI / g) * 0.5 + c + a
		},
		easeInBack: function (d, b, a, c, e, g) {
			void 0 == g && (g = 1.70158);
			return c * (b /= e) * b * ((g + 1) * b - g) + a
		},
		easeOutBack: function (d, b, a, c, e, g) {
			void 0 == g && (g = 1.70158);
			return c * ((b = b / e - 1) * b * ((g + 1) * b + g) + 1) + a
		},
		easeInOutBack: function (d, b, a, c, e, g) {
			void 0 == g && (g = 1.70158);
			return 1 > (b /= e / 2) ? c / 2 * b * b * (((g *= 1.525) + 1) * b - g) + a : c / 2 * ((b -= 2) * b * (((g *= 1.525) + 1) * b + g) + 2) + a
		},
		easeInBounce: function (t, b, a, c, e) {
			return c - d.easing.easeOutBounce(t, e - b, 0, c, e) + a
		},
		easeOutBounce: function (d, b, a, c, e) {
			return (b /= e) < 1 / 2.75 ? 7.5625 * c * b * b + a : b < 2 / 2.75 ? c * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + a : b < 2.5 / 2.75 ? c * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + a : c * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + a
		},
		easeInOutBounce: function (t, b, a, c, e) {
			return b < e / 2 ? 0.5 * d.easing.easeInBounce(t, 2 * b, 0, c, e) + a : 0.5 * d.easing.easeOutBounce(t, 2 * b - e, 0, c, e) + 0.5 * c + a
		}
	})
})(jQuery);
(function () {
	var d, t, b, a, c, e = function (a, b) {
			return function () {
				return a.apply(b, arguments)
			}
		},
		g = [].indexOf || function (a) {
			for (var b = 0, c = this.length; c > b; b++)
				if (b in this && this[b] === a) return b;
			return -1
		};
	t = function () {
		function a() {}
		return a.prototype.extend = function (a, b) {
			var c, d;
			for (c in b) d = b[c], null == a[c] && (a[c] = d);
			return a
		}, a.prototype.isMobile = function (a) {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
		}, a.prototype.createEvent = function (a, b, c, d) {
			var e;
			return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e
		}, a.prototype.emitEvent = function (a, b) {
			return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0
		}, a.prototype.addEvent = function (a, b, c) {
			return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c
		}, a.prototype.removeEvent = function (a, b, c) {
			return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b]
		}, a.prototype.innerHeight = function () {
			return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
		}, a
	}();
	b = this.WeakMap || this.MozWeakMap || (b = function () {
		function a() {
			this.keys = [];
			this.values = []
		}
		return a.prototype.get = function (a) {
			var b, c, d, e, f;
			f = this.keys;
			b = d = 0;
			for (e = f.length; e > d; b = ++d)
				if (c = f[b], c === a) return this.values[b]
		}, a.prototype.set = function (a, b) {
			var c, d, e, f, m;
			m = this.keys;
			c = e = 0;
			for (f = m.length; f > e; c = ++e)
				if (d = m[c], d === a) return void(this.values[c] = b);
			return this.keys.push(a), this.values.push(b)
		}, a
	}());
	d = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (d = function () {
		function a() {
			"undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser.");
			"undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
		}
		return a.notSupported = !0, a.prototype.observe = function () {}, a
	}());
	a = this.getComputedStyle || function (a) {
		return this.getPropertyValue = function (b) {
			var d;
			return "float" === b && (b = "styleFloat"), c.test(b) && b.replace(c, function (a, b) {
				return b.toUpperCase()
			}), (null != (d = a.currentStyle) ? d[b] : void 0) || null
		}, this
	};
	c = /(\-([a-z]){1})/g;
	this.WOW = function () {
		function c(a) {
			null == a && (a = {});
			this.scrollCallback = e(this.scrollCallback, this);
			this.scrollHandler = e(this.scrollHandler, this);
			this.resetAnimation = e(this.resetAnimation, this);
			this.start = e(this.start, this);
			this.scrolled = !0;
			this.config = this.util().extend(a, this.defaults);
			this.animationNameCache = new b;
			this.wowEvent = this.util().createEvent(this.config.boxClass)
		}
		return c.prototype.defaults = {
			boxClass: "wow",
			animateClass: "animated",
			offset: 0,
			mobile: !0,
			live: !0,
			callback: null
		}, c.prototype.init = function () {
			var a;
			return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
		}, c.prototype.start = function () {
			var a, b, c, e;
			if (this.stopped = !1, this.boxes = function () {
					var b, f, c, p;
					c = this.element.querySelectorAll("." + this.config.boxClass);
					p = [];
					b = 0;
					for (f = c.length; f > b; b++) a = c[b], p.push(a);
					return p
				}.call(this), this.all = function () {
					var b, f, c, p;
					c = this.boxes;
					p = [];
					b = 0;
					for (f = c.length; f > b; b++) a = c[b], p.push(a);
					return p
				}.call(this), this.boxes.length)
				if (this.disabled()) this.resetStyle();
				else
					for (e = this.boxes, b = 0, c = e.length; c > b; b++) a = e[b], this.applyStyle(a, !0);
			return this.disabled() || (this.util().addEvent(window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? (new d(function (a) {
				return function (f) {
					var b, c, h, d, k;
					k = [];
					b = 0;
					for (c = f.length; c > b; b++) d = f[b], k.push(function () {
						var a, f, b, c;
						b = d.addedNodes || [];
						c = [];
						a = 0;
						for (f = b.length; f > a; a++) h = b[a], c.push(this.doSync(h));
						return c
					}.call(a));
					return k
				}
			}(this))).observe(document.body, {
				childList: !0,
				subtree: !0
			}) : void 0
		}, c.prototype.stop = function () {
			return this.stopped = !0, this.util().removeEvent(window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
		}, c.prototype.sync = function () {
			return d.notSupported ? this.doSync(this.element) : void 0
		}, c.prototype.doSync = function (a) {
			var b, c, d, e;
			if (null == a && (a = this.element), 1 === a.nodeType) {
				a = a.parentNode || a;
				d = a.querySelectorAll("." + this.config.boxClass);
				e = [];
				b = 0;
				for (c = d.length; c > b; b++) a = d[b], 0 > g.call(this.all, a) ? (this.boxes.push(a), this.all.push(a), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(a, !0), e.push(this.scrolled = !0)) : e.push(void 0);
				return e
			}
		}, c.prototype.show = function (a) {
			return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a
		}, c.prototype.applyStyle = function (a, b) {
			var c, d, e;
			return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) {
				return function () {
					return f.customStyle(a, b, d, c, e)
				}
			}(this))
		}, c.prototype.animate = function () {
			return "requestAnimationFrame" in window ? function (a) {
				return window.requestAnimationFrame(a)
			} : function (a) {
				return a()
			}
		}(), c.prototype.resetStyle = function () {
			var a, b, c, d, e;
			d = this.boxes;
			e = [];
			b = 0;
			for (c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible");
			return e
		}, c.prototype.resetAnimation = function (a) {
			var b;
			return 0 <= a.type.toLowerCase().indexOf("animationend") ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()) : void 0
		}, c.prototype.customStyle = function (a, b, c, d, e) {
			return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
				animationDuration: c
			}), d && this.vendorSet(a.style, {
				animationDelay: d
			}), e && this.vendorSet(a.style, {
				animationIterationCount: e
			}), this.vendorSet(a.style, {
				animationName: b ? "none" : this.cachedAnimationName(a)
			}), a
		}, c.prototype.vendors = ["moz", "webkit"], c.prototype.vendorSet = function (a, b) {
			var c, d, e, f;
			d = [];
			for (c in b) e = b[c], a["" + c] = e, d.push(function () {
				var b, p, h, d;
				h = this.vendors;
				d = [];
				b = 0;
				for (p = h.length; p > b; b++) f = h[b], d.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e);
				return d
			}.call(this));
			return d
		}, c.prototype.vendorCSS = function (b, c) {
			var d, e, g, f, m, p;
			m = a(b);
			f = m.getPropertyCSSValue(c);
			g = this.vendors;
			d = 0;
			for (e = g.length; e > d; d++) p = g[d], f = f || m.getPropertyCSSValue("-" + p + "-" + c);
			return f
		}, c.prototype.animationName = function (b) {
			var c;
			try {
				c = this.vendorCSS(b, "animation-name").cssText
			} catch (d) {
				c = a(b).getPropertyValue("animation-name")
			}
			return "none" === c ? "" : c
		}, c.prototype.cacheAnimationName = function (a) {
			return this.animationNameCache.set(a, this.animationName(a))
		}, c.prototype.cachedAnimationName = function (a) {
			return this.animationNameCache.get(a)
		}, c.prototype.scrollHandler = function () {
			return this.scrolled = !0
		}, c.prototype.scrollCallback = function () {
			var a;
			if (!(a = !this.scrolled)) {
				this.scrolled = !1;
				var b, c, d, e;
				d = this.boxes;
				e = [];
				b = 0;
				for (c = d.length; c > b; b++)(a = d[b]) && (this.isVisible(a) ? this.show(a) : e.push(a));
				a = (this.boxes = e, this.boxes.length || this.config.live)
			}
			return a ? void 0 : this.stop()
		}, c.prototype.offsetTop = function (a) {
			for (var b; void 0 === a.offsetTop;) a = a.parentNode;
			for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
			return b
		}, c.prototype.isVisible = function (a) {
			var b, c, d, e, f;
			return c = a.getAttribute("data-wow-offset") || this.config.offset, f = window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f
		}, c.prototype.util = function () {
			return null != this._util ? this._util : this._util = new t
		}, c.prototype.disabled = function () {
			return !this.config.mobile && this.util().isMobile(navigator.userAgent)
		}, c
	}()
}).call(this);
var QRCode;
! function () {
	function d(a) {
		this.mode = g.MODE_8BIT_BYTE;
		this.data = a;
		this.parsedData = [];
		a = [];
		for (var b = 0, c = this.data.length; c > b; b++) {
			var h = this.data.charCodeAt(b);
			65536 < h ? (a[0] = 240 | (1835008 & h) >>> 18, a[1] = 128 | (258048 & h) >>> 12, a[2] = 128 | (4032 & h) >>> 6, a[3] = 128 | 63 & h) : 2048 < h ? (a[0] = 224 | (61440 & h) >>> 12, a[1] = 128 | (4032 & h) >>> 6, a[2] = 128 | 63 & h) : 128 < h ? (a[0] = 192 | (1984 & h) >>> 6, a[1] = 128 | 63 & h) : a[0] = h;
			this.parsedData = this.parsedData.concat(a)
		}
		this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
	}

	function t(a, b) {
		this.typeNumber = a;
		this.errorCorrectLevel = b;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = []
	}

	function b(a, b) {
		if (void 0 == a.length) throw Error(a.length + "/" + b);
		for (var c = 0; c < a.length && 0 == a[c];) c++;
		this.num = Array(a.length - c + b);
		for (var h = 0; h < a.length - c; h++) this.num[h] = a[h + c]
	}

	function a(a, b) {
		this.totalCount = a;
		this.dataCount = b
	}

	function c() {
		this.buffer = [];
		this.length = 0
	}

	function e() {
		var a = !1,
			b = navigator.userAgent;
		return /android/i.test(b) && (a = !0, aMat = b.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (a = parseFloat(aMat[1]))), a
	}
	d.prototype = {
		getLength: function () {
			return this.parsedData.length
		},
		write: function (a) {
			for (var b = 0, c = this.parsedData.length; c > b; b++) a.put(this.parsedData[b], 8)
		}
	};
	t.prototype = {
		addData: function (a) {
			a = new d(a);
			this.dataList.push(a);
			this.dataCache = null
		},
		isDark: function (a, b) {
			if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b) throw Error(a + "," + b);
			return this.modules[a][b]
		},
		getModuleCount: function () {
			return this.moduleCount
		},
		make: function () {
			this.makeImpl(!1, this.getBestMaskPattern())
		},
		makeImpl: function (a, b) {
			this.moduleCount = 4 * this.typeNumber + 17;
			this.modules = Array(this.moduleCount);
			for (var c = 0; c < this.moduleCount; c++) {
				this.modules[c] = Array(this.moduleCount);
				for (var h = 0; h < this.moduleCount; h++) this.modules[c][h] = null
			}
			this.setupPositionProbePattern(0, 0);
			this.setupPositionProbePattern(this.moduleCount - 7, 0);
			this.setupPositionProbePattern(0, this.moduleCount - 7);
			this.setupPositionAdjustPattern();
			this.setupTimingPattern();
			this.setupTypeInfo(a, b);
			7 <= this.typeNumber && this.setupTypeNumber(a);
			null == this.dataCache && (this.dataCache = t.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
			this.mapData(this.dataCache, b)
		},
		setupPositionProbePattern: function (a, b) {
			for (var c = -1; 7 >= c; c++)
				if (!(-1 >= a + c || this.moduleCount <= a + c))
					for (var h = -1; 7 >= h; h++) - 1 >= b + h || this.moduleCount <= b + h || (this.modules[a + c][b + h] = 0 <= c && 6 >= c && (0 == h || 6 == h) || 0 <= h && 6 >= h && (0 == c || 6 == c) || 2 <= c && 4 >= c && 2 <= h && 4 >= h ? !0 : !1)
		},
		getBestMaskPattern: function () {
			for (var a = 0, b = 0, c = 0; 8 > c; c++) {
				this.makeImpl(!0, c);
				var h = k.getLostPoint(this);
				(0 == c || a > h) && (a = h, b = c)
			}
			return b
		},
		createMovieClip: function (a, b, c) {
			a = a.createEmptyMovieClip(b, c);
			this.make();
			for (b = 0; b < this.modules.length; b++) {
				c = 1 * b;
				for (var h = 0; h < this.modules[b].length; h++) {
					var d = 1 * h;
					this.modules[b][h] && (a.beginFill(0, 100), a.moveTo(d, c), a.lineTo(d + 1, c), a.lineTo(d + 1, c + 1), a.lineTo(d, c + 1), a.endFill())
				}
			}
			return a
		},
		setupTimingPattern: function () {
			for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
			for (a = 8; a < this.moduleCount - 8; a++) null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
		},
		setupPositionAdjustPattern: function () {
			for (var a = k.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)
				for (var c = 0; c < a.length; c++) {
					var h = a[b],
						d = a[c];
					if (null == this.modules[h][d])
						for (var e = -2; 2 >= e; e++)
							for (var g = -2; 2 >= g; g++) this.modules[h + e][d + g] = -2 == e || 2 == e || -2 == g || 2 == g || 0 == e && 0 == g ? !0 : !1
				}
		},
		setupTypeNumber: function (a) {
			for (var b = k.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
				var h = !a && 1 == (1 & b >> c);
				this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = h
			}
			for (c = 0; 18 > c; c++) h = !a && 1 == (1 & b >> c), this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = h
		},
		setupTypeInfo: function (a, b) {
			for (var c = k.getBCHTypeInfo(this.errorCorrectLevel << 3 | b), h = 0; 15 > h; h++) {
				var d = !a && 1 == (1 & c >> h);
				6 > h ? this.modules[h][8] = d : 8 > h ? this.modules[h + 1][8] = d : this.modules[this.moduleCount - 15 + h][8] = d
			}
			for (h = 0; 15 > h; h++) d = !a && 1 == (1 & c >> h), 8 > h ? this.modules[8][this.moduleCount - h - 1] = d : 9 > h ? this.modules[8][15 - h - 1 + 1] = d : this.modules[8][15 - h - 1] = d;
			this.modules[this.moduleCount - 8][8] = !a
		},
		mapData: function (a, b) {
			for (var c = -1, h = this.moduleCount - 1, d = 7, e = 0, g = this.moduleCount - 1; 0 < g; g -= 2)
				for (6 == g && g--;;) {
					for (var n = 0; 2 > n; n++)
						if (null == this.modules[h][g - n]) {
							var r = !1;
							e < a.length && (r = 1 == (1 & a[e] >>> d));
							k.getMask(b, h, g - n) && (r = !r);
							this.modules[h][g - n] = r;
							d--; - 1 == d && (e++, d = 7)
						}
					if (h += c, 0 > h || this.moduleCount <= h) {
						h -= c;
						c = -c;
						break
					}
				}
		}
	};
	t.PAD0 = 236;
	t.PAD1 = 17;
	t.createData = function (b, d, e) {
		d = a.getRSBlocks(b, d);
		for (var h = new c, s = 0; s < e.length; s++) {
			var g = e[s];
			h.put(g.mode, 4);
			h.put(g.getLength(), k.getLengthInBits(g.mode, b));
			g.write(h)
		}
		for (s = b = 0; s < d.length; s++) b += d[s].dataCount;
		if (h.getLengthInBits() > 8 * b) throw Error("code length overflow. (" + h.getLengthInBits() + ">" + 8 * b + ")");
		for (h.getLengthInBits() + 4 <= 8 * b && h.put(0, 4); 0 != h.getLengthInBits() % 8;) h.putBit(!1);
		for (; !(h.getLengthInBits() >= 8 * b || (h.put(t.PAD0, 8), h.getLengthInBits() >= 8 * b));) h.put(t.PAD1, 8);
		return t.createBytes(h, d)
	};
	t.createBytes = function (a, c) {
		for (var d = 0, h = 0, e = 0, g = Array(c.length), y = Array(c.length), n = 0; n < c.length; n++) {
			var r = c[n].dataCount,
				l = c[n].totalCount - r,
				h = Math.max(h, r),
				e = Math.max(e, l);
			g[n] = Array(r);
			for (var q = 0; q < g[n].length; q++) g[n][q] = 255 & a.buffer[q + d];
			d += r;
			q = k.getErrorCorrectPolynomial(l);
			r = (new b(g[n], q.getLength() - 1)).mod(q);
			y[n] = Array(q.getLength() - 1);
			for (q = 0; q < y[n].length; q++) l = q + r.getLength() - y[n].length, y[n][q] = 0 <= l ? r.get(l) : 0
		}
		for (q = n = 0; q < c.length; q++) n += c[q].totalCount;
		d = Array(n);
		for (q = r = 0; h > q; q++)
			for (n = 0; n < c.length; n++) q < g[n].length && (d[r++] = g[n][q]);
		for (q = 0; e > q; q++)
			for (n = 0; n < c.length; n++) q < y[n].length && (d[r++] = y[n][q]);
		return d
	};
	for (var g = {
			MODE_NUMBER: 1,
			MODE_ALPHA_NUM: 2,
			MODE_8BIT_BYTE: 4,
			MODE_KANJI: 8
		}, l = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		}, k = {
			PATTERN_POSITION_TABLE: [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[6, 22, 38],
				[6, 24, 42],
				[6, 26, 46],
				[6, 28, 50],
				[6, 30, 54],
				[6, 32, 58],
				[6, 34, 62],
				[6, 26, 46, 66],
				[6, 26, 48, 70],
				[6, 26, 50, 74],
				[6, 30, 54, 78],
				[6, 30, 56, 82],
				[6, 30, 58, 86],
				[6, 34, 62, 90],
				[6, 28, 50, 72, 94],
				[6, 26, 50, 74, 98],
				[6, 30, 54, 78, 102],
				[6, 28, 54, 80, 106],
				[6, 32, 58, 84, 110],
				[6, 30, 58, 86, 114],
				[6, 34, 62, 90, 118],
				[6, 26, 50, 74, 98, 122],
				[6, 30, 54, 78, 102, 126],
				[6, 26, 52, 78, 104, 130],
				[6, 30, 56, 82, 108, 134],
				[6, 34, 60, 86, 112, 138],
				[6, 30, 58, 86, 114, 142],
				[6, 34, 62, 90, 118, 146],
				[6, 30, 54, 78, 102, 126, 150],
				[6, 24, 50, 76, 102, 128, 154],
				[6, 28, 54, 80, 106, 132, 158],
				[6, 32, 58, 84, 110, 136, 162],
				[6, 26, 54, 82, 110, 138, 166],
				[6, 30, 58, 86, 114, 142, 170]
			],
			G15: 1335,
			G18: 7973,
			G15_MASK: 21522,
			getBCHTypeInfo: function (a) {
				for (var b = a << 10; 0 <= k.getBCHDigit(b) - k.getBCHDigit(k.G15);) b ^= k.G15 << k.getBCHDigit(b) - k.getBCHDigit(k.G15);
				return (a << 10 | b) ^ k.G15_MASK
			},
			getBCHTypeNumber: function (a) {
				for (var b = a << 12; 0 <= k.getBCHDigit(b) - k.getBCHDigit(k.G18);) b ^= k.G18 << k.getBCHDigit(b) - k.getBCHDigit(k.G18);
				return a << 12 | b
			},
			getBCHDigit: function (a) {
				for (var b = 0; 0 != a;) b++, a >>>= 1;
				return b
			},
			getPatternPosition: function (a) {
				return k.PATTERN_POSITION_TABLE[a - 1]
			},
			getMask: function (a, b, c) {
				switch (a) {
					case 0:
						return 0 == (b + c) % 2;
					case 1:
						return 0 == b % 2;
					case 2:
						return 0 == c % 3;
					case 3:
						return 0 == (b + c) % 3;
					case 4:
						return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
					case 5:
						return 0 == b * c % 2 + b * c % 3;
					case 6:
						return 0 == (b * c % 2 + b * c % 3) % 2;
					case 7:
						return 0 == (b * c % 3 + (b + c) % 2) % 2;
					default:
						throw Error("bad maskPattern:" + a);
				}
			},
			getErrorCorrectPolynomial: function (a) {
				for (var c = new b([1], 0), d = 0; a > d; d++) c = c.multiply(new b([1, v.gexp(d)], 0));
				return c
			},
			getLengthInBits: function (a, b) {
				if (1 <= b && 10 > b) switch (a) {
					case g.MODE_NUMBER:
						return 10;
					case g.MODE_ALPHA_NUM:
						return 9;
					case g.MODE_8BIT_BYTE:
						return 8;
					case g.MODE_KANJI:
						return 8;
					default:
						throw Error("mode:" + a);
				} else if (27 > b) switch (a) {
					case g.MODE_NUMBER:
						return 12;
					case g.MODE_ALPHA_NUM:
						return 11;
					case g.MODE_8BIT_BYTE:
						return 16;
					case g.MODE_KANJI:
						return 10;
					default:
						throw Error("mode:" + a);
				} else {
					if (!(41 > b)) throw Error("type:" + b);
					switch (a) {
						case g.MODE_NUMBER:
							return 14;
						case g.MODE_ALPHA_NUM:
							return 13;
						case g.MODE_8BIT_BYTE:
							return 16;
						case g.MODE_KANJI:
							return 12;
						default:
							throw Error("mode:" + a);
					}
				}
			},
			getLostPoint: function (a) {
				for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
					for (var e = 0; b > e; e++) {
						for (var g = 0, k = a.isDark(d, e), n = -1; 1 >= n; n++)
							if (!(0 > d + n || d + n >= b))
								for (var r = -1; 1 >= r; r++) 0 > e + r || e + r >= b || (0 != n || 0 != r) && k == a.isDark(d + n, e + r) && g++;
						5 < g && (c += 3 + g - 5)
					}
				for (d = 0; b - 1 > d; d++)
					for (e = 0; b - 1 > e; e++) g = 0, a.isDark(d, e) && g++, a.isDark(d + 1, e) && g++, a.isDark(d, e + 1) && g++, a.isDark(d + 1, e + 1) && g++, 0 != g && 4 != g || (c += 3);
				for (d = 0; b > d; d++)
					for (e = 0; b - 6 > e; e++) a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
				for (e = 0; b > e; e++)
					for (d = 0; b - 6 > d; d++) a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
				for (e = g = 0; b > e; e++)
					for (d = 0; b > d; d++) a.isDark(d, e) && g++;
				a = Math.abs(100 * g / b / b - 50) / 5;
				return c + 10 * a
			}
		}, v = {
			glog: function (a) {
				if (1 > a) throw Error("glog(" + a + ")");
				return v.LOG_TABLE[a]
			},
			gexp: function (a) {
				for (; 0 > a;) a += 255;
				for (; 256 <= a;) a -= 255;
				return v.EXP_TABLE[a]
			},
			EXP_TABLE: Array(256),
			LOG_TABLE: Array(256)
		}, u = 0; 8 > u; u++) v.EXP_TABLE[u] = 1 << u;
	for (u = 8; 256 > u; u++) v.EXP_TABLE[u] = v.EXP_TABLE[u - 4] ^ v.EXP_TABLE[u - 5] ^ v.EXP_TABLE[u - 6] ^ v.EXP_TABLE[u - 8];
	for (u = 0; 255 > u; u++) v.LOG_TABLE[v.EXP_TABLE[u]] = u;
	b.prototype = {
		get: function (a) {
			return this.num[a]
		},
		getLength: function () {
			return this.num.length
		},
		multiply: function (a) {
			for (var c = Array(this.getLength() + a.getLength() - 1), d = 0; d < this.getLength(); d++)
				for (var e = 0; e < a.getLength(); e++) c[d + e] ^= v.gexp(v.glog(this.get(d)) + v.glog(a.get(e)));
			return new b(c, 0)
		},
		mod: function (a) {
			if (0 > this.getLength() - a.getLength()) return this;
			for (var c = v.glog(this.get(0)) - v.glog(a.get(0)), d = Array(this.getLength()), e = 0; e < this.getLength(); e++) d[e] = this.get(e);
			for (e = 0; e < a.getLength(); e++) d[e] ^= v.gexp(v.glog(a.get(e)) + c);
			return (new b(d, 0)).mod(a)
		}
	};
	a.RS_BLOCK_TABLE = [
		[1, 26, 19],
		[1, 26, 16],
		[1, 26, 13],
		[1, 26, 9],
		[1, 44, 34],
		[1, 44, 28],
		[1, 44, 22],
		[1, 44, 16],
		[1, 70, 55],
		[1, 70, 44],
		[2, 35, 17],
		[2, 35, 13],
		[1, 100, 80],
		[2, 50, 32],
		[2, 50, 24],
		[4, 25, 9],
		[1, 134, 108],
		[2, 67, 43],
		[2, 33, 15, 2, 34, 16],
		[2, 33, 11, 2, 34, 12],
		[2, 86, 68],
		[4, 43, 27],
		[4, 43, 19],
		[4, 43, 15],
		[2, 98, 78],
		[4, 49, 31],
		[2, 32, 14, 4, 33, 15],
		[4, 39, 13, 1, 40, 14],
		[2, 121, 97],
		[2, 60, 38, 2, 61, 39],
		[4, 40, 18, 2, 41, 19],
		[4, 40, 14, 2, 41, 15],
		[2, 146, 116],
		[3, 58, 36, 2, 59, 37],
		[4, 36, 16, 4, 37, 17],
		[4, 36, 12, 4, 37, 13],
		[2, 86, 68, 2, 87, 69],
		[4, 69, 43, 1, 70, 44],
		[6, 43, 19, 2, 44, 20],
		[6, 43, 15, 2, 44, 16],
		[4, 101, 81],
		[1, 80, 50, 4, 81, 51],
		[4, 50, 22, 4, 51, 23],
		[3, 36, 12, 8, 37, 13],
		[2, 116, 92, 2, 117, 93],
		[6, 58, 36, 2, 59, 37],
		[4, 46, 20, 6, 47, 21],
		[7, 42, 14, 4, 43, 15],
		[4, 133, 107],
		[8, 59, 37, 1, 60, 38],
		[8, 44, 20, 4, 45, 21],
		[12, 33, 11, 4, 34, 12],
		[3, 145, 115, 1, 146, 116],
		[4, 64, 40, 5, 65, 41],
		[11, 36, 16, 5, 37, 17],
		[11, 36, 12, 5, 37, 13],
		[5, 109, 87, 1, 110, 88],
		[5, 65, 41, 5, 66, 42],
		[5, 54, 24, 7, 55, 25],
		[11, 36, 12],
		[5, 122, 98, 1, 123, 99],
		[7, 73, 45, 3, 74, 46],
		[15, 43, 19, 2, 44, 20],
		[3, 45, 15, 13, 46, 16],
		[1, 135, 107, 5, 136, 108],
		[10, 74, 46, 1, 75, 47],
		[1, 50, 22, 15, 51, 23],
		[2, 42, 14, 17, 43, 15],
		[5, 150, 120, 1, 151, 121],
		[9, 69, 43, 4, 70, 44],
		[17, 50, 22, 1, 51, 23],
		[2, 42, 14, 19, 43, 15],
		[3, 141, 113, 4, 142, 114],
		[3, 70, 44, 11, 71, 45],
		[17, 47, 21, 4, 48, 22],
		[9, 39, 13, 16, 40, 14],
		[3, 135, 107, 5, 136, 108],
		[3, 67, 41, 13, 68, 42],
		[15, 54, 24, 5, 55, 25],
		[15, 43, 15, 10, 44, 16],
		[4, 144, 116, 4, 145, 117],
		[17, 68, 42],
		[17, 50, 22, 6, 51, 23],
		[19, 46, 16, 6, 47, 17],
		[2, 139, 111, 7, 140, 112],
		[17, 74, 46],
		[7, 54, 24, 16, 55, 25],
		[34, 37, 13],
		[4, 151, 121, 5, 152, 122],
		[4, 75, 47, 14, 76, 48],
		[11, 54, 24, 14, 55, 25],
		[16, 45, 15, 14, 46, 16],
		[6, 147, 117, 4, 148, 118],
		[6, 73, 45, 14, 74, 46],
		[11, 54, 24, 16, 55, 25],
		[30, 46, 16, 2, 47, 17],
		[8, 132, 106, 4, 133, 107],
		[8, 75, 47, 13, 76, 48],
		[7, 54, 24, 22, 55, 25],
		[22, 45, 15, 13, 46, 16],
		[10, 142, 114, 2, 143, 115],
		[19, 74, 46, 4, 75, 47],
		[28, 50, 22, 6, 51, 23],
		[33, 46, 16, 4, 47, 17],
		[8, 152, 122, 4, 153, 123],
		[22, 73, 45, 3, 74, 46],
		[8, 53, 23, 26, 54, 24],
		[12, 45, 15, 28, 46, 16],
		[3, 147, 117, 10, 148, 118],
		[3, 73, 45, 23, 74, 46],
		[4, 54, 24, 31, 55, 25],
		[11, 45, 15, 31, 46, 16],
		[7, 146, 116, 7, 147, 117],
		[21, 73, 45, 7, 74, 46],
		[1, 53, 23, 37, 54, 24],
		[19, 45, 15, 26, 46, 16],
		[5, 145, 115, 10, 146, 116],
		[19, 75, 47, 10, 76, 48],
		[15, 54, 24, 25, 55, 25],
		[23, 45, 15, 25, 46, 16],
		[13, 145, 115, 3, 146, 116],
		[2, 74, 46, 29, 75, 47],
		[42, 54, 24, 1, 55, 25],
		[23, 45, 15, 28, 46, 16],
		[17, 145, 115],
		[10, 74, 46, 23, 75, 47],
		[10, 54, 24, 35, 55, 25],
		[19, 45, 15, 35, 46, 16],
		[17, 145, 115, 1, 146, 116],
		[14, 74, 46, 21, 75, 47],
		[29, 54, 24, 19, 55, 25],
		[11, 45, 15, 46, 46, 16],
		[13, 145, 115, 6, 146, 116],
		[14, 74, 46, 23, 75, 47],
		[44, 54, 24, 7, 55, 25],
		[59, 46, 16, 1, 47, 17],
		[12, 151, 121, 7, 152, 122],
		[12, 75, 47, 26, 76, 48],
		[39, 54, 24, 14, 55, 25],
		[22, 45, 15, 41, 46, 16],
		[6, 151, 121, 14, 152, 122],
		[6, 75, 47, 34, 76, 48],
		[46, 54, 24, 10, 55, 25],
		[2, 45, 15, 64, 46, 16],
		[17, 152, 122, 4, 153, 123],
		[29, 74, 46, 14, 75, 47],
		[49, 54, 24, 10, 55, 25],
		[24, 45, 15, 46, 46, 16],
		[4, 152, 122, 18, 153, 123],
		[13, 74, 46, 32, 75, 47],
		[48, 54, 24, 14, 55, 25],
		[42, 45, 15, 32, 46, 16],
		[20, 147, 117, 4, 148, 118],
		[40, 75, 47, 7, 76, 48],
		[43, 54, 24, 22, 55, 25],
		[10, 45, 15, 67, 46, 16],
		[19, 148, 118, 6, 149, 119],
		[18, 75, 47, 31, 76, 48],
		[34, 54, 24, 34, 55, 25],
		[20, 45, 15, 61, 46, 16]
	];
	a.getRSBlocks = function (b, c) {
		var d = a.getRsBlockTable(b, c);
		if (void 0 == d) throw Error("bad rs block @ typeNumber:" + b + "/errorCorrectLevel:" + c);
		for (var e = d.length / 3, g = [], w = 0; e > w; w++)
			for (var k = d[3 * w + 0], n = d[3 * w + 1], r = d[3 * w + 2], l = 0; k > l; l++) g.push(new a(n, r));
		return g
	};
	a.getRsBlockTable = function (b, c) {
		switch (c) {
			case l.L:
				return a.RS_BLOCK_TABLE[4 * (b - 1) + 0];
			case l.M:
				return a.RS_BLOCK_TABLE[4 * (b - 1) + 1];
			case l.Q:
				return a.RS_BLOCK_TABLE[4 * (b - 1) + 2];
			case l.H:
				return a.RS_BLOCK_TABLE[4 * (b - 1) + 3]
		}
	};
	c.prototype = {
		get: function (a) {
			return 1 == (1 & this.buffer[Math.floor(a / 8)] >>> 7 - a % 8)
		},
		put: function (a, b) {
			for (var c = 0; b > c; c++) this.putBit(1 == (1 & a >>> b - c - 1))
		},
		getLengthInBits: function () {
			return this.length
		},
		putBit: function (a) {
			var b = Math.floor(this.length / 8);
			this.buffer.length <= b && this.buffer.push(0);
			a && (this.buffer[b] |= 128 >>> this.length % 8);
			this.length++
		}
	};
	var x = [
			[17, 14, 11, 7],
			[32, 26, 20, 14],
			[53, 42, 32, 24],
			[78, 62, 46, 34],
			[106, 84, 60, 44],
			[134, 106, 74, 58],
			[154, 122, 86, 64],
			[192, 152, 108, 84],
			[230, 180, 130, 98],
			[271, 213, 151, 119],
			[321, 251, 177, 137],
			[367, 287, 203, 155],
			[425, 331, 241, 177],
			[458, 362, 258, 194],
			[520, 412, 292, 220],
			[586, 450, 322, 250],
			[644, 504, 364, 280],
			[718, 560, 394, 310],
			[792, 624, 442, 338],
			[858, 666, 482, 382],
			[929, 711, 509, 403],
			[1003, 779, 565, 439],
			[1091, 857, 611, 461],
			[1171, 911, 661, 511],
			[1273, 997, 715, 535],
			[1367, 1059, 751, 593],
			[1465, 1125, 805, 625],
			[1528, 1190, 868, 658],
			[1628, 1264, 908, 698],
			[1732, 1370, 982, 742],
			[1840, 1452, 1030, 790],
			[1952, 1538, 1112, 842],
			[2068, 1628, 1168, 898],
			[2188, 1722, 1228, 958],
			[2303, 1809, 1283, 983],
			[2431, 1911, 1351, 1051],
			[2563, 1989, 1423, 1093],
			[2699, 2099, 1499, 1139],
			[2809, 2213, 1579, 1219],
			[2953, 2331, 1663, 1273]
		],
		u = function () {
			var a = function (a, b) {
				this._el = a;
				this._htOption = b
			};
			return a.prototype.draw = function (a) {
				function b(a, c) {
					var d = document.createElementNS("http://www.w3.org/2000/svg", a),
						e;
					for (e in c) c.hasOwnProperty(e) && d.setAttribute(e, c[e]);
					return d
				}
				var c = this._htOption,
					d = this._el,
					e = a.getModuleCount();
				Math.floor(c.width / e);
				Math.floor(c.height / e);
				this.clear();
				var f = b("svg", {
					viewBox: "0 0 " + String(e) + " " + String(e),
					width: "100%",
					height: "100%",
					fill: c.colorLight
				});
				f.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
				d.appendChild(f);
				f.appendChild(b("rect", {
					fill: c.colorDark,
					width: "1",
					height: "1",
					id: "template"
				}));
				for (c = 0; e > c; c++)
					for (d = 0; e > d; d++)
						if (a.isDark(c, d)) {
							var g = b("use", {
								x: String(c),
								y: String(d)
							});
							g.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
							f.appendChild(g)
						}
			}, a.prototype.clear = function () {
				for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
			}, a
		}(),
		A = "svg" === document.documentElement.tagName.toLowerCase() ? u : "undefined" != typeof CanvasRenderingContext2D ? function () {
			function a() {
				this._elImage.src = this._elCanvas.toDataURL("image/png");
				this._elImage.style.display = "block";
				this._elCanvas.style.display = "none"
			}

			function b(a, c) {
				var d = this;
				if (d._fFail = c, d._fSuccess = a, null === d._bSupportDataURI) {
					var e = document.createElement("img"),
						f = function () {
							d._bSupportDataURI = !1;
							d._fFail && _fFail.call(d)
						};
					return e.onabort = f, e.onerror = f, e.onload = function () {
						d._bSupportDataURI = !0;
						d._fSuccess && d._fSuccess.call(d)
					}, e.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", void 0
				}!0 === d._bSupportDataURI && d._fSuccess ? d._fSuccess.call(d) : !1 === d._bSupportDataURI && d._fFail && d._fFail.call(d)
			}
			if (this._android && 2.1 >= this._android) {
				var c = 1 / window.devicePixelRatio,
					d = CanvasRenderingContext2D.prototype.drawImage;
				CanvasRenderingContext2D.prototype.drawImage = function (a, b, e, f, g, m, k, l) {
					if ("nodeName" in a && /img/i.test(a.nodeName))
						for (var s = arguments.length - 1; 1 <= s; s--) arguments[s] *= c;
					else "undefined" == typeof l && (arguments[1] *= c, arguments[2] *= c, arguments[3] *= c, arguments[4] *= c);
					d.apply(this, arguments)
				}
			}
			var g = function (a, b) {
				this._bIsPainted = !1;
				this._android = e();
				this._htOption = b;
				this._elCanvas = document.createElement("canvas");
				this._elCanvas.width = b.width;
				this._elCanvas.height = b.height;
				a.appendChild(this._elCanvas);
				this._el = a;
				this._oContext = this._elCanvas.getContext("2d");
				this._bIsPainted = !1;
				this._elImage = document.createElement("img");
				this._elImage.style.display = "none";
				this._el.appendChild(this._elImage);
				this._bSupportDataURI = null
			};
			return g.prototype.draw = function (a) {
				var b = this._elImage,
					c = this._oContext,
					d = this._htOption,
					e = a.getModuleCount(),
					f = d.width / e,
					h = d.height / e,
					g = Math.round(f),
					m = Math.round(h);
				b.style.display = "none";
				this.clear();
				for (b = 0; e > b; b++)
					for (var p = 0; e > p; p++) {
						var k = a.isDark(b, p),
							l = p * f,
							s = b * h;
						c.strokeStyle = k ? d.colorDark : d.colorLight;
						c.lineWidth = 1;
						c.fillStyle = k ? d.colorDark : d.colorLight;
						c.fillRect(l, s, f, h);
						c.strokeRect(Math.floor(l) + 0.5, Math.floor(s) + 0.5, g, m);
						c.strokeRect(Math.ceil(l) - 0.5, Math.ceil(s) - 0.5, g, m)
					}
				this._bIsPainted = !0
			}, g.prototype.makeImage = function () {
				this._bIsPainted && b.call(this, a)
			}, g.prototype.isPainted = function () {
				return this._bIsPainted
			}, g.prototype.clear = function () {
				this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
				this._bIsPainted = !1
			}, g.prototype.round = function (a) {
				return a ? Math.floor(1E3 * a) / 1E3 : a
			}, g
		}() : function () {
			var a = function (a, b) {
				this._el = a;
				this._htOption = b
			};
			return a.prototype.draw = function (a) {
				for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = ['<table style="border:0;border-collapse:collapse;">'], k = 0; d > k; k++) {
					g.push("<tr>");
					for (var l = 0; d > l; l++) g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(k, l) ? b.colorDark : b.colorLight) + ';"></td>');
					g.push("</tr>")
				}
				g.push("</table>");
				c.innerHTML = g.join("");
				a = c.childNodes[0];
				c = (b.width - a.offsetWidth) / 2;
				b = (b.height - a.offsetHeight) / 2;
				0 < c && 0 < b && (a.style.margin = b + "px " + c + "px")
			}, a.prototype.clear = function () {
				this._el.innerHTML = ""
			}, a
		}();
	QRCode = function (a, b) {
		if (this._htOption = {
				width: 256,
				height: 256,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: l.H
			}, "string" == typeof b && (b = {
				text: b
			}), b)
			for (var c in b) this._htOption[c] = b[c];
		"string" == typeof a && (a = document.getElementById(a));
		this._android = e();
		this._el = a;
		this._oQRCode = null;
		this._oDrawing = new A(this._el, this._htOption);
		this._htOption.text && this.makeCode(this._htOption.text)
	};
	QRCode.prototype.makeCode = function (a) {
		var b = this._htOption.correctLevel,
			c = 1,
			d;
		d = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
		d = d.length + (d.length != a ? 3 : 0);
		for (var e = 0, g = x.length; g >= e; e++) {
			var k = 0;
			switch (b) {
				case l.L:
					k = x[e][0];
					break;
				case l.M:
					k = x[e][1];
					break;
				case l.Q:
					k = x[e][2];
					break;
				case l.H:
					k = x[e][3]
			}
			if (k >= d) break;
			c++
		}
		if (c > x.length) throw Error("Too long data");
		this._oQRCode = new t(c, this._htOption.correctLevel);
		this._oQRCode.addData(a);
		this._oQRCode.make();
		this._el.title = a;
		this._oDrawing.draw(this._oQRCode);
		this.makeImage()
	};
	QRCode.prototype.makeImage = function () {
		"function" == typeof this._oDrawing.makeImage && (!this._android || 3 <= this._android) && this._oDrawing.makeImage()
	};
	QRCode.prototype.clear = function () {
		this._oDrawing.clear()
	};
	QRCode.CorrectLevel = l
}();
