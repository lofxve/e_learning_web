<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num"/>
          <el-option label="学员注册数统计" value="register_num"/>
          <el-option label="课程播放数统计" value="video_view_num"/>
          <el-option label="每日课程数统计" value="course_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="type">
          <el-radio-button label="line"></el-radio-button>
          <el-radio-button label="bar"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询
      </el-button>
    </el-form>
    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%"/>
    </div>
  </div>
</template>

<script>
  // 引入调用
  import echarts from 'echarts'
  import sta from '@/api/edu/sta'

  export default {
    // 写核心代码
    data() {
      return {
        type: 'line',// 图表类型
        searchObj: {
          type: 'login_num',
          begin: this.getNowTime(1),
          end: this.getNowTime(0)
        },
        btnDisabled: false,
        chart: null,
        title: '',
        xData: [],
        yData: []
      }
    },
    methods: {
      showChart() {
        this.initChartData()
        this.setChart()
      },
      // 准备图表数据
      initChartData() {
        sta.showChart(this.searchObj).then(response => {
          // 数据
          this.yData = response.data.dataList

          // 横轴时间
          this.xData = response.data.dateList

          // 当前统计类别
          switch (this.searchObj.type) {
            case 'register_num':
              this.title = '学员注册数统计'
              break
            case 'login_num':
              this.title = '学员登录数统计'
              break
            case 'video_view_num':
              this.title = '课程播放数统计'
              break
            case 'course_num':
              this.title = '每日课程数统计'
              break
          }
          this.setChart()
        })
      },
      // 设置图标参数
      setChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('chart'))
        // console.log(this.chart)

        // 指定图表的配置项和数据
        var option = {
          // 标题
          title: {
            text: this.title
          },
          // x轴触发
          tooltip: {
            trigger: 'axis'
          },
          // x轴是类目轴（离散数据）,必须通过data设置类目数据
          xAxis: {
            type: 'category',
            data: this.xData
          },
          // y轴是数据轴（连续数据）
          yAxis: {
            type: 'value'
          },
          // 系列列表。每个系列通过 type 决定自己的图表类型
          series: [{
            // 系列中的数据内容数组
            data: this.yData,
            // 折线图
            type: this.type
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff'
            },
            borderColor: '#90979c'
          },
            {
              type: 'inside',
              show: true,
              height: 15,
              start: 1,
              end: 35
            }]
        }
        this.chart.setOption(option)
      },
      //处理默认选中当前日期
      getNowTime(mon) {
        var now = new Date()
        var year = now.getFullYear() //得到年份
        var month = now.getMonth() //得到月份
        var date = now.getDate() //得到日期
        var hour = ' 00:00:00' //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
        month = month + 1
        month = month.toString().padStart(2, '0')
        date = date.toString().padStart(2, '0')
        var defaultDate = `${year}-${month - mon}-${date}`
        // console.log(defaultDate)
        return defaultDate
        this.$set(this.info, 'stockDate', defaultDate)
      }
    },
    created() {
    }
  }
</script>
