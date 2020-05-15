## activity-admin

activity-年度评奖系统

## `yarn`
包管理按照

## `yarn start`
项目执行

## mocke server
自带mock服务，在后端接口还没有完成前，可以根据接口文档编写一些mock数据

## mocke 启动
找到 .env.development.local 环境变量配置文件
启用 REACT_APP_PROXY_TYPE=MOCK 即可

## scripts
运行下面脚本之前请确保运行了`yarn` or `yarn install`安装了开发需要的依赖包
``` shell
    yarn run build:test // 构建测试环境
    yarn run build // 构建正式环境
```