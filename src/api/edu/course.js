import request from '@/utils/request'

export default {
  // 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/admin/eduservice/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 获取课程信息
  getCourseInfo(courseId) {
    return request({
      url: `/admin/eduservice/course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/admin/eduservice/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  }
}
