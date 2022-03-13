<template>
    <div class="header-wrapper">
        <div class="container">
            <header class="header">
                <h1 class="logo">UI Library</h1>
                <ul class="nav">
                    <li class="nav-item">
                        <router-link active-class="active" to="/home">首页</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link active-class="active" to="/about">关于</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link active-class="active" to="/components">组件</router-link>
                    </li>
                </ul>

            </header>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppHeader'
}
</script>

<style lang="less" scoped>
    .header-wrapper {
        .container {
            border-bottom: 1px solid #dcdfe6;
        }
    }
    .header {
        display: flex;
        justify-content: space-between;
        height: 80px;
        line-height: 80px;
    }
    .logo {
        padding: 0;
        margin: 0;
    }
    .nav {
        display: flex;
        padding: 0;
        margin: 0;
        .nav-item {
            margin: 0;
            list-style: none;
            position: relative;
            cursor: pointer;
            a {
                text-decoration: none;
                color: #1989fa;
                opacity: .5;
                display: block;
                padding: 0 22px;
                &:hover {
                    opacity: 1;
                }
                &.active {
                    opacity: 1;
                    &::after {
                        content: "";
                        display: block;
                        position: absolute;
                        bottom: 0;
                        left: calc(50% - 15px);
                        width: 30px;
                        height: 2px;
                        background: #409eff;
                    }
                }
            }
        }
    }
</style>