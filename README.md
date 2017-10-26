
#  进入notisfy.html实现:

### 窗口弹出，简单实现弹出窗口关闭：鼠标放置于右上角后可出现×，然后点击图片有变换，立马关闭弹出窗口  

1. 打开页面即弹出通知窗口  

    ```js
    const notify = new Notify({
    title: '最新通知',
    content: '新诗发布~'
    })
    ```  

2. 放置鼠标于弹框通知右上角，出现× 

   ```css
    #close:hover{
    background:url(sh.png) no-repeat 0px 0px;
    }
  
    #close:active{
	background:url(sh.png) no-repeat 0px -25px;
    }     
   ```  

3. 定时：8秒后自动关闭  

    ```js
    notify.show({
    autoHide: true,
    timeout:8000
    })
    ```
 
4. 关闭指定窗口  

   ```js
    $(document).ready(function(){
  
	$("#close").click(function(){
		$("#box").hide();
	})

    })
    ```    
  
### 创建了网页链接  


   #### 表格中的3个链接

+ [London](https://baike.baidu.com/item/%E4%BC%A6%E6%95%A6/862?fr=aladdin)  

+ [Paris](https://baike.baidu.com/item/%E5%B7%B4%E9%BB%8E/858?fr=aladdin)  

+ [Tokyo](https://baike.baidu.com/item/%E4%B8%9C%E4%BA%AC/438)  


####  窗口中的链接

+ [一首诗](诗.html)