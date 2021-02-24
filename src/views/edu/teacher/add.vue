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

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/admin/eduoss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from '@/api/edu/teacher.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    components: { ImageCropper, PanThumb },
    data() {
      return {
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: "https://e-learning-lofxve.oss-cn-beijing.aliyuncs.com/ff5382f902e7257cddc4461a10c9c46.jpg"
        },
        saveBtnDisabled: false, // 保存按钮是否禁用,

        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0 // 上传组件id
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
      // 上传成功后的回调函数
      cropSuccess(data) {
        console.log(data)
        this.imagecropperShow = false
        this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },

      // 关闭上传组件
      close() {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }
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
