export function useEmployee() {
    // 职务
    const options = [
        {
            value: '开发工程师',
            label: '开发工程师',
            type: 'primary'
        },
        {
            value: '测试工程师',
            label: '测试工程师',
            type: 'success'
        },
        {
            value: '项目经理',
            label: '项目经理',
            type: 'info'
        },
        {
            value: '开发部长',
            label: '开发部长',
            type: 'warning'
        },
        {
            value: '事业部长',
            label: '事业部长',
            type: 'danger'
        }
    ];

    // 可以控制显示所有列
    const allColumns = [
        {prop: 'graduationSchool', label: '毕业学校'},
        {prop: 'majorStudied', label: '所学专业'},
        {prop: 'highestEducationLevel', label: '最高学历'},
        {prop: 'graduationDate', label: '毕业时间'},
        {prop: 'technicalTitle', label: '技术职称'},
        {prop: 'joiningDate', label: '入职日'},
        {prop: 'address', label: '住址'}
    ];

    const educationLeveloptions = [
        {
            value: '博士',
            label: '博士'
        },
        {
            value: '硕士',
            label: '硕士'
        },
        {
            value: '本科',
            label: '本科'
        },
        {
            value: '专科',
            label: '专科'
        },
        {
            value: '中专',
            label: '中专'
        }
    ];

    // 技术职称
    const technicalTitleOptions = [
        {
            value: '初级程序员',
            label: '初级程序员'
        },
        {
            value: '中级程序员',
            label: '中级程序员'
        },
        {
            value: '高级程序员',
            label: '高级程序员'
        },
        {
            value: '技术主管',
            label: '技术主管'
        },
        {
            value: '架构师',
            label: '架构师'
        },
        {
            value: '测试工程师',
            label: '测试工程师'
        },
        {
            value: '产品经理',
            label: '产品经理'
        },
        {
            value: '项目经理',
            label: '项目经理'
        }
    ];

    const getTagType = (role) => {
        const find = options.find(a => a.value === role);
        return find ? find.type : '';
    }

    return {options, allColumns, educationLeveloptions, technicalTitleOptions, getTagType};
}