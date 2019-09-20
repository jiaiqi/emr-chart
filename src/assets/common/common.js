/**
 * 全局v-chart数据构造类
 */
export class vChartInfo {
    constructor(){
        this.data = {
            "columns": [],
            "rows": []
        }
        this.colArrData = 
        this.getColumns = ()=>{
            let arr = []
            arr.push()
        }
        this.dataType = true
        this.getChartColumns = (data,dimName) =>{
            this.resData = data
            let colsData = {}
            let arr =[]
            for(let i=0;i<dimName.length;i++){
                let col = dimName[i]
                let dimNameArr = data.map((item)=>{return item[col]})
                dimNameArr = Array.from(new Set(dimNameArr))
                colsData[dimName[i]] = dimNameArr
            }
            arr.push(dimName[0])
            arr = arr.concat(colsData[dimName[dimName.length - 1]])
            //   返回 维度和指标的集合
            this.columns = {}
            this.columns['arrs'] = colsData
            this.columns['columns'] = arr
            return this.columns
        }
        this.getChart = (colArr,countCol,chartType,dataType)=>{
            let datas = this.resData
            let timeArr = this.columns[colArr[0]]
            let dataMap = this.columns[colArr[1]]
            if(dataType){
                this.dataType = false
            }else{
                this.dataType = true
            }
            let datasType = dataType ?  this.columns[dataType] : ['all']
            let vChartType = chartType || 'line'
            let arr = []
            let allChartData = {
    
            }
            let cols = e.map((item)=>{
                // if(item.hasOwnProperty(dimName)){
    
                // }
                return  ''
            })
            
                for (let i = 0; i < datasType.length; i++) {
                    allChartData[datasType[i]] = {}
                    // allChartData[datasType[i]].columns = ['时间', "门诊", "住院"]
                    allChartData[datasType[i]].columns = this.columns.columns
                    allChartData[datasType[i]].rows = []
                    for (let j = 0; j < timeArr.length; j++) {
                        let itemData = {}
                        for (let n = 0; n < dataMap.length; n++) {
                            if(datasType[0] === 'all'){
                                itemData[cmdType[n]] = this.getDataCount(datasType[i], timeArr[j], cmdType[n], datas, 'line')
                            }
                            
                            // itemData['时间'] = timeArr[j] + "点"
                            itemData['时间'] = timeArr[j]
                        }
                        // allChartData[datasType[i]].rows.push(itemData)
                        if (itemData && itemData.门诊) {
                            allChartData[datasType[i]].rows.push(itemData)
                        }
                    }
                }
            // if (type === 'day') {
                
            // } else if (type === 'week' || type === 'month' || type === 'year') {
            // for (let i = 0; i < datasType.length; i++) {
            //     allChartData[datasType[i]] = {}
            //     allChartData[datasType[i]].columns = ['时间', "门诊", "住院"]
            //     allChartData[datasType[i]].rows = []
            //     for (let j = 0; j < ywfssjTime.length; j++) {
            //     let itemLineData = {}
            //     let itemPieData = {}
            //     for (let n = 0; n < cmdType.length; n++) {
            //         itemLineData[cmdType[n]] = getDataCount(datasType[i], ywfssjTime[j], cmdType[n], datas, 'line')
            //         itemLineData['时间'] = ywfssjTime[j]
            //     }
            //     if (itemLineData) {
            //         allChartData[datasType[i]].rows.push(itemLineData)
            //     }
            //     }
            // }
            // }
        }
        this.getDataCount = (yljgmcName, time, type, data, chartType) => {
            let count = 0
            if (chartType === 'line') {

                for (let i = 0; i < data.length; i++) {
                if (data[i].yljgmc === yljgmcName && data[i].ywfssj == time && data[i].cmd === type)
                    count += data[i].create_time
                }
            } else if (chartType === 'pie') {
                for (let i = 0; i < data.length; i++) {
                if (data[i].yljgmc === yljgmcName && data[i].card_type === type) {
                    count += data[i].create_time
                }
                }
            } else if (chartType === 'pieb') {

                for (let i = 0; i < data.length; i++) {
                if (data[i].card_type === type)
                    count += data[i].create_time
                }
            }
            return count
        }
    }
}
// export default {
//     vChartInfo
// }




