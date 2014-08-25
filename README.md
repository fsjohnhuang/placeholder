placeholder v0.2
===========

polyfill for IE5.5~9 doesn't support placeholder feature<br/>
**usage:**<br/>
````
<html>
  <head></head>
  <body>
    <form>
	  <input type="text" placeholder="type your name pls."/>
	  <input type="text" placeholder="type your number pls."/>
	</form>
	<script type="text/javascript" charset="utf-8" src="./polyfill_placeholder.js"></script>
	<script type="text/javascript">
	  placeholder.attr = 'placeholder';
	  placeholder();
	</script>
  </body>
</html>
````

**v0.2**<br/>
修复placeholder文字可被选中的bug<br/>

**v0.1**<br/>
初步完成功能<br/>

