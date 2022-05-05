### state 的声明尽量使用函数的形式，便于以后多个 store 访问同一个 module，而导致的数据污染

https://next.vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E9%87%8D%E7%94%A8

### 在声明一个 module 后请在 typings/state-type.ts 中的 RootState，填写相应的模块对应的类型

### 最后在 modules.ts 中引入该模块
