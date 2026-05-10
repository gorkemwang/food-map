<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="850px" :before-close="dialogClose">
    <el-form :model="form" label-width="140px" :rules="rules" ref="formRef">
      <el-row>
        <el-col :span="15">
          <el-form-item label="工作区名" prop="workspaceName">
            <el-input v-model="form.workspaceName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block;--el-transfer-panel-width: 270px" filterable
          :render-content="renderFunc"  v-model="form.userIDs" :titles="['可以追加的用户	', '有权限的用户']" filter-placeholder="用户名"
          :button-texts="['除外', '追加']" :data="data" @change="handleChange">
        </el-transfer>
      </div>

    </el-form>
    <template #footer>
      <span>
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose ,reactive} from 'vue';
import { getUsers } from '@/api/WorkspaceService';
import { handleError } from '@/utils/errorHandler';

const dialogTitle = ref('');
const dialogVisible = ref(false);
const operate = ref('');

const data = ref([]);
const selectUsers = ref([]);

const renderFunc = (h, option) => h('span', null, option.label);

const handleChange = (value) => {
  selectUsers.value = value;
};

// 表单验证规则
const rules = ref({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' },
  ]
});
const formRef = ref(null);
const form = reactive({id: 0, workspaceName: '', userIDs: []});
const textareaRef = ref(null);

const emit = defineEmits(['submit']);

const loadNode = async () => {
  try {
    data.value = [];
    const response = await getUsers();
    for (let user of response) {
      data.value.push({
        key: user.id,
        label: user.username
      });
    }
  } catch (error) {
    handleError(error, '获取部门数据失败');
  }
};


const dialogClose = () => {
  dialogVisible.value = false;
  if (textareaRef.value) {
    textareaRef.value.textarea.style.height = 'auto';
  }
  formRef.value.resetFields();
};

async function submitForm() {
  try {
    await formRef.value.validate();
    emit('submit', form, operate.value);
    dialogVisible.value = false;
    formRef.value.resetFields();
  } catch (e) {
    console.log('表单验证失败:', e);
  }
}

const openDialog = async (title, employee, action) => {
  await loadNode();
  dialogTitle.value = title;
  dialogVisible.value = true;
  operate.value = action;
  form.workspaceName = employee.workspaceName;
  form.userIDs = employee.userIDs;
  form.id = employee.id;
};
defineExpose({ openDialog });
</script>

<style scoped>
:deep(.el-dialog__body) {
  max-height: 60vh !important;
}

:deep(.el-form-item__label) {
  justify-content: flex-start;
}
</style>