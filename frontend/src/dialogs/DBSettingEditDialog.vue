<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" :before-close="dialogClose">
    <el-form :model="form" label-width="140px" ref="formRef">
      <el-row>
        <el-col>
          <el-form-item label="DB名" prop="workspaceName">
            <el-input v-model="form.dbName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="operate !== 'edit'">
          <el-form-item type="file" label="文件名" prop="fileName">
            <el-upload ref="uploadRef" class="upload-demo" :on-change="handleFileChange" :file-list="fileList" multiple="false" limit="1"
              :auto-upload="false">
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>

            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue';
const fileList = ref([]);  // 文件列表状态

const dialogTitle = ref('');
const dialogVisible = ref(false);
const operate = ref('');
const form = ref({});

const formRef = ref(null);
const textareaRef = ref(null);

const emit = defineEmits(['submit']);

const handleFileChange = (file, files) => {
  fileList.value = files;  // 更新文件列表
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
    emit('submit', form.value, fileList.value);
    dialogVisible.value = false;
    formRef.value.resetFields();
  } catch (e) {
    console.log('表单验证失败:', e);
  }
}

const openDialog = async (title, employee, action) => {
  dialogTitle.value = title;
  dialogVisible.value = true;
  operate.value = action;
  form.value = employee;
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