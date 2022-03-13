<template>
    <button class="v-button" v-bind="$attrs" v-on="$listeners"
        :class="[
            {
                private: type === 'private',
                danger: type === 'danger',
                info: type === 'info'
            },
            {
                'is-round': round
            }
        ]"
    >
        <slot></slot>
    </button>
</template>

<script>
export default  {
    name: 'VButton',
    props: {
        type: {
            type: String,
            default: ''
        },
        round: Boolean
    }
}
</script>

<style lang="less" scoped>
    .v-button {
        width: 100px;
        font-size: 14px;
        line-height: 1;
        padding: 8px 10px;
        border-radius: 4px;
        border: 1px solid;
        border: 1px solid #dcdfe6;
        color: #606266;
        background: rgba(255, 255, 255, 1);;
        cursor: pointer;
        &.private {
            background-color: #409eff;
            border-color: #409eff;
            color: rgba(255, 255, 255, 1);
        }
        &.danger {
            background-color: #f56c6c;
            border-color: #f56c6c;
            color: rgba(255, 255, 255, 1);
        }
        &.info {
            background-color: #909399;
            border-color: #909399;
            color: rgba(255, 255, 255, 1);
        }
        &.is-round {
            border-radius: 15px;
        }
    }
</style>
