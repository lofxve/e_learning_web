import request from '@/utils/request'

const api_name = '/admin/eduvod/video'

export default {
  removeById(id) {
    return request({
      url: `${api_name}/deleteVideo/${id}`,
      method: 'delete'
    })
  }
}
