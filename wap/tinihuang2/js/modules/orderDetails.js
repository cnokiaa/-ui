define([
'zepto',
'class',
'doT'
], function($,Class,doT) {
	var OrderDetails = Class.create({
		// 初始化
		initialize : function() {
			// 模块组件方法扩展
			$.fn.template = function(data) {
				if(this.attr("type") == "text/x-dot-template") {
					var scource = this.text();
					var template = doT.template(scource);
					var result = template(data);
					return result;
				} else {
					return "error";
				}
			}
			this.tplType = $("#contractstatus").val();
			this.tplType = 1;
			this.init();
			this.initTpl(this.data, this.tplType);		
		},
		// 初始化数据
		init : function() {
			this.data = {
				// 合同号
				contractno : $("#contractno").val(),
				// 业务名称
				businesstype : $("#businesstype").val(),
				// 借款日期
				applydate : this.turnTime($("#applydate").val()),
				// 申请金额
				applyamt : $("#applyamt").val(),
				//借款金额
				loan:$("#loan").val(),
				// 借款周期
				period : $("#period").val(),
				// 还款储蓄卡
				debitcard : this.returnBankCardStr($("#debitcard").val()),
				//放款信用卡
				loancard: this.returnBankCardStr($("#loancard").val()),
				// 放款日期
				loantime : this.turnTime($("#loantime").val()),
				// 结案日期
				endtime : this.turnTime($("#endtime").val()),
				// 待还款金额
				unsettled : $("#unsettled").val(),
				// 逾期日期
				yqDate : this.turnTime($("#yqDate").val()),
				// 逾期金额
				yqMoney : $("#yqMoney").val(),
				// 本期期数
				currentperiod : $("#currentperiod").val(),
				// 实际还款总金额
				repcountamt : $("#repcountamt").val(),
				// 本期还款日
				currentDate : this.turnTime($("#currentDate").val()),
				// 本期待还款
				currentAmt : $("#currentAmt").val(),
				// 本期已还款
				currentPay : $('#currentPay').val(),
				// 补件类型
				bujianType : $('#bujian').val(),
				//一次性服务费
				onemoney:$('#onemoney').val(),
				//红包抵扣金额
				freemoney:$('#freemoney').val(),
				//到账金额
				account:$('#account').val()
			}
		},
		// 初始化模板
		initTpl : function(data,type) {
			// 审核中
			var str1 = $("#tpl1").template(data);
			// 放款失败
			var str2 = $("#tpl2").template(data);
			// 待还款
			var str3 = $("#tpl3").template(data);
			// 已结案
			var str4 = $("#tpl4").template(data);
			// 已逾期
			var str5 = $("#tpl5").template(data);
			// 审核失败
			var str6 = $("#tpl6").template(data);
			if(type == 1) {
				$(".btn-part").hide();
				$(".wrap").html(str1);
			}
			if(type == 2) {
				$(".btn-part").hide();
				$(".wrap").html(str2);
			}
			if(type == 3) {
				$(".wrap").html(str3);
				$(".btn-part").show();
			}
			if(type == 4) {
				$(".btn-part").hide();
				$(".wrap").html(str4);
			}
			if(type == 5) {
				$(".wrap").html(str5);
				$(".btn-part").show();
			}
			if(type == 6 || type == 9) {
				$(".btn-part").hide();
				$(".wrap").html(str6);
			}
		},
		// 时间格式转换
		turnTime : function(time) {
			var timeStr = time;
			if(time.length >= 8) {
				if(timeStr.match(/^\d{8}/gi)) {
					timeStr = timeStr.match(/^\d{8}/gi)[0];
					var year = timeStr.slice(0,4);
					var month = timeStr.slice(4,6);
					var day = timeStr.slice(6,8);
					timeStr = year + "-" + month + "-" + day;
				}
			}
			return timeStr;
		},
		// 返回脱敏字符串
		returnBankCardStr : function(str) {
			return str.substr(0,6) + '******' + str.substr(-4,4);
		},
	});
	return OrderDetails;
});