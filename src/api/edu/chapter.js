import request from '@/utils/request'

export default {
  // 获取所有章节小节
  getNestedTreeList(courseId) {
    return request({
      url: `/admin/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `/admin/eduservice/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 根据id获取课程章节
  getChapterById(chapterId) {
    return request({
      url: `/admin/eduservice/chapter/getChapter/${chapterId}`,
      method: 'get'
    })
  },
  // 修改课程章节
  updateChapter(chapter) {
    return request({
      url: `/admin/eduservice/chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除课程章节
  deleteChapter(chapterId) {
    return request({
      url: `/admin/eduservice/chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }
}
