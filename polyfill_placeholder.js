/**
 * @author fsjohnhuang
 * @version v0.1
 */
;(function(exports){
	// 判断是否使用W3C的CSS盒子模型
	var _isBoxModel = (function(){
		var tmp = document.createElement('div');
		tmp.style.cssText = 'width:1px; position: absolute;';
		document.body.appendChild(tmp);
		tmp.style.paddingLeft = '1px';
		var ret = tmp.offsetWidth === 1;
		document.body.removeChild(tmp);

		return ret;
	}());

	var defaultBorderWidth = 1,
		defaultPaddingWidth = 2;
	var _getW = function(el){
		var w = el.offsetWidth;
		if (_isBoxModel) return w;

		var bl = parseInt(_getComputedStyle(el, 'borderLeft')) || defaultBorderWidth,
			br = parseInt(_getComputedStyle(el, 'borderRight')) || defaultBorderWidth;
		var pl = parseInt(_getComputedStyle(el, 'paddingLeft')) || defaultPaddingWidth,
			pr = parseInt(_getComputedStyle(el, 'paddingRight')) || defaultPaddingWidth;
		w = w - bl - br - pl - pr;
		return w;
	};
	var _getH = function(el){
		var h = el.offsetHeight;
		if (_isBoxModel) return h;

		var bt = parseInt(_getComputedStyle(el, 'borderTop')) || defaultBorderWidth,
			bb = parseInt(_getComputedStyle(el, 'borderBottom')) || defaultBorderWidth;
		var pt = parseInt(_getComputedStyle(el, 'paddingTop')) || defaultPaddingWidth,
			pb = parseInt(_getComputedStyle(el, 'paddingBottom')) || defaultPaddingWidth;
		h = h - bt - bb - pt - pb;
		return h;
	};

	var _getComputedStyle = function(el, prop){
		return el.currentStyle[prop];
	}
	var _getInputTopLeft = function(el){
		var pos = _getComputedStyle(el, 'position');
		if (pos !== 'relative' || pos !== 'absolute'){
			el.style.position = 'relative';
		}

		return {
			top: el.offsetTop,
			left: el.offsetLeft
		};
	};

	var defaultBorderWidth = 1;
	var color = '#888';
	var _createPlaceholder = function(top, left, height, width, padding, fontSize, lineHeight, val){
		var el = document.createElement('span');
		el.style.border = 'solid 1px red';
		el.style.whiteSpace = 'nowrap';
		el.style.position = 'absolute';
		el.style.overflow = 'hidden';
		el.style.fontFamily = 'arial,sans-serif';

		el.style.color = color;
		el.style.top = top + 'px';
		el.style.left = left + 'px';
		el.style.height = (_isBoxModel ? height : (height - 6)) + 'px';
		el.style.width = (_isBoxModel ? width : (width - 6)) + 'px';
		el.style.fontSize = fontSize;
		el.style.padding = "2px 2px";
		el.style.lineHeight = lineHeight;
		el.innerHTML = val;

		return el;
	};
	var _attachPlaceholder = function(input, placeholder){
		input.parentNode.appendChild(placeholder);
	}	

	var data_placeholder = 'data-placeholder';
	var _proc = function(el){
		var height = el.offsetHeight,
			width = el.offsetWidth,
			fontSize = _getComputedStyle(el, 'fontSize'),
			padding = _getComputedStyle(el, 'padding'),
			lineHeight = _getComputedStyle(el, 'lineHeight');
		var topLeft = _getInputTopLeft(el);

		var placeholder = _createPlaceholder(topLeft.top, 
			topLeft.left, 
			height, 
			width,
			padding,
			fontSize, 
			lineHeight,
			el.getAttribute(data_placeholder));
		_attachPlaceholder(el, placeholder);
	};

	exports.placeholder = function(){
  		var els = document.getElementsByTagName('input');
  		for (var i = 0, el; el = els[i++];){
  			el.type === 'text' && _proc(el);
  		}
  	};
}(window));