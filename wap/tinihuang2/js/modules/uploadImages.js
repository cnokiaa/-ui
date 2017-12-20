// 拉卡拉照相机调用SDK
var lakala = {
	//调用native 拍照功能
	// 参数 tag 		照片tag,方便get_photo回调中区分
	take_photo: function(tag){		
		var _this = this;	
		window.lkl.take_photo(tag, function(responseData){
			_this.get_photo(responseData.photo_base64,tag,responseData.error);
      	});
	},
	get_photo: function(photo_base64,tag,error){
		//得到base64照片可做进一步处理,比如:
		// photo1 = photo_base64
		if(error && error != "") {
			popup(error);
		} else {
			$(".pic-part").eq(tag).children(".take-photo").children('img').attr("src", "data:image/jpg;base64," + photo_base64).css({
				"display" : "block"
			});
			if(tag == 0) {
				$("#certsecondimgMediaId").val(photo_base64);
			}
			if(tag == 1) {
				$("#certfirstimgMediaId").val(photo_base64);
			}
		}
	}
};
(function() {
	// 如果有错误提示则显示
	if($(".errmsgShow").val() != "" && $(".errmsgShow").length != 0) {
		popup( $(".errmsgShow").val());
	}
	$("#user-name").html(returnNameStr($("#usernameShow").val()));
	$("#idcard-num").html(returnBankCardStr($("#idcardShow").val()));
	function popup(tips) {
		$('.popup-con p').html(tips);
		$('.popup').show();
	}
	function returnBankCardStr(str) {
		return str.substr(0,6) + '******' + str.substr(-4,4);
	}
	function returnNameStr(name) {
		var stars = '';
		for(var i = 1; i < name.length; i++) {
			stars += '*';
		}
		return stars + name.substr(-1,1);
	}
	// 弹窗层取消隐藏
	$(".popup-con").on('touchend', "div",function() {
		$(".popup").hide();
	});
	if($("#certsecondimgMediaId").val() != "") {
		$(".pic-part").eq(0).children("take-photo").children('img').attr("src", "data:image/jpg;base64," + photo2).css({
			"display" : "block"
		});
	}
	if($("#certfirstimgMediaId").val() != "") {
		$(".pic-part").eq(1).children("take-photo").children('img').attr("src", "data:image/jpg;base64," + photo1).css({
			"display" : "block"
		});
	}
	// 错误示例
	$('.tipupload strong').on('touchend', function() {
		$('.main-con').hide();
		$('.wrong-con').show();
	});
	// 关闭错误示例
	$('#top-bar-btn').on('touchend', function() {
		$('.main-con').show();
		$('.wrong-con').hide();
	});
	// 预览照片
	$(".example-pic").on("tap", function(){
		var _index = $(this).parent().index(),
			tips = "",
			tipStr = "";
		switch(_index) {
			case 0:tips="身份证头像照拍摄示例图";tipStr="<p>温馨提示：</p><p>1.拍摄时将身份证正面置于拍摄界面正中。</p><p>2.必须为本人身份证照片，真实有效，且内容清晰可辨。</p>";break;
			case 1:tips="身份证国徽照拍摄示例图";tipStr="<p>温馨提示：</p><p>1.拍摄时将身份证正面置于拍摄界面正中。</p><p>2.必须为本人身份证照片，真实有效，且内容清晰可辨。</p>";break;
		}
		var bigImgSrc = $(this).children("img").attr("big-src");
		$(".show-pic-con h3").html(tips);
		$(".big-img-tips").html(tipStr);
		$(".big-img").children("img").attr("src", bigImgSrc);
		$(".show-pic").show();
	});
	// 关闭预览图
	$('.close-pan').on('touchend', function() {
		$('.show-pic').hide();
	})
	window.onload = function() {
		$(".loading").hide();
		$(".take-photo").on('tap', function(e) {
			var _index = $(this).parent().index();
			console.log(_index)
			lakala.take_photo(_index);
		});
		// 提交
		$(".sub").on("tap", function() {
			if(!$(this).hasClass('disabled')) {
				/*if($("#user-name").val() == '') {
					return popup('请填写真实姓名');
				}
				if($('#idcard-num').val() == "") {
					return popup('请填写身份证号');
				} else if(!Utils.regIdCard($('#idcard-num').val()).check) {
					return popup('请填写正确的身份证');
				}*/
				if($("#certsecondimgMediaId").val() == '') {
					return popup('身份证人脸照还没拍');
				}
				if($("#certfirstimgMediaId").val() == '') {
					return popup('身份证国徽照还没拍');
				}
				$(".sub").addClass("disabled").html("正在上传请稍后...");
				$("form")[0].submit();
			}
		});
	}
})()