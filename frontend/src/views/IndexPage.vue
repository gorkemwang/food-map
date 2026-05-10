<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="logoDiv" style="font-size: 16px; margin-top: 10px; margin-left: 10px;; margin-bottom: 10px;">
          合肥美食地图
        </div>
        <el-menu mode="horizontal" class="el-menu-demo" :ellipsis="false" :default-active="getActiveMenu()" router>
          <el-menu-item index="/restaurantList">餐厅列表</el-menu-item>
          <el-menu-item index="/siteList">餐厅地图</el-menu-item>
          <el-sub-menu index="#">
            <template #title><el-icon :size="30">
                <UserFilled />
              </el-icon></template>
            <el-menu-item index="##" v-if="username">
              <el-icon>
                <Avatar />
              </el-icon>{{ username }}
            </el-menu-item>
            <el-menu-item index="/login" @click="userLogout">
              ログアウト
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { Avatar, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { handleError } from '@/utils/errorHandler';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { logout } from '@/api/AuthService';

const router = useRouter();
const authStore = useAuthStore();

const { username } = storeToRefs(authStore);

const getActiveMenu = () => {
  const currentPath = router.currentRoute.value.path;
  // 当路由是 /workspaceList 或 /dbSetting 时，选中サイト設定
  if (currentPath === '/workspaceList' || currentPath === '/dbSetting') {
    return '/siteList';
  }
  return currentPath;
};

const userLogout = async () => {
  try {
    await logout();
    authStore.logout();
    await router.push('/login');
    ElMessage.success('用户登录退出成功');
  } catch (e) {
    handleError(e);
    ElMessage.error('用户登录退出失败');
  }
}

</script>

<style scoped>
.el-menu--horizontal>.el-menu-item:nth-child(2) {
  margin-right: auto;
}

.el-header {
  --el-header-height: fit-content;
  padding-left: 0;
  padding-right: 0;
}

.logoDiv {
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    display: flex;
  }

  img {
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>