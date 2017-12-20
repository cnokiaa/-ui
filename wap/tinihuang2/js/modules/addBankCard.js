define([
'zepto',
'class',
'utils',
'IScroll',
'touch',
'fx',
'fx_methods',
], function($,Class,Utils,IScroll) {
	var AddBank = Class.create({
		// 初始化
		initialize : function() {
			var _this = this;
			// 如果有错误提示则显示
			if($(".errmsgShow").val() != "" && $(".errmsgShow").length != 0) {
				this.popup($(".errmsgShow").val());
			}
			// 初始化事件
			this.initEvent();
			// 滚动组件
			this.myScroll = null;
			this.historyScroll = null;
			// 请求单列表数据，并给所有的单列表绑定相应的事件得到列表内容
			$(".single-list").each(function() {
				var targetId = $(this).attr("id");
				targetId = "#" + targetId;
				_this.aloneList(targetId);
			});
			// 查询银行卡历史记录
			this.lookHistory();
		},
		// 弹窗提示
		popup : function(p,type) {
			$(".popup").removeClass('popup-type2');
			if(type == 2) {
				$(".popup").addClass('popup-type2');
			}
			$(".popup p").html(p);
			$(".popup").show();
		},
		// 初始相关事件
		initEvent : function() {
			var _this = this;
			// 禁止输入法go和“前往”强制提交
			$("input").on("keydown", function() {
				var keyCode = event.keyCode|| event.which;
				if(keyCode == 13) {
					return false;
				}
			});
			// 复选框选择
			$(".agreement").on("tap", 'i',function() {
				$(this).parent().toggleClass("disagree");
			});
			// 弹窗取消关闭弹窗
			$(".popup .popup-con").on("touchend", "div", function() {
				if(!$('.popup').hasClass('popup-type2')) {
					$(".popup").hide();
				}
			});
			$(".popup-con").on("touchend", "b", function() {
				$(".popup").hide();
			});
			// 额度不足确定
			$(".popup-con").on("touchend", "strong", function() {
				window.location.href = '';
			});
			$(".popup,.banklist").on("touchstart",function(e) {
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
			});
			// 点击列表
			$(".iscroll").on("tap", "li", function() {
				var controlTarget = $(".iscroll").data("nowControl");
				var preTarget = $(controlTarget).siblings("input");
				if(preTarget.length != 0) {
					preTarget.val($(this).text())
				}
				$(controlTarget).val($(this).attr("data-sub")).siblings(".cover-input").html($(this).text()).addClass("cover");
				$(".iscroll").fadeOut();
			});
			$(".iscroll").on("tap", function(e) {
				if($(e.target).hasClass("iscroll") == true) {
					$(".iscroll").fadeOut();
				}
			});
			/*$(".agreement").on("tap", function() {
				setTimeout(function() {
					$(".agreement-list").show();
				}, 200);
			});
			$(".agreement-list").on("tap", function(e) {
				if($(e.target).hasClass("agreement-list") == true) {
					$(".agreement-list").fadeOut();
				}
			});*/
			this.subData();
		},
		// 历史记录查询
		lookHistory : function() {
			var _this = this;
			$(".his-pan").on("tap", "li", function() {
				$(this).addClass("chosed").siblings().removeClass("chosed");
			})
			$(".subbank").on("tap", "h2 span", function() {
				_this.getHistoryList();
			});
			// 取消功能
			$(".banklist-btn").on("touchend", "span", function() {
				$(".banklist").hide();
			});
			// 确定功能
			$(".banklist-btn").on("touchend", "em", function() {
				var t = $("#bank-his .chosed"),
					c = t.attr("data-code"),
					n = t.attr("data-n"),
					num = t.attr("data-c");
				if(t.length != 0) {
					$(".banklist").hide();
					$("#debitbank").val(c).siblings(".cover-input").html(n).addClass("cover");
					$("#bankcardnum").val(num);
				} else {
					$(".banklist").hide();
					_this.popup('请选择银行卡！');
				}
			});
		},
		// 请求并初始化历史记录表
		getHistoryList : function() {
			var _this = this;
			var certNo = $('#certNo').val();
			$.ajax({
			    type : "POST",
			    url : "hdw/application/history/bankCard",
			    data : JSON.stringify({certNo : certNo}),
			    contentType: "application/json",
				dataType : "json",
				success : function(data) {
					if(data.status == "success") {
						var list = data.data.banks,str = "";
						if(list.length != 0) {
							for(var i = 0; i < list.length; i++) {
								str += '<li data-code="'+ list[i].bankcode +'" data-n="' + list[i].bankname  + '" data-c="' + list[i].bankcard + '"><p>' + list[i].bankname + '（' + Utils.parseToStarNumber(list[i].bankcard) + '）</p><span></span></li>'
							}
							$("#bank-his ul").html(str);
							$(".banklist").show();
							if(_this.historyScroll) {
								_this.historyScroll.refresh();
							} else {
								_this.historyScroll = new IScroll('#banlpan');
							}
						} else {
							_this.popup("暂无可用银行卡");
						}
					} else {
						_this.popup(data.errmsg);
					}
				},
				error : function() {
					_this.popup("请求数据失败");
				}
			})
		},
		// 单列表
		aloneList : function(targetId) {
			var _this = this;
			// 单列表回显内容样式控制
			var preTarget = $(targetId).siblings("input");
			var preVal = preTarget.val();
			if(preVal != "" && preTarget.length != 0) {
				$(targetId).siblings(".cover-input").html(preVal).addClass("cover");
			}

			$(targetId).siblings(".cover-input").on("tap", function() {
				$.get("universal/application/query/debitBankList", function(data) {
					if(data.status == "success") {
						$("input").blur();
						$(".iscroll").data("nowControl", targetId);
						var data = data.data;
						var dataArr = [];
						for(key in data) {
							dataArr = data[key];
						}
						// 获取列表项内的Key
						var dataInfoKey = [];
						for(var key in dataArr[0]) {
							dataInfoKey.push(key);
						}
						var dataId = "";
						var dataCn = "";
						for(var i = 0; i < dataInfoKey.length; i++) {
							if(dataInfoKey[i].match(/.*(code|id)$/gi) != null) {
								dataId = dataInfoKey[i];
							}
							if(dataInfoKey[i].match(/.*(name|cn)$/gi) != null) {
								dataCn = dataInfoKey[i];
							}
						}
						var str = "";
						for(var i = 0; i < dataArr.length; i++) {
							str += '<li data-sub="' + dataArr[i][dataId] + '">' + dataArr[i][dataCn] + '</li>';
						}
						$("#scroller ul").html(str);
						// 组件出现
						$(".iscroll").show();
						if(_this.myScroll) {
							_this.myScroll.refresh();
						} else {
							_this.myScroll = new IScroll('#wrapper');
						}
					}
				}, "json")
			})
		},
		// 提交
		subData : function() {
			var _this = this;
			// 如果信息完整才能提交
			$(".next-step").on("tap", function() {
				if($("#creditbank").val() == "" || $("#creditbank").siblings('input').val() == '') {
					return _this.popup("请选择信用卡银行");
				}
				if($("#debitbank").val() == "" || $("#debitbank").siblings('input').val() == '') {
					return _this.popup("请选择储蓄卡银行");
				}
				if($("#creditcardnum").val() == "") {
					return _this.popup("请输入信用卡卡号");
				}
				if($("#bankcardnum").val() == "") {
					return _this.popup("请输入储蓄卡卡号");
				}
				if($(".agreement").eq(0).hasClass('disagree')) {
					return _this.popup("请阅读并同意《个人征信查询及报送授权声明》");
				}
				if($(".agreement").eq(1).hasClass('disagree')) {
					return _this.popup("请阅读并同意《拉卡拉信贷还款委托服务协议》");
				}
				if(!$(this).hasClass("disabled")) {
					$(this).addClass("disabled").html("正在提交，请稍等...");
					setTimeout(function() {
						$("form")[0].submit();
					},100);
				}
			})
		}
	});
	return AddBank;
})