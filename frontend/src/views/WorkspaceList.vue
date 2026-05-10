<template>
  <div class="common-layout" v-loading="loading">
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="route.path === '/siteList' ? '/workspaceList' : route.path" router>
          <el-menu-item index="/workspaceList" >ワークスペース一覧 </el-menu-item>
          <el-menu-item index="/dbSetting" @click="handleMenuClick('/dbSetting')">読み替え表 </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container style="height: calc(100vh - 200px);">
        <el-scrollbar style="width: 100%">
          <el-main style="width: 100%">
            <el-row :span="24" :gutter="20" class="controller-bar">
              <el-col :span="6">
                <el-button type="primary" @click="openAddModal">
                  <span style="vertical-align: middle">工作区作成</span>
                </el-button>
              </el-col>
            </el-row>

            <el-table ref="workspaceTable" :data="renderWorkspaceList" @sort-change="sortChange" stripe border
              max-height="460" style="width: 100%">
              <el-table-column label="工作区" prop="workspaceName" sortable />
              <el-table-column label="用户数" prop="userCount" sortable />
              <el-table-column label="作成时间" prop="createTime" sortable />
              <el-table-column label="更新时间" prop="updateTime" sortable />
              <el-table-column align="center" label="操作" fixed="right" width="300">
                <template #default="scope">
                  <el-button size="small" @click="workspaceEdit(scope.row.id)">
                    <el-icon>
                      <EditPen />
                    </el-icon>
                    <span style="vertical-align: middle"> 编辑 </span>
                  </el-button>
                  <el-popconfirm
                    :title="`删除工作区\n ${scope.row.workspaceName} ?`"
                    confirm-button-text="OK" cancel-button-text="取消" width=500
                    @confirm="workspaceDelete(scope.row.id)">
                    <template #reference>
                      <el-button size="small" type="danger">
                        <el-icon>
                          <Delete />
                        </el-icon>
                        <span style="vertical-align: middle"> 删除 </span>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
              :page-size="pageSize" :current-page="currentPage" @size-change="handleSizeChange"
              @current-change="handlePageChange" />
            <el-divider />
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
  <WorkspaceEditDialog ref="workspaceDialog" @submit="editSubmit" />
</template>

<script setup>
import { defineExpose, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, EditPen } from '@element-plus/icons-vue';
import WorkspaceEditDialog from '@/dialogs/WorkspaceEditDialog.vue';
import {
  getWorkspaceList, deleteWorkspace,
  updateWorkspace, createWorkspace, getWorkspaceById
} from '@/api/WorkspaceService';
import { handleError } from '@/utils/errorHandler';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(false);
const workspaceList = ref([]);
const renderWorkspaceList = ref([]);
const search = ref('');
const workspaceDialog = ref({});
const route = useRoute();
const router = useRouter();

const handleMenuClick = (path) => {
  router.push(path);
};

// 分页相关数据
const total = ref(0); // 总记录数
const pageSize = ref(10); // 每页显示条数
const currentPage = ref(1); // 当前页码

// 选中的行
const workspaceTable = ref(null);
// 表字段排序
let sort = reactive({});

// 部门被点击
async function treeNodeClick() {
  try {
    loading.value = true;
    search.value = '';
    loading.value = true;
    const res = await getWorkspaceList(1, 20);
       workspaceList.value = res.records;
    total.value = res.total;
    currentPage.value = res.current;
    workspaceTable.value.clearSort();
  } catch (error) {
    handleError(error, '获取工作区数据失败');
  } finally {
    loading.value = false;
  }
}

// 表格的排序
const sortChange = async ({ prop, order }) => {
  Object.assign(sort, { prop, order });
  await getWorkspaces(currentPage.value, pageSize.value);
}

// 处理每页显示条数变化
const handleSizeChange = async (newPageSize) => {
  pageSize.value = newPageSize;
  await getWorkspaces(1, newPageSize);
};

// 处理页码变化
const handlePageChange = async (newPage) => {
  await getWorkspaces(newPage, pageSize.value);
};

// 工作区表格一览
const getWorkspaces = async (page, pageSize) => {
  try {
    loading.value = true;
    const res = await getWorkspaceList(page, pageSize, sort, search.value);
       workspaceList.value = res.records;
    total.value = res.total;
    currentPage.value = res.current;
  } catch (e) {
    handleError(e, '获取工作区失败');
  } finally {
    loading.value = false;
  }
}

watch(workspaceList, () => {
  renderWorkspaceList.value = workspaceList.value.map(item => ({
    id: item.id,
    workspaceName: item.workspaceName,
    createTime: convertToLocalTime(item.createTime),
    updateTime: convertToLocalTime(item.updateTime),
    userCount: item.userIDs.length
  }));
});

function convertToLocalTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// 工作区编辑
const workspaceEdit = async (id) => {
  try {
    loading.value = true;
    const response = await getWorkspaceById(id);
    workspaceDialog.value.openDialog('ワークスペース名の変更', response, 'edit');
  } catch (error) {
    handleError(error, '编辑工作区获取失败');
  } finally {
    loading.value = false;
  }
};

// 工作区删除
const workspaceDelete = async (id) => {
  try {
    loading.value = true;
    await deleteWorkspace([id]);
    await treeNodeClick();
    ElMessage.success('删除成功');
  } catch (error) {
    handleError(error, '工作区删除失败');
  } finally {
    loading.value = false;
  }
};

// 处理编辑提交
const editSubmit = async(workspace, operate) => {
  try {
    loading.value = true;
    if (operate === 'edit') {
     await updateWorkspace(workspace.id, workspace);
    } else {
     await createWorkspace(workspace);
    }
    await treeNodeClick();
    ElMessage.success('操作成功');
  } catch (error) {
    handleError(error, '更新工作区数据失败');
  } finally {
    loading.value = false;
  }
};

function openAddModal() {
  workspaceDialog.value.openDialog('工作区作成', {workspaceName: '', userIDs: []}, 'add');
}

async function open() {
  await treeNodeClick();
}

onMounted(async () => {
  await open();
});
defineExpose({ open });
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