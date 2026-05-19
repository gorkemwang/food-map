<template>
  <el-dialog title="新增餐厅" v-model="dialogVisible" width="560px" :before-close="handleBeforeClose">
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="饭店名" prop="restaurantName">
        <el-input v-model="form.restaurantName" maxlength="80" show-word-limit placeholder="必填" />
      </el-form-item>
      <el-form-item label="品类" prop="category">
        <el-input v-model="form.category" maxlength="40" show-word-limit placeholder="如：火锅、烧烤" />
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <el-input v-model="form.area" maxlength="40" show-word-limit />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" maxlength="120" show-word-limit />
      </el-form-item>
      <el-form-item label="人均（元）" prop="averagePrice">
        <el-input-number v-model="form.averagePrice" :min="0" :max="99999" :precision="0" :step="10"
          controls-position="right" style="width: 100%" />
      </el-form-item>
      <el-form-item label="必点菜" prop="featuredDishes">
        <el-input v-model="form.featuredDishes" type="textarea" :rows="2" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="评价" prop="comment">
        <el-input v-model="form.comment" type="textarea" :rows="3" maxlength="1000" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineExpose, reactive, ref } from 'vue';

const emit = defineEmits(['submit']);

const dialogVisible = ref(false);
const formRef = ref(null);

const emptyForm = () => ({
  restaurantName: '',
  category: '',
  area: '',
  address: '',
  averagePrice: 0,
  featuredDishes: '',
  comment: ''
});

const form = reactive(emptyForm());

const rules = {
  restaurantName: [
    { required: true, message: '请输入饭店名', trigger: 'blur' },
    { min: 1, max: 80, message: '饭店名长度不超过 80 个字符', trigger: 'blur' }
  ],
  averagePrice: [
    {
      validator: (_rule, value, callback) => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
          callback(new Error('请输入有效的人均价格'));
        } else if (Number(value) < 0) {
          callback(new Error('人均价格不能为负数'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
};

function resetForm() {
  formRef.value?.resetFields();
  Object.assign(form, emptyForm());
}

function handleCancel() {
  resetForm();
  dialogVisible.value = false;
}

function handleBeforeClose(done) {
  resetForm();
  done();
}

async function submitForm() {
  try {
    await formRef.value.validate();
    emit('submit', { ...form });
    dialogVisible.value = false;
    resetForm();
  } catch {
    // validation failed
  }
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

defineExpose({ openDialog });
</script>

<style scoped>
:deep(.el-form-item__label) {
  justify-content: flex-start;
}
</style>
