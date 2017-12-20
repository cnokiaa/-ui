$('#J_mask').on('singleTap',function(){
	$(".filter-item").removeClass("current");
	$('.filter-ul').removeClass('active');
	$('#J_filterPopover').hide();
	$(this).hide();
});
/**tab切换**/
$.fn.tabs = function(option){
	var defaul = $.extend({
        active:'active',
       	mine:'',
       	other:false
    },option);
    this.singleTap(function(){
    	if(defaul.other){
    		if($(this).hasClass(defaul.active)){
    			$(this).removeClass(defaul.active).parent().removeClass("active");
    			$('#J_filterPopover,#J_mask').hide();
    		} else {
    			$('#J_filterPopover').show();
    			$('#J_mask').show();
    			$(this).addClass(defaul.active).siblings().removeClass(defaul.active);
    			$(this).parent().addClass("active");
    			$(defaul.mine).eq($(this).index()).show().siblings().hide();
    		}
    	} else {
    		$(this).addClass(defaul.active).siblings().removeClass(defaul.active);
    		$(defaul.mine).eq($(this).index()).show().siblings().hide();
    	}
    });
}
$(".filter-item").tabs({mine:'#J_filterPopover .filter-cont',active:'current',other:true});
$(".option-list-1st li").tabs({mine:'.option-list-2nd ul',active:'current'});