placeholder v1.0
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

##update log##<br/>
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

