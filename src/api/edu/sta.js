import request from '@/utils/request'

export default {
  // 生成统计数据
  countRegister(day) {
    return request({
      url: `/admin/staservice/daily/countRegister/${day}`,
      method: 'post'
    })
  },
  // 数据显示
  showChart(searchObj) {
    return request({
      url: `/admin/staservice/daily/chartShowsDay/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
      method: 'get'
    })
  }
}
