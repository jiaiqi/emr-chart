import Vue from 'vue'
import moment from 'moment'

function data_util() {
	// 柱状图或折线图获取横轴/维度
	Vue.prototype.getXaxis = function(timeType = 'day') {
		let Xaxis = []
		if (timeType === 'day') {
			let hours = []
			for (let i = 1; i <= 24; i++) {
				hours.push(
					moment()
						.subtract(23 - i, 'hours')
						.format('HH')
				)
			}
			Xaxis = hours
		} else if (timeType === 'week') {
			let week = []
			for (let i = 1; i < 8; i++) {
				week.push(
					moment()
						.subtract(7 - i, 'days')
						.format('YYYY-MM-DD')
				)
			}
			Xaxis = week
		} else if (timeType === 'month') {
			let days = []
			for (let i = 1; i < 31; i++) {
				days.push(
					moment()
						.subtract(30 - i, 'days')
						.format('YYYY-MM-DD')
				)
			}
			Xaxis = days
		} else if (timeType === 'year') {
			let month = []
			for (let i = 1; i <= 12; i++) {
				month.push(
					moment()
						.subtract(12 - i, 'month')
						.format('YYYY-MM')
				)
			}
			Xaxis = month
		}
		return Xaxis
	}
	// 获取v-chart的指标
	Vue.prototype.getCols = function(datas, colName) {
		let types = datas.map(item => item[colName])
		types = Array.from(new Set(types))
		return types
	}
	// function test(datas) {
	// 	let arr = []
	// 	let ObjArr = []
	// 	datas.map(data => {
	// 		if (arr.indexOf(data.typename) == -1) {
	// 			arr.push(data.typename)
	// 			ObjArr.push(data)
	// 		}
	// 	})
	// }
	// 获取chart的columns---多指标+单维度组成的数组
	Vue.prototype.getColumns = function(dimension, index) {
		let columns = []
		columns.concat(dimension)
		columns.concat(index)
		return columns
	}
	//验证输入特殊字符
Vue.prototype.xssFilter = function(text){//xss攻击特殊字符过滤
    if(text){
      let arr = []
      arr=["alert","eval","<script>","</script>","onblur","onload","onfocus","onerror","onclick","onMouseOver","onMouseOut","onSelect","onChange","onSubmit","<iframe>","</iframe>","<img>","</img>","<video>","</video>",
           "<canvas>","</canvas>","document","javascript","sessionStorage","localStorage","cookie"];
      let isOk = ["location"]
      let host = window.location.host
      let isLen = []
      arr.forEach(function(value,index){
        if(text.indexOf(value)!==-1){
          isLen.push(false)
        }
      });
      isOk.forEach(function(value,index){
        if(text.indexOf(value)!==-1){
          if(text.indexOf(host)===-1){
            isLen.push(false)
          }
        }
      })
  
      if(isLen.length === 0){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
    
	}
	Vue.prototype.getRowsItem = function(data) {}
	// 将原始数据组装成v-charts需要的数据
	Vue.prototype.handleChartData = function(
		timeType,
		data,
		chartType,
		dataType
	) {
		let Xaxis = this.getXaxis
		if (timeType !== '') {
			this.getXaxis(timeType)
			Xaxis.map(hour => {})
		} else {
		}
	}
}

export default data_util
