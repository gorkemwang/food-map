<template>
  <el-header>
    <div class="login-header">
      <div id="logo">
        <a class="m-global-header__logo" href="https://direct-stg-fb.fujifilm.com/ap1/dc/ap-desola/ja/">
          <img src="/images/fujifilm_corporate_logo.svg" width="152" height="42">
        </a>
      </div>
      <div id="servNm">
        <span class="m-global-header__region">
          <img src="/images/desola_logo.png" alt="Tchnology by AI inside"
            title="Technology by AI inside">
        </span>
      </div>
    </div>
  </el-header>
  <div class="login-container">
    <el-card class="login-card">
      <el-form ref="loginUserRef" :model="loginUser" :rules="rules" status-icon label-width="auto">
        <el-form-item label-position="top" label="用户名" prop="username">
          <el-input v-model="loginUser.username" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label-position="top" label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item style="display: inline-flex;">
          <el-button type="primary" @click="submitForm" style="width: 100px;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref , reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/auth';

const router = useRouter();
   const loginUser = reactive({
        username: '',
        password: '',
        roles: 'ADMIN'
    });
    const loginUserRef = ref(null);
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
};

const submitForm = async () => {
  login(loginUser).then(res => {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
    // 跳转到主页
    router.push({ path: '/' });
  }).catch(() => {
    ElMessage.error('用户名或密码不正确，请重新输入！');
  });
};
</script>

<style scoped>
.login-header {
  width: 1120px;
  margin: auto;
  display: flex;
  padding-top: 10px;
}

.login-container {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 70vh;
  background-position: center;
  width: 1120px;
  margin: auto;
  text-align: revert;
  padding-right: 60px;
  min-height: 415px;
  max-height: 415px;
  margin-top: 20px;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
}

header {
  --el-header-height: 84px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dcdcdc;
}
</style>