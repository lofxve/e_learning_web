import request from '@/utils/request'

// 分页查询，根据id查询，新增，删除，修改
// 列表页（查询，列表，分页）方法（分页查询，删除）
// 详情页 （表单） 方法（初始化，根据id查询，保存或者修改，保存，修改）

export default {
  // 讲师列表
  getTeacherByPage(page, limit, teacherQuery) {
    return request({
      url: `/admin/eduservice/teacher/teachers/${page}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },

  // 添加讲师
  save(teacher) {
    return request({
      url: `/admin/eduservice/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },

  // 删除讲师
  removeById(id) {
    return request({
      url: `/admin/eduservice/teacher/${id}`,
      method: 'delete'
    })
  },

  // 根据id查询老师
  getTeacherById(id) {
    return request({
      url: `/admin/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  // 根据id修改
  updateTeacher(teacher) {
    return request({
      url: `/admin/eduservice/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 获取所有老师
  getList() {
    return request({
      url: `/admin/eduservice/teacher/findAll`,
      method: 'get'
    })
  }
}
