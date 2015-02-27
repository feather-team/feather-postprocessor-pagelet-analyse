module.exports = function(content, file, conf){
    if(file.isPageletLike && file.isHtmlLike){
        var id = file.subpathNoExt.replace(/\//g, '_');
        var sameCss = feather.file.wrap(file.id.replace(/\.[^\.]+$/, '.css'));
        var sameJs = feather.file.wrap(file.id.replace(/\.[^\.]+$/, '.js'));

        var tmp = content.match(/<!--pagelet:((?:(?!-->)[\s\S])+)-->/i);

        if(tmp){
            tmp = tmp[1].split(':');

            var pageletId = tmp[0], type = (tmp[1] || 'textarea').toLowerCase(), reg = new RegExp('<\\/' + type + '>', 'g');

            if(['script', 'style', 'textarea'].indexOf(type.toLowerCase()) > -1){
                content = content.replace(new RegExp('<\\/' + type + '>', 'g'), '<\\\/' + type + '>');
            }

            content = '<' + type + ' id="' + id + '" style="display: none !important;" type="text/html">\r\n' + content + '</' + type + '>';

            var async1 = ['/static/pagelet.js'];

            if(sameCss.exists()){
                async1.push(sameCss.subpath);
            }

            content += '<script>require.async(' + feather.util.json(async1) + ',function(PageLet){\
PageLet("' + id + '","' + pageletId + '","' + type + '");\
' + (sameJs.exists() ? 'require.async("' + sameJs.subpath + '")' : '') + '});</script>';
        }else{
            if(sameCss.exists()){
                content += '<link rel="stylesheet href="' + sameCss.subpath + '" type="text/css" />';
            }
        }
    }

    return content;
};