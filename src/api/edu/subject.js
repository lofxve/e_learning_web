import request from '@/utils/request'
export default {
  // 获取嵌套数据列表
  getNestedTreeList() {
    return request({
      url: `/admin/eduservice/subject/nestedList`,
      method: 'get'
    })
  }
}
