/**
 * @author fsjohnhuang
 * @version v0.3
 */
;(function(exports){
	var isIE = /msie|Trident/i.test(navigator.userAgent);
	var _factory = document.createElement('DIV');
	var _$ = function (html){
			_factory.innerHTML = html;	
			return _factory.firstChild;
		};
	var _on = function(el, evt, handler){
		var evtPrefix = '',
			on = el.addEventListener && 'addEventListener' || 
				(evtPrefix = 'on') && 'attachEvent';
		el[on](evtPrefix + evt, handler);
	}
	// 判断是否为W3C标准的盒子模式
	var _isBoxModel = (function(){
		var tmp = _$('<div style="padding-left:1px;width:1px; position: absolute;"></div>');
		document.body.appendChild(tmp);
		var ret = tmp.offsetWidth === 1;
		document.body.removeChild(tmp);

		return ret;
	}());
	// 获取计算后的样式值
	var _getComputedStyle = function(el, prop){
		var kv ;
		if (el.currentStyle){
			kv =  el.currentStyle;
		}else{
			kv = window.getComputedStyle(el, null);
		}

		return kv[prop];
	}
	// 文本模板
	var _fmt = function(str/*arg1,arg2...*/){
		var args = [].slice.call(arguments, 1);
		var ret = str.replace(/\$\{[^}{]+\}/g, function(orig){
				var k = /\$\{([^}{]+)\}/.exec(orig)[1];
				return args[k] || args[0][k] || '';
			});

		return ret;
	};

	var _css = function(el, prop){
		var cssHook = _cssHook[prop] || _cssHook['default'];
		var val = cssHook(el, prop);

		return val;
	};
	var _default = {
		'borderWidth': 1,
		'paddingWidth': 2
	};
	var _tunningVal = 3;
	var _cssHook = {};
	_cssHook['width'] = _isBoxModel && 
		function(el){
			return (el.offsetWidth - 2 *_tunningVal) + 'px'; // 宽度比文本框小
		} ||function(el){
			var minuend = 0;
			var props = ['border', 'padding'], dirs = ['Left', 'Right'];
			for (var i = 0, prop; prop = props[i++];){
				for (var j = 0, dir; dir = dirs[j++];){
					minuend += (parseInt(_getComputedStyle(el, prop + dir)) || _default[prop + 'Width']);
				}
			}

			var w = el.offsetWidth - minuend - 2 * _tunningVal;
			return w + 'px';
		};
	_cssHook['height'] = _cssHook['lineHeight'] = _isBoxModel &&
		function(el){
			return el.offsetHeight + 'px';
		} || function(el){
			var minuend = 0;
			var props = ['border', 'padding'], dirs = ['Top', 'Bottom'];
			for (var i = 0, prop; prop = props[i++];){
				for (var j = 0, dir; dir = dirs[j++];){
					minuend += (parseInt(_getComputedStyle(el, prop + dir)) || _default[prop + 'Width']);
				}
			}

			var h = el.offsetHeight - minuend;
			return h + 'px';
		};
	var _rPos = /^\s*relative|absolute\s*$/i;
	_cssHook['top'] = function(el){
			var pos = _getComputedStyle(el, 'position');
			if (!_rPos.test(pos)){
				el.style.position = 'relative';
			}

			return el.offsetTop + 'px';
		};
	_cssHook['left'] = function(el){
			var pos = _getComputedStyle(el, 'position');
			if (!_rPos.test(pos)){
				el.style.position = 'relative';
			}

			return (el.offsetLeft + _tunningVal) + 'px';
		};
	_cssHook['fontSize'] = function(el){
			var val = _getComputedStyle(el, 'fontSize'), integer;
			val = parseFloat(val), integer = parseInt(val);
			val = val > integer ? integer + 1 : integer;

			return val + 'px';
		};

	_cssHook['default'] = function(el, prop){
			return _getComputedStyle(el, prop);
		};


	var _tpl = '<span unselectable="on" style="${userSelect};white-space:${whiteSpace};position:${position};overflow:${overflow};font-family:${fontFamily};color:${color};'+
		'top:${top};left:${left};height:${height};width:${width};font-size:${fontSize};padding:${paddingTop} 0 ${paddingBottom} ${paddingLeft};line-height:${lineHeight};">' + 
		'${innerHTML}</span>';
	var _createHtml = function(el){
		var kv = {
				'userSelect': '-webkit-user-select:none;-moz-user-select:none;-khtml-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none',
				'whiteSpace': 'nowrap',
				'position': 'absolute',
				'overflow': 'hidden',
				'fontFamily': 'arial,sans-serif',
				'color': placeholder.color,
				'innerHTML': el.getAttribute(placeholder.attr)
			};
		var props = ['top', 'left', 'height', 'width', 'fontSize', 'paddingLeft', 'paddingTop', 'paddingBottom', 'lineHeight'];
		for (var i = 0, prop; prop = props[i++];){
			kv[prop] = _css(el, prop);
		}
		var html = _fmt(_tpl, kv);

		return html;
	};

	var _proc = function(el){
		var html = _createHtml(el);
		var phel = _$(html);
		// 点击placeholder时，文本框获取的焦点
		_on(phel, 'click', function(){
			el.focus();
		});
		if (isIE){
			_on(el, 'focus', function(e){
				phel.style.display = 'none';	
			});
			_on(el, 'blur', function(e){
				var evt = e || window.event, 
					target = evt.srcElement || evt.target;
				phel.style.display = target.value === '' ? 'inline' : 'none';	
			});
		}
		else{
			_on(el, 'keyup', function(e){
				var evt = e || window.event, 
					target = evt.srcElement || evt.target;
				phel.style.display = target.value === '' ? 'inline' : 'none';	
			});
			_on(el, 'keydown', function(e){
				var evt = e || window.event;
				if (evt.keyCode !== 8){
					phel.style.display = 'none';
				}
			});
		}
		el.parentNode.appendChild(phel);
	};

	exports.placeholder = function(){
  		var els = document.getElementsByTagName('input');
  		for (var i = 0, el; el = els[i++];){
  			el.type === 'text' && 
				el.getAttribute(placeholder.attr) && 
				_proc(el);
  		}
  	};
	exports.placeholder.attr = 'data-placeholder';
	exports.placeholder.color = '#888';
}(window));
