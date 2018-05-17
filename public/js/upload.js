(function(root){
    
    // root['upload']
})(window);
/**
 * contain 上传图片的容器
 * 
 */
function upload(contain,id,callback){
    //  添加一个隐藏的input[type=file]
    var input = document.createElement("input"),nodeId;
    input.type = 'file';
    input.id = nodeId = id||'fileType';
    input.style = 'display:none;'
    $('body').append(input);
    // 点击容器处罚 添加图片功能
    // $(contain).on('click',function(){
    //     $('#'+nodeId).trigger('click');
    // })
    // 拖拽添加图片功能
    $(contain).on("dragenter",function(e){
        e.stopPropagation();
        e.preventDefault();
    })
    $(contain).on("dragover",function(e){
        e.stopPropagation();
        e.preventDefault();
    })
    $(contain).on("drop",function(e){
        e.stopPropagation();
        e.preventDefault();
        // 获取上传文件的内容
        var files = e.originalEvent.dataTransfer.files;

        $.each(files,function(index,file){

            // 创建img
            var img = document.createElement("img");
            var name = file.name;

            // 读取File对象中的内容
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (function(){
                return function(e){
                    canvasDataURL(e.target.result,{quality:0.5},function(base){
                        console.log(base);
                        ajaxUpload({name:name})                      
                    })
                }
            })()
        })
        
        
    })
}

function canvasDataURL(path, obj, callback){
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
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback&&callback(base64);
    }
}

function ajaxUpload(imgFile){
    $.ajax({
        url:'upload/img',
        method:'POST',
        data:imgFile,
        dataType: 'json', 
        processData: false,    
        contentType: false,
        success:function(data){
            console.log(data);
        },
        error:function(){

        }
    })
}