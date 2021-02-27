<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-button type="text" @click="openDialogChapterForm">添加章节</el-button>
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDialogChapterForm">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/admin/eduvod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import chapter from '@/api/edu/chapter.js'
  import video from '@/api/edu/video.js'
  import vod from '@/api/edu/vod.js'

  export default {
    data() {
      return {
        //=============================================小结=====================================================
        saveVideoBtnDisabled: true, // 视频确定按钮
        dialogVideoFormVisible: false, // 是否显示课时表单
        chapterId: '', // 课时所在的章节id
        video: {// 课时对象
          title: '',
          sort: 0,
          free: 0,
          videoSourceId: '',
          videoOriginalName: ''
        },
        fileList: [],//上传文件列表
        BASE_API: process.env.BASE_API, // 接口API地址
        //=============================================章节=====================================================
        dialogChapterFormVisible: false,// 添加和修改章节表单是否显示
        chapter: {
          title: '',
          sort: 0
        },// 章节
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseId: '', // 所属课程
        chapterNestedList: []// 章节嵌套课时列表

      }
    },
    created() {
      this.init()
    },
    methods: {
//=============================================小结操作=====================================================
      //成功回调
      handleVodUploadSuccess(response, file, fileList) {
        this.$message({
          type: 'success',
          message: '视频上传成功'
        })
        // 提交按钮
        this.saveVideoBtnDisabled = false
        // 视频id
        this.video.videoSourceId = response.data.videoId
        // 视频名称
        this.video.videoOriginalName = file.name
      },
      // 视图上传多于一个视频
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
      // 点击x的时候调用
      beforeVodRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      // 点击确定的时候调用
      handleVodRemove(file, fileList) {
        this.removeById()
      },
      // 删除方法
      removeById() {
        // todo 删除待优化
        vod.removeById(this.video.videoSourceId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.fileList = []
          // 视频id
          this.video.videoSourceId = ''
          // 视频名称
          this.video.videoOriginalName = ''
        })
      },
      // 添加小结弹框
      openVideo(chapterId) {
        // 弹出弹框
        this.dialogVideoFormVisible = true
        this.chapterId = chapterId
        // 刷新列表
        this.getNestedTreeList(this.courseId)
        // 重置
        this.video.title = ''
        this.video.videoSourceId = ''
        this.video.sort = 0
        this.video.free = 0
        this.fileList = []
      },
      // 添加或者修改小结
      saveOrUpdateVideo() {
        this.saveVideoBtnDisabled = true
        if (this.video.id) {
          // 修改
          this.updateVideo()
        } else {
          // 添加
          this.addVideo()
        }
      },
      addVideo() {
        this.video.chapterId = this.chapterId
        this.video.courseId = this.courseId
        video.addVideo(this.video).then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加课时成功!'
          })
          // 刷新页面
          this.getNestedTreeList(this.courseId)
        })
      },
      updateVideo() {
        video.updateVideo(this.video).then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改课时成功!'
          })
          // 刷新页面
          this.getNestedTreeList(this.courseId)
        })
      },
      openEditVideo(videoId) {
        // 弹框
        this.dialogVideoFormVisible = true
        // 获取章节信息
        this.getVideoById(videoId)
      },
      getVideoById(videoId) {
        video.getVideoById(videoId).then(response => {
          this.video = response.data.items
        })
      },
      deleteVideo(videoId) {
        // 提示框
        this.$confirm('此操作将永久删除此记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 点击确定后删除
          video.deleteVideo(videoId)
            .then((response) => {
              if (response.code == 20000) {
                // 提示成功
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                // 刷新页面
                this.getNestedTreeList(this.courseId)
              }
            })
        })
      },
//=============================================章节操作=====================================================
      // 初始化
      init() {
        // 获取路由中的参数
        if (this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id
          this.getNestedTreeList(this.courseId)
        }
      },
      // openDialogChapterForm
      openDialogChapterForm() {
        this.dialogChapterFormVisible = true// 如果保存成功则关闭对话框
        this.getNestedTreeList(this.courseId)// 刷新列表
        this.chapter.title = ''// 重置章节标题
        this.chapter.sort = 0// 重置章节标题
      },
      // 添加或者修改章节
      saveOrUpdate() {
        if (this.chapter.id) {
          // 修改
          this.updateChapter()
        } else {
          // 添加
          this.addChapter()
        }
      },
      // 添加章节
      addChapter() {
        // 设置课程id
        this.chapter.courseId = this.courseId
        chapter.addChapter(this.chapter).then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          // 刷新页面
          this.getNestedTreeList(this.courseId)
        })
      },
      // 修改章节
      updateChapter() {
        chapter.updateChapter(this.chapter).then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          // 刷新页面
          this.getNestedTreeList(this.courseId)
        })
      },
      // 打开编辑修改
      openEditChapter(id) {
        // 弹框
        this.dialogChapterFormVisible = true
        // 获取章节信息
        this.getChapterById(id)
      },
      // 根据id获取
      getChapterById(chapterId) {
        chapter.getChapterById(chapterId).then(response => {
          this.chapter = response.data.items
        })
      },
      // 删除章节
      deleteChapter(chapterId) {
        // 提示框
        this.$confirm('此操作将永久删除此记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 点击确定后删除
          chapter.deleteChapter(chapterId)
            .then((response) => {
              if (response.code == 20000) {
                // 提示成功
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                // 刷新页面
                this.getNestedTreeList(this.courseId)
              }
            })
        })
      },
      // 根据课程id查询章节和小结
      getNestedTreeList(courseId) {
        chapter.getNestedTreeList(courseId).then(response => {
          this.chapterNestedList = response.data.items
        })
      },
      // 上一页
      previous() {
        this.$router.push({ path: '/edu/course/info/' + this.courseId })
      },
      // 下一页
      next() {
        this.$router.push({ path: '/edu/course/publish/' + this.courseId })
      }
    }
  }
</script>
<style scoped>
  .chanpterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chanpterList li {
    position: relative;
  }

  .chanpterList p {
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList {
    padding-left: 50px;
  }

  .videoList p {
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
