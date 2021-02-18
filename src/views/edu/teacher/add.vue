<template>

  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from '@/api/teacher/teacher.js'

  export default {
    data() {
      return {
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: ''
        },
        saveBtnDisabled: false // 保存按钮是否禁用,
      }
    },
    methods: {
      // 初始化
      init() {
        // 获取路由中的参数
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          // 查询教师回写
          this.getTeacherById(id)
        } else {
          // 清空表单
          this.teacher = {}
        }
      },
      // 根据id查询老师
      getTeacherById(id) {
        api.getTeacherById(id).then(response => {
          this.teacher = response.data.teacher
        })
      },
      // 保存或者修改
      saveOrUpdate() {
        if (this.teacher.id) {
          this.updateTeacher()
        } else {
          this.saveTeacher()
        }
      },
      // 修改
      updateTeacher() {
        api.updateTeacher(this.teacher).then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 回到列表页面，路由跳转
          this.$router.push({ path: '/edu/teacher/table' })
        })
      },
      // 保存
      saveTeacher() {
        api.save(this.teacher).then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 回到列表页面，路由跳转
          this.$router.push({ path: '/edu/teacher/table' })
        })
      },
    },
    watch: {
      // 监听路由变化
      $route(to, from) {
        // console.log('watch $route')
        this.init()
      }
    },
    created() {
      // console.log('created')
      this.init()
    }
  }
</script>
