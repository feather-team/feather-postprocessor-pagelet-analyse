module.exports = function(content, file, conf){
    if(file.isPageletLike && file.isHtmlLike){
    	var id = file.subpathNoExt.replace(/\//g, '_'), pageletId;
    	var sameCss = feather.file.wrap(file.id.replace(/\.[^\.]+$/, '.css'));
	    var sameJs = feather.file.wrap(file.id.replace(/\.[^\.]+$/, '.js'));

    	var tmp = content.match(/<!--pagelet:((?:(?!-->)[\s\S])+)-->/i);

    	if(tmp){
    		pageletId = tmp[1];

	    	content = '<div id="' + id + '" style="display: none !important;">' + content + '</div>';

	        var async1 = ['/static/js/pagelet.js'];

	        if(sameCss.exists()){
	        	async1.push(sameCss.subpath);
	        }

	        content += '<script>require.async(' + feather.util.json(async1) + ',function(PageLet){\
PageLet("' + id + '","' + pageletId + '");\
' + (sameJs.exists() ? 'require.async("' + sameJs.subpath + '")' : '') + '});</script>';

            file.addRequire('/static/js/pagelet.js');
            file.addRequire(sameCss.id);
    	}else{
            content += '<link rel="stylesheet href="' + sameCss.subpath + '" type="text/css" />';
    		content += '<script>require.async("' + sameJs.subpath + '");</script>';
    	}

        file.addRequire(sameJs.id);
    }

    return content;
};