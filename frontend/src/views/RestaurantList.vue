<template>
  <div class="common-layout" v-loading="loading">
    <el-container>
      <el-container>
        <el-main style="width: 100%">
          <el-row :span="24" :gutter="20" class="controller-bar">
            <el-col :span="6">
              <el-button type="primary" @click="openAddModal">
                <span style="vertical-align: middle">增加餐厅</span>
              </el-button>
            </el-col>
          </el-row>

          <el-table ref="workspaceTable" :data="renderWorkspaceList" @sort-change="sortChange" stripe border
            style="width: 100%">
            <el-table-column label="序号" prop="index" sortable width="100" />
            <el-table-column label="饭店名" prop="restaurantName" />
            <el-table-column label="区域" prop="area" sortable />
            <el-table-column label="地址" prop="address" />
            <el-table-column label="人均价格（元）" prop="averagePrice" sortable />
            <el-table-column label="必点菜" prop="featuredDishes" />
            <el-table-column label="评价" prop="comment" />
            <el-table-column align="center" label="操作" fixed="right" width="120">
              <template #default="scope">
                <!-- 绑定点击事件，跳转到高德地图 -->
                <el-button size="small" type="primary" @click="goToAmap(scope.row)">
                  <el-icon>
                    <MapLocation />
                  </el-icon>
                  <span style="vertical-align: middle">导航</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total" page-size="20"
            :page-sizes="[20, 50, 100]" :current-page="currentPage" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
          <el-divider />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <WorkspaceEditDialog ref="workspaceDialog" @submit="editSubmit" />
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { defineExpose, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { MapLocation } from '@element-plus/icons-vue';
import WorkspaceEditDialog from '@/dialogs/WorkspaceEditDialog.vue';
import restaurants from '@/data/restaurants.json';
import { handleError } from '@/utils/errorHandler';

const loading = ref(false);
const allRestaurants = ref([...restaurants]);
const workspaceList = ref([]);
const renderWorkspaceList = ref([]);
const search = ref('');
const workspaceDialog = ref({});

// 分页相关数据
const total = ref(0);
const pageSize = ref(20);
const currentPage = ref(1);

const workspaceTable = ref(null);
let sort = reactive({});

// 跳转到高德地图搜索饭店
const goToAmap = (row) => {
  if (!row || !row.restaurantName) {
    ElMessage.warning('餐厅名称不存在');
    return;
  }
  // 高德地图搜索链接（自动携带城市 + 饭店名）
  const keywords = `合肥${row.restaurantName}`;
  const url = `https://ditu.amap.com/search?query=${encodeURIComponent(keywords)}`;
  // 新标签页打开
  window.open(url, '_blank');
};

async function treeNodeClick() {
  try {
    loading.value = true;
    search.value = '';
    await getWorkspaces(1, pageSize.value);
    workspaceTable.value?.clearSort();
  } catch (error) {
    handleError(error, '获取餐厅数据失败');
  } finally {
    loading.value = false;
  }
}

const sortChange = async ({ prop, order }) => {
  Object.assign(sort, { prop, order });
  await getWorkspaces(currentPage.value, pageSize.value);
}

const handleSizeChange = async (newPageSize) => {
  pageSize.value = newPageSize;
  await getWorkspaces(1, newPageSize);
};

const handlePageChange = async (newPage) => {
  await getWorkspaces(newPage, pageSize.value);
};

const getWorkspaces = async (page, pageSize) => {
  try {
    loading.value = true;
    let records = allRestaurants.value;

    if (search.value) {
      const keyword = search.value.toLowerCase();
      records = records.filter(item =>
        item.restaurantName?.toLowerCase().includes(keyword) ||
        item.area?.toLowerCase().includes(keyword) ||
        item.featuredDishes?.toLowerCase().includes(keyword)
      );
    }

    if (sort.prop) {
      const order = sort.order === 'ascending' ? 1 : -1;
      records = [...records].sort((a, b) => {
        const aValue = a[sort.prop] ?? '';
        const bValue = b[sort.prop] ?? '';

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * order;
        }
        return String(aValue).localeCompare(String(bValue)) * order;
      });
    }

    total.value = records.length;
    currentPage.value = page;
    const start = (page - 1) * pageSize;
    workspaceList.value = records.slice(start, start + pageSize);
  } catch (e) {
    handleError(e, '获取餐厅数据失败');
  } finally {
    loading.value = false;
  }
}

watch(workspaceList, () => {
  renderWorkspaceList.value = workspaceList.value.map((item, index) => ({
    id: item.id,
    index: index + 1,
    restaurantName: item.restaurantName,
    area: item.area,
    address: item.address,
    averagePrice: item.averagePrice,
    featuredDishes: item.featuredDishes,
    comment: item.comment
  }));
});

// const workspaceEdit = async () => {
//   ElMessage.info('编辑功能尚未接入本地 JSON 数据');
// };

// const workspaceDelete = async (id) => {
//   try {
//     loading.value = true;
//     const index = allRestaurants.value.findIndex(item => item.id === id);
//     if (index >= 0) {
//       allRestaurants.value.splice(index, 1);
//       await getWorkspaces(currentPage.value, pageSize.value);
//       ElMessage.success('删除成功');
//     } else {
//       ElMessage.error('未找到餐厅');
//     }
//   } catch (error) {
//     handleError(error, '餐厅删除失败');
//   } finally {
//     loading.value = false;
//   }
// };

const editSubmit = async () => {
  ElMessage.info('新增/编辑功能尚未接入本地 JSON 数据');
};

function openAddModal() {
  workspaceDialog.value.openDialog('工作区作成', { workspaceName: '', userIDs: [] }, 'add');
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
    color: #409eff;
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
  color: white !important;
}

.el-menu-item:hover {
  background-color: #f5f7fa !important;
}
</style>