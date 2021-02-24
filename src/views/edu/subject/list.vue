<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;"/>

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
  import api from '@/api/edu/subject.js'

  export default {

    data() {
      return {
        filterText: '',
        data2: [],
        // 默认字段的对应关系
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      // 获取嵌套数据列表
      getNestedTreeList() {
        api.getNestedTreeList().then(response => {
          this.data2 = response.data.items
        })
      }
    },
    created() {
      this.getNestedTreeList()
    }
  }
</script>

