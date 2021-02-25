import request from '@/utils/request'

export default {
  // 添加小结
  addVideo(video) {
    return request({
      url: `/admin/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  // 根据id获取课程章节
  getVideoById(videoId) {
    return request({
      url: `/admin/eduservice/video/getVideo/${videoId}`,
      method: 'get'
    })
  },
  // 修改课程章节
  updateVideo(video) {
    return request({
      url: `/admin/eduservice/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
  // 删除课程章节
  deleteVideo(videoId) {
    return request({
      url: `/admin/eduservice/video/deleteVideo/${videoId}`,
      method: 'delete'
    })
  }
}
