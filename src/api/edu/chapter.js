import request from '@/utils/request'

export default {
  getNestedTreeList(courseId) {
    return request({
      url: `/admin/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  }
}
