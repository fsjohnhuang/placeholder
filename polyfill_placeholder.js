/**
 * @author fsjohnhuang
 * @version v1.5
 */
;(function(exports){
	var rUnit = /[a-z]+$/i;
	var rPos = /^\s*relative|absolute\s*$/i;
	var rTagName = /input|textarea/i;
	var rNative = /[^}{}]+\{\s*\[native code\]\s*\}/i;

	// OperaMini v7.0 貌似支持placeholder，实际是不支持的。
	var isOperaMini = 'operamini' in window;
	var isSupport = {
		// 检测input是否原生支持placeholder
		'input': 'placeholder' in document.createElement('input') && !isOperaMini,
		// 检测textarea是否原生支持placeholder
		'textarea': 'placeholder' in document.createElement('textarea') && !isOperaMini
	};

	var isIE = /msie|Trident/i.test(navigator.userAgent);
	var isIE5 = isIE && (document.documentMode === 5 || !document.compatMode || document.compatMode === 'BackCompat');
	var isLteIE8 = !+[1,];

	var toArray = function(nodeList){
		var array = [];
		for (var i = 0, node; node = nodeList[i++];){
			array.push(node);
		}

		return array;
	};
	// 参考mass Framework
	// 罗列出[[class]]与最终表达的类型不同的项目
	var cls2Type = {
		'[object HTMLDocument]': 'Document',
		'[object HTMLCollection]': 'NodeList',
		'[object StaticNodeList]': 'NodeList',
		'[object IXMLDOMNodeList]': 'NodeList',
		'[object DOMWindow]': 'Window',
		'[object global]': 'Window',
		'null': 'Null',
		'undefined': 'Undefined',
		'NaN': 'NaN'
	};
	// 罗列出[[class]]与最终类型相同的项目
	'Boolean String Number Function Array Date RegExp Window Document Arguments NodeList Math Navigator Screen Location History'.replace(/\S+/g,function(name){
		cls2Type['[object ' + name + ']'] = name;
	});
	var toString = Object.prototype.toString;
	var getType = function(obj){
		var type = cls2Type[(obj == null || isNaN(obj)) ? obj  : toString.call(obj)] || node.tagName || '#';
		if (type === '#'){
			if (obj.document && obj.document != obj){
				type = 'Window';
			}
			else if (obj.nodeType === 9){
				type = 'Document';
			}
			// isFinite用于判断是否为有限数值
			else if (obj.callee && isFinite(obj.length) && !obj.slice){
				type = 'Arguments';
			}
			else if (isFinite(obj.length) && rNative.test(obj.item)){
				type = 'NodeList';
			}
			else if (location === obj){
				type = 'location';			
			}
			else if (navigator === obj){
				type = 'navigator';
			}
			else if (screen === obj){
				type = 'Screen';
			}
			else if (history === obj){
				type = 'History';
			}
			else{
				type = toString.call(obj).slice(8, -1);
			}
		}

		return type;
	};
	// 参考jQuery 1.9
	// plain object是指通过{}和new Object()方式创建的js对象
	var isPlainObj = function(obj){
		if (getType(obj) !== 'object' || obj === window || obj.nodeType){
			return false;
		}
		if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')){
			return false;
		}

		return true;
	};
	var dom_factory = document.createElement('DIV');
	var dom = function (html){
			dom_factory.innerHTML = html;	
			return dom_factory.firstChild;
		};
	// 封装事件绑定方法
	var evtPrefix = '',
		evtListener = document.body.addEventListener && 'addEventListener' || 
			(evtPrefix = 'on') && 'attachEvent';
	var on = function(/*<el, evt, handler> or <el, evtHandlers>*/){
		on[arguments.length].apply(on, arguments);
	};
	on[2] = function(el, evtHandlers){
		for (var evt in evtHandlers){
			this[3](el, evt, evtHandlers[evt]);	
		}
	};
	on[3] = function(el, evt, handler){
		el[evtListener](evtPrefix + evt, handler);
	};
	// 判断是否为W3C标准的盒子模式
	var isBoxModel = (function(){
		var tmp = dom('<div style="padding-left:1px;width:1px; position: absolute;"></div>');
		document.body.appendChild(tmp);
		var ret = tmp.offsetWidth === 1;
		document.body.removeChild(tmp);

		return ret;
	}());
	// 获取计算后的样式值
	var getComputedStyle = function(el, prop){
		var kv ;
		if (el.currentStyle){
			kv =  el.currentStyle;
		}else{
			kv = window.getComputedStyle(el, null);
		}

		return kv[prop];
	}
	// 文本模板
	var fmt = function(str/*arg1,arg2...*/){
		if (arguments.length <= 1) return str;

		var args = [].slice.call(arguments, 1);
		var ret = str.replace(/\$\{[^}{]+\}/g, function(orig){
				var k = /\$\{([^}{]+)\}/.exec(orig)[1];
				return args[k] || args[0][k] || '';
			});

		return ret;
	};

	var css = function(el, prop){
		var cssHook = cssHooks[prop] || cssHooks['default'];
		var val = cssHook(el, prop);

		return val;
	};

	var cssHooks = {};
	// v1.4 clientWidth为content+padding的宽度
	// 获取content宽度
	cssHooks['width'] =	function(el){
			var pl = parseInt(getComputedStyle(el, 'paddingLeft')) || 0,
				pr = parseInt(getComputedStyle(el, 'paddingRight')) || 0;
			return (el.clientWidth - pl - pr)+ 'px';
		}
	// v1.4 clientHeight为content+padding的高度
	// 获取content高度
	cssHooks['height'] = cssHooks['lineHeight@input'] =	function(el){
			var pt = parseInt(getComputedStyle(el, 'paddingTop')) || 0,
				pb = parseInt(getComputedStyle(el, 'paddingBottom')) || 0;
			return (el.clientHeight - pt - pb) + 'px';
		};
	// v1.4 修复不必要的position=relative设置
	cssHooks['top'] = function(el){
			return el.offsetTop + 'px';
		};
	// v1.4 修复不必要的position=relative设置
	cssHooks['left'] = function(el){
			return el.offsetLeft + 'px';
		};
	// v0.4 修复字体大小单位与相应的文本框不对应的bug
	cssHooks['fontSize'] = function(el){
			var val = getComputedStyle(el, 'fontSize'), integer, unit;
			unit = rUnit.exec(val), val = parseFloat(val), integer = parseInt(val);
			unit = unit && unit[0] || 'px';
			val = val > integer ? integer + 1 : integer;

			return val + unit;
		};

	cssHooks['default'] = function(el, prop){
			return getComputedStyle(el, prop);
		};


	var tpl = '<span unselectable="on" style="${userSelect};white-space:${whiteSpace};word-break:${wordBreak};word-wrap:${wordWrap};' + 
		'position:${position};display:${display};overflow:${overflow};overflow-y:${overflow-y};font-family:${fontFamily};color:${color};'+
		'top:${top};left:${left};height:${height};width:${width};font-size:${fontSize};' + 
		'padding:${paddingTop} 0 ${paddingBottom} ${paddingLeft};line-height:${lineHeight};text-align:${textAlign};">' + 
		'${innerHTML}</span>';
	var createHtml = function(el, opts){
		var kv = {
				// v0.2 修复placeholder文字可被选中的bug
				'userSelect': '-webkit-user-select:none;-moz-user-select:none;-khtml-user-select:none;' +
					'-ms-user-select:none;-o-user-select:none;user-select:none',
				'position': 'absolute',
				'overflow': 'hidden',
				'fontFamily': 'arial,sans-serif',
				'color': opts.color,
				'innerHTML': el.getAttribute(opts.attr)
			};
		var props = [{ 
				prop: 'left', getVal: function(el){
					var bl = parseInt(css(el, 'borderLeft')) || 0,
						pl = parseInt(css(el, 'paddingLeft')) || 0,
						left = parseInt(css(el, 'left')) || 0;
					return (left + bl + pl) + 'px';
				}	
			}, {
				prop: 'top', getVal: function(el){
					var bt = parseInt(css(el, 'borderTop')) || 0,
						pt = parseInt(css(el, 'paddingTop')) || 0,
						top = parseInt(css(el, 'top')) || 0;
					return (top + bt + pt) + 'px';
				}
			}, {
				prop: 'height', getVal: function(el){
					var pt = parseInt(css(el, 'paddingTop')) || 0,
						pb = parseInt(css(el, 'paddingBottom')) || 0,
						h = parseInt(css(el, 'height')) || 0;
					return (h - pt - pb) + 'px';
				}
			}, 'fontSize', 'paddingLeft', 
			'paddingTop', 'paddingBottom',  
			// v1.4 textarea使用公用width csshook即可
			{ 
				prop: 'width', getVal: function(el){
					var pl = parseInt(css(el, 'paddingLeft')) || 0,
						pr = parseInt(css(el, 'paddingRight')) || 0,
						w = parseInt(css(el, 'width')) || 0;
					return (w - pl - pr) + 'px';
				}
			},
			// v0.6 修复placeholder与相应的文本框的text-align样式不对应的bug
			'textAlign'];
		createHtml[el.tagName.toLowerCase()](kv, props);
		for (var i = 0, prop; prop = props[i++];){
			// v1.5修复placeholder在设置left，top等属性时没有考虑input,textarea的border宽度，
			// 导致placeholder贴近input,textarea左侧边框的bug
			if (typeof prop !== 'string'){
				kv[prop.prop.split('@')[0]] = prop.getVal(el);
			}
			else{
				kv[prop.split('@')[0]] = css(el, prop);
			}
		}
		// v0.5 修复IE5.5下placeholder位置向下方偏离的bug
		if (isIE5){
			kv['paddingTop'] = '0';
		}
		// v0.7 修复初始化placeholder时，文本框非空而出现placeholder的bug
		if (el.value !== ''){
			kv['display'] = 'none';
		}
		var html = fmt(tpl, kv);

		return html;
	};
	createHtml['input'] = function(kv, props){
		kv['whiteSpace'] = 'nowrap'; // 强制不换行
		kv['display'] = 'inline';
		kv['overflow-y'] = 'hidden';
		props.splice(props.length, 0, 'lineHeight@input');
	};
	createHtml['textarea'] = function(kv, props){
		kv['whiteSpace'] = 'normal';
		kv['wordBreak'] = 'break-all'; //IE强制换行
		kv['wordWrap'] = 'break-word'; //IE、FF和Chrome强制换行
		kv['display'] = 'block';
		// v1.5修复textarea裁剪过长placehoder内容的bug
		kv['overflow-y'] = 'auto';
		props.splice(props.length, 0, 'lineHeight');	
	};

	var proc = function(el, opts){
		// v1.4 设置el的position为relative
		if (!rPos.test(getComputedStyle(el, 'position'))){
			el.style.position = 'relative';
		}

		var html = createHtml(el, opts);
		var phel = dom(html);
		// 点击placeholder时，文本框获取的焦点
		on(phel, 'click', function(){
			el.focus();
		});
		// v0.3 修复在IE中使用中文输入法时placeholder闪烁的bug
		if (isIE){
			on(el, {
				'focus': function(e){
					phel.style.display = 'none';	
				},
				'blur': function(e){
					var evt = e || window.event, 
						target = evt.srcElement || evt.target;
					phel.style.display = target.value === '' ? 'inline' : 'none';	
				}
			});
		}
		else{
			on(el, {
				'keyup': function(e){
					var evt = e || window.event, 
						target = evt.srcElement || evt.target;
					phel.style.display = target.value === '' ? 'inline' : 'none';	
				},
				'keydown': function(e){
					var evt = e || window.event;
					if (evt.keyCode !== 8){
						phel.style.display = 'none';
					}
				}
			});
			// 设置用户不能改变textarea大小
			if (el.tagName.toLowerCase() === 'textarea'){
				el.style.resize = 'none';
			}
		}
		el.parentNode.appendChild(phel);
	};

	var ph = exports.placeholder = function(ctx,  opts){
		var ctxIsPlain = isPlainObj(ctx);
		ctx = !ctxIsPlain && ctx || document;
		opts = ctxIsPlain && ctx || opts || {};
		opts.attr = opts.attr || placeholder.ATTR;
		opts.color= opts.color || placeholder.COLOR;
	
		var els;
		if (opts.attr === 'placeholder'){
			if (isSupport['input'] && isSupport['textarea']) return;

			if (rTagName.test(ctx.tagName)){
				if (isSupport[ctx.tagName.toLowerCase()]) return;
				els = [ctx];
			}
			else{
				els = isSupport['input'] ? [] : toArray(ctx.getElementsByTagName('input'));
				els = isSupport['textarea'] ? els : els.concat(toArray(ctx.getElementsByTagName('textarea')));
			}
		}
		else{
			if (rTagName.test(ctx.tagName)){
				els = [ctx];
			}
			else{
				els = toArray(ctx.getElementsByTagName('input'))
				els = els.concat(toArray(ctx.getElementsByTagName('textarea')));
			}
		}
  		for (var i = 0, el; el= els[i++];){
			el.getAttribute(opts.attr) && proc(el, opts);
  		}
  	};
	ph.ATTR = 'data-placeholder';
	ph.COLOR = '#888';
}(window));
