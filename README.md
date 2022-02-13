- 配置代理

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ajax',
    createProxyMiddleware({
      target: 'https://m.maoyan.com',
      changeOrigin: true,
    })
  );
```

- switch 例如有路径 '/' '/login', 那么匹配到 login 的时候是一定会匹配到/的。为了在路由匹配的时候实现精确匹配，可以将 route 用 switch 包裹起来
- 关于路由权限

```js
在没有权限的情况下我们需要将路由重定向
<Route path='/' render={()=> {
  return localStorage.getItem('token')? <Other/> : <Redirect to='/login'>
}}/>
```

- 动态生成侧边栏（这一点与之前自己的想法不同，之前完全没有想到使用动态生成）通过便利数组一个数组实现在侧边栏中可以通过 map 便利数组或者可以定义一个函数，通过函数的调用直接生成侧边栏

- 若父组件是 root， 则 root 给子组件传递的 props 中可以包含与路由相关的内容，若父组件不是 root，子组件不能通过 props.history.push 跳转
- 这种情况西可以使用高阶组件 withrouter

- 当侧边栏的选项都打开始会给全屏出现滚动条，我们可以只设置侧边栏局部的滚动条
