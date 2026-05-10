<template>
  <div class="common-layout" v-loading="loading">
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="route.path === '/' ? '/workspaceList' : route.path" router>
          <el-menu-item index="/workspaceList" @click="handleMenuClick('/workspaceList')">ワークスペース一覧 </el-menu-item>
          <el-menu-item index="/dbSetting" @click="handleMenuClick('/dbSetting')">読み替え表 </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container style="height: calc(100vh - 0px);">
        <el-scrollbar style="width: 100%">
          <el-main style="width: 100%">
            <el-row :span="24" :gutter="20" class="controller-bar">
              <el-col :span="3">
                <el-button type="primary" @click="openAddModal">
                  <span style="vertical-align: middle">読み替え表の登録</span>
                </el-button>
              </el-col>
            </el-row>

            <el-table ref="dbSettingTable" :data="processedData" @selection-change="selectionChange"
              @sort-change="sortChange" stripe border max-height="460" style="width: 100%">
              <el-table-column label="名前" prop="dbName" sortable></el-table-column>
              <el-table-column label="行数" prop="formartLineCount" sortable />
              <el-table-column label="サイズ(MB)" prop="formatedCsvSize" sortable />
              <el-table-column label="作成日時" prop="formatLastUpdateDate" sortable />
              <el-table-column align="center" label="操作" fixed="right" width="300">
                <template #default="scope">
                  <el-button size="small" @click="exportDB(scope.row.id, scope.row.dbName)">
                    <el-icon>
                      <EditPen />
                    </el-icon>
                    <span style="vertical-align: middle"> export </span>
                  </el-button>
                  <el-popconfirm :title="`删除読み替え表\n ${scope.row.dbName}?`" confirm-button-text="OK"
                    cancel-button-text="取消" width=500 @confirm="dbSettingDelete(scope.row.id)">
                    <template #reference>
                      <el-button size="small" type="danger">
                        <el-icon>
                          <Delete />
                        </el-icon>
                        <span style="vertical-align: middle"> 削除 </span>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize"
              :current-page="currentPage"  @current-change="handlePageChange" />
          </el-main>

        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
  <DBSettingEditDialog ref="dbSettingDialog" @submit="editSubmit" />
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, EditPen } from '@element-plus/icons-vue';
import DBSettingEditDialog from '@/dialogs/DBSettingEditDialog.vue';
import {
 uploadCSV, getDBList, exportCSV, deleteDBSeting
} from '@/api/DBSettingService';
import { handleError } from '@/utils/errorHandler';
import { useRoute, useRouter } from 'vue-router';


const loading = ref(false);
const dbSettingDialog = ref({});
const route = useRoute();
const router = useRouter();
const dbSettingList = ref([]);
const search = ref('');
const handleMenuClick = (path) => {
  router.push(path);
};

Date.prototype.format = function (pattern) {
  let o = {
    'M+': this.getMonth() + 1, // Month
    'd+': this.getDate(), // Day
    'H+': this.getHours(), // Hours
    'm+': this.getMinutes(), // Minutes
    's+': this.getSeconds(), // Seconds
    'q+': Math.floor((this.getMonth() + 3) / 3), // Quarter
    'S': this.getMilliseconds() // Milliseconds
  };
  if (/(y+)/.test(pattern)) {
    pattern = pattern.replace(RegExp.$1, (this.getFullYear() + '')
      .substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) :
        (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  if (/(Z)/.test(pattern)) {
    let signs = '-';
    let timezoneOffsetHore = this.getTimezoneOffset() / 60;
    if (timezoneOffsetHore < 0) {
      timezoneOffsetHore *= -1;
      signs = '+';
    }
    let timezoneStr = '00' + timezoneOffsetHore;
    timezoneStr = signs + timezoneStr.substr(timezoneStr.length - 2) + '00';
    pattern = pattern.replace(RegExp.$1, timezoneStr);
  }
  return pattern;
};

// 分页相关数据
const total = ref(0); // 总记录数
const pageSize = ref(10); // 每页显示条数
const currentPage = ref(1); // 当前页码

// 选中的行
const dbSettingTable = ref(null);
// 表字段排序
let sort = reactive({});

const processedData = computed(() => {
  return dbSettingList.value.map(item => {
    return {
      ...item,
      formatedCsvSize: formatCsvSize(item.fileSize),
      formatLastUpdateDate: formatLastUpdateDate(item.lastUpdateDate),
      formartLineCount: item.rowCount + '行'
    };
  });
});

function formatCsvSize(csvSize) {
  csvSize = Math.ceil(csvSize / (1024 * 1024) * 100) / 100;
  return csvSize.toFixed(2) + 'MB';
}

function formatLastUpdateDate(lastUpdateDate) {
  return new Date(lastUpdateDate).format('yyyy/MM/dd HH:mm') || '未定';
}

async function treeNodeClick() {
    try {
    loading.value = true;
    search.value = '';
    loading.value = true;
    const res = await getDBList(1, 20);
    dbSettingList.value = res.records;
    total.value = res.total;
    currentPage.value = res.current;
    dbSettingTable.value.clearSort();
  } catch (error) {
    handleError(error, '获取员工数据失败');
  } finally {
    loading.value = false;
  }
}

// 表格的排序
const sortChange = async ({ prop, order }) => {
  Object.assign(sort, { prop, order });
  await getDbSettings(currentPage.value, pageSize.value);
}

const handlePageChange = async (newPage) => {
   await getDbSettings(newPage, pageSize.value);
};

// 员工表格一览
const getDbSettings = async (page, pageSize) => {
  try {
    loading.value = true;
    const res = await getDBList(page, pageSize, sort, search.value);
       dbSettingList.value = res.records;
    total.value = res.total;
    currentPage.value = res.current;
  } catch (e) {
    handleError(e, '获取员工失败');
  } finally {
    loading.value = false;
  }
}

const exportDB = async (id, dbName) => {
   try {
      const response = await exportCSV(id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', dbName + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      handleError(e, 'CSV文件失败');
    }
};

// 员工删除
const dbSettingDelete = async (id) => {
  try {
    loading.value = true;
    await deleteDBSeting(id);
    await treeNodeClick();
    ElMessage.success('删除成功');
  } catch (error) {
    handleError(error, '员工删除失败');
  } finally {
    loading.value = false;
  }
};

// 处理编辑提交
const editSubmit = async (object,file) => {
 try {
    loading.value = true;
    await uploadCSV(object.dbName,file[0]);
    await treeNodeClick();
    ElMessage.success('上传导入成功');
  } catch (error) {
    handleError(error, '上传导入失败');
  } finally {
    loading.value = false;
  }
};

function openAddModal() {
  dbSettingDialog.value.openDialog('読み替え表作成', {}, 'add');
}

async function open() {
  await treeNodeClick();
}

onMounted(async () => {
  await open();
});
</script>

<style scoped>
.common-layout {
  height: 100%;
}

.organisation-tree {
  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(var(--el-color-primary-rgb), .1);
    /* 选中节点的背景色 */
    color: #409eff;
    /* 选中节点的文字颜色 */
    border-radius: 8px;
  }
}

.controller-bar {
  margin-bottom: 20px;
}

.el-pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.chart {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}

.batch-dropdown {
  margin-top: 4px;
  margin-left: 12px;
}

.el-aside {
  display: table-cell;
}

.el-aside ul {
  height: 100%;
}

::v-deep .el-menu-item:hover {
  background-color: #f0f0f0 !important;
}


.el-menu-item.is-active {
  background-color: #409EFF !important;
  /* 激活时的背景色 */
  color: white !important;
  /* 激活时的文字颜色 */
}

/* 可选：悬停效果 */
.el-menu-item:hover {
  background-color: #f5f7fa !important;
}
</style>