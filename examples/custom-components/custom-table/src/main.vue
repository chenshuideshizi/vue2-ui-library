<template>
  <div style="padding-bottom: 20px;">
    <el-table
      v-loading="loading"
      class="common-table"
      :data="tableData"
      :inline="inline"
      style="width: 100%"
      :class="{'common-table-normal': size === 'normal'}"
      :row-class-name="rowClassName || defaultTableRowClassName"
      v-bind="$attrs"
      v-on="$listeners"
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <template v-for="(item, index) in columns">
        <slot v-if="item.slot" :name="item.slot" />
        <el-table-column
          v-else-if="!item.children"
          :key="index"
          :type="item.type"
          :prop="item.prop"
          :sortable="item.sortable"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
        />

        <el-table-column v-else :key="index" :label="item.label">
          <el-table-column
            v-for="(childItem, childIndex) in item.children"
            :key="'child' + childIndex"
            :prop="childItem.prop"
            :label="childItem.label"
            :width="childItem.width"
            :min-width="childItem.minWidth"
            :formatter="childItem.formatter"
          />
        </el-table-column>

      </template>
      <template slot="empty">
        <slot name="empty" />
      </template>
    </el-table>
    <el-pagination
      style="margin: 19px 0 0"
      class="common-pagination"
      :current-page="pagination.currentPage"
      :page-sizes="[pagination.pageSize]"
      :page-size="pagination.pageSize"
      layout="slot, prev, pager, next"
      :total="pagination.total"
      :hide-on-single-page="true"
      @current-change="handleCurrentChange"
    >
      <div v-show="totalPage > 1" class="el-pagination-jump">
        <div>第</div>
        <div class="el-pagination-editor">
          <input v-model="currentPageTemp" autocomplete="off" class="el-input-inner">
        </div>
        页/共{{ totalPage }}页
        <div
          class="jumperBtn"
          @click="jumpToPage"
        >跳转</div>
      </div>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'CustomTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: ''
    },
    rowClassName: {
      type: Function,
      required: false,
      default: null
    },
    inline: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPageTemp: 1 // 缓存要跳转的页面
    }
  },
  computed: {
    totalPage() {
      if (this.pagination.total && this.pagination.pageSize) {
        return Math.ceil(this.pagination.total / this.pagination.pageSize)
      }
      return 0
    }
  },
  watch: {
    'pagination.currentPage': function(newVal) {
      this.currentPageTemp = newVal
    }
  },
  methods: {
    defaultTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'even-row'
      }
      return ''
    },
    // 跳转到指定的页面
    jumpToPage() {
      if (Number(this.currentPageTemp) > this.totalPage) {
        this.currentPageTemp = this.totalPage
      }
      if (isNaN(Number(this.currentPageTemp))) {
        this.currentPageTemp = 1
      }

      this.$emit('currentPageChange', Number(this.currentPageTemp))
    },
    handleCurrentChange(val) {
      this.$emit('currentPageChange', val)
    },
    handleMouseEnter(...params) {
      this.$emit('cellMouseEnter', ...params)
    },
    handleMouseLeave(e) {
      this.$emit('cellMouseLeave', e)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
.common-table {
  &.el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent!important;
  }
  &.el-table {
    background: none;
    color: #fff;
    th, td {
      height: 40px;
      padding: 0 10px;
      .cell {
        font-size: 14px;
      }
    }

    .sort-caret.ascending {
      width: 10px;
      height: 10px;
      border-bottom: none;
    }

    .sort-caret.descending {
      width: 10px;
      height: 10px;
      border-top: none;
    }
  }

  &.el-table--group::after, &.el-table--border::after, &.el-table::before {
      background-color: transparent;
  }

  &.el-table thead {
    color: #fff;
    background: rgba(70, 217, 253, .25);
  }
  &.el-table thead.is-group th {
    background: none;
    border: none;
  }
  &.el-table th {
    background: none;
  }
  &.el-table tr {
    background: none;
    &.even-row {
      background: rgba(70, 217, 253, .1);
    }
    &:hover {
      background-color: #0e2b33;
    }
  }
  &.el-table--border {
    border: none;
  }
}
.common-pagination {
  display: flex;
  justify-content: flex-end;
  &.el-pagination .el-pager .number {
    padding: 0 10px;
    width: auto;
  }
}
</style>
