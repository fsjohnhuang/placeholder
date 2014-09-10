﻿placeholder v1.3
===========

polyfill for IE5.5~9 doesn't support placeholder feature<br/>
**v1.0**<br/>
支持input\[type="text"\]的placeholder特性。<br/>
Global Setting<br/>
`placeholder.attr`：指定placeholder特性名称，默认为data-placeholder<br/>
`placeholder.color`：指定placeholder的文字前景色，默认为#888<br/>

**usage:**<br/>
````
<html>
  <head></head>
  <body>
    <form>
	  <input type="text" placeholder="type your name pls."/>
	  <input type="text" placeholder="type your number pls."/>
	  <textarea placeholder="type detail pls."></textarea>
	</form>
	<!--[if lte IE 9]>
	<script type="text/javascript" charset="utf-8" src="./polyfill_placeholder.js"></script>
	<script type="text/javascript">
	  placeholder.attr = 'placeholder';
	  placeholder();
	</script>
	<![endif]-->
  </body>
</html>
````

##update log<br/>
**v1.5**<br/>
修复设置placeholder的top、left、height和width时出现误差的bug<br/>
修复剪裁texarea过长的placeholder内容的bug<br/>

**v1.4**<br/>
使用el.clientWidth/Height代替el.offsetWidth/Height。<br/>
删除不必要的代码。<br/>

**v1.3**<br/>
设置FF、Chrome和Safari下用户无法改变textarea大小。


**v1.2**<br/>
参考mass Framework完善`getType`方法

**v1.1**<br/>
参考[mathiasbynens/jquery-placeholder](https://github.com/mathiasbynens/jquery-placeholder)后<br/>
新增功能：<br/>
1. 识别Opera Mini下对placeholder伪支持的坑<br/>
2. 添加textarea和其他input元素的placeholder支持<br/>
3. placeholder函数新增ctx和opts入参<br/>
ctx用于限制placeholder起作用的范围，默认为document<br/>
opts为placeholder属性设置，属性color为文本颜色，属性attr为placeholder属性名。<br/>

**v1.0**<br/>
将v0.7提升为v1.0<br/>

**v0.7**<br/>
修复初始化placeholder时，文本框非空而出现placeholder的bug<br/>

**v0.6**<br/>
修复placeholder与相应的文本框的text-align样式不对应的bug<br/>

**v0.5**<br/>
修复IE5.5下placeholder位置向下方偏离的bug<br/>

**v0.4**<br/>
修复字体大小单位与相应的文本框不对应的bug<br/>

**v0.3**<br/>
修复在IE中使用中文输入法时placeholder闪烁的bug<br/>

**v0.2**<br/>
修复placeholder文字可被选中的bug<br/>

**v0.1**<br/>
完成input\[type="text"\]元素placeholder特性的基本功能<br/>

