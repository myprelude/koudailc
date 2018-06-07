(function(root,$){
    function upload(contain,startFun,progress,done,error,url){
        var fileUpload = "<form enctype='multipart/form-data' style='display:none;opacity:0;'  id='file_upload'>\
                        <input type='file' multiple='multiple' >\
                        </form>";
        $('body').append(fileUpload);
        
        // 拖拽添加图片功能
        $(contain).on("dragenter",function(e){e.stopPropagation();e.preventDefault();})
        $(contain).on("dragover",function(e){e.stopPropagation();e.preventDefault();})
        $(contain).on("drop",function(e){
            e.stopPropagation();
            e.preventDefault();
            // 获取上传文件的内容
            var files = e.originalEvent.dataTransfer.files;
            $.each(files,function(index,file){
                checkImg(file,index)
            })  
        })
        $(contain).on('click',function(e){
            if($(e.currentTarget).attr('isclick')){
                $('#file_upload').find('input').trigger('click');
            }
            
        })
        $('#file_upload').find('input').on('change',function(e){
            var files = $(this)[0].files;
            $.each(files,function(index,file){
                checkImg(file,index)
            })  
        })
        function checkImg(file,index){
            
             // 创建img
             var name = file.name,
                id = '__file__'+index
                imgArr = ['png','jpeg','jpg','gif'];
             var i = name.lastIndexOf('.'),
                suffix = name.substr(i+1),
                isImage = imgArr.indexOf(suffix)==-1?false:true;
            var reader = new FileReader();
            if(isImage){
                var imglocalurl = window.URL.createObjectURL(file)
                reader.readAsDataURL(file);
                reader.onload = function(e){
                        canvasDataURL(e.target.result,{quality:0.5},function(base,scale,w){
                            startFun&&startFun();
                            ajaxUpload({base:base,
                                        name:name,
                                        id:id,
                                        imgurl:url,
                                        scale:scale,
                                        type:'img',
                                        w:w})                      
                        })
                    }
            }else{
                reader.readAsText(file);
                reader.onload =  function(e){
                        startFun&&startFun();
                        ajaxUpload({
                            base:e.target.result,
                            name:name,
                            id:id,
                            type:suffix=='zip'?'zip':'file',
                            imgurl:url
                        }) 
                    };
            }
             // 读取File对象中的内容
             
        }
        function ajaxUpload(imgFile){
            var formData = new FormData();
            formData.append('base',imgFile.base);
            formData.append('name',imgFile.name);
            formData.append('id',imgFile.id);
            formData.append('imgurl',imgFile.imgurl);
            formData.append('type',imgFile.type);
            $.ajax({
                url:'../upload/img',
                type:'POST',
                data:formData,
                cache: false,
                contentType:false, 
                processData: false,
                xhr:xhrOnProgress(function(e){
                    progress&&progress((e.loaded / e.total * 100) + '%',imgFile);
                }),
                success:function(data){;
                    delete imgFile.base;
                    done&&done(data,imgFile);
                    $('#file_upload').find('input').val('');
                },
                error:function(){
                    error&&error('no img url',imgFile)
                }
            })
        }
    }
    
    function canvasDataURL(path, obj, callback){
        var type = path.replace(/data:image\/([^;]+).*/i,'$1');
        var quality = 0.7; // 默认的图片压缩质量
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var imgW = that.width,imgH = that.height,scale = imgW / imgH;
            var w = obj.width || imgW,h = obj.height || (imgW / scale);
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            canvas.setAttribute('width',w);
            canvas.setAttribute('height',h);
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            if(type=='png'){
                var base64 = canvas.toDataURL('image/png');
            }else if(type=='gif'){
                var base64 = path;
            }else{
                var base64 = canvas.toDataURL('image/jpeg', quality);
            }
            // 回调函数返回base64的值
            callback&&callback(base64,scale,imgW);
        }
    }
    
    //jq onprogress 上传函数添加
    var xhrOnProgress=function(fun) {
        xhrOnProgress.onprogress = fun; //绑定监听
        //使用闭包实现监听绑
        return function() {
          //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
          var xhr = $.ajaxSettings.xhr();
          //判断监听函数是否为函数
          if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
          //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
          if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
          }
          return xhr;
        }
    }
    root['upload'] = upload;
})(window,jQuery);


