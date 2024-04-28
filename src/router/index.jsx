// 导入创建路由的函数
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import My from "../pages/My/index.jsx";
import MyItem from "../pages/MyItem/index.jsx";
import Treasury from "../pages/Treasury/index.jsx";


// 创建router路由实例对象，并配置路由对应关系（路由数组）
const router = createBrowserRouter([
  {
    // 需要访问的路径
    path: "/",
    // 和路径对应的组件
    // 和 Vue 不同的是，此处是使用 element 接收 组件 或 jsx 的
    // 此处写 jsx 是为了演示，在实际开发中，这里写的是组件
    element: <App />,
  },
  {
    path: "/treasury",

    element: <Treasury />,
  },
  {
    path: "/my",

    element: <My />,
  },
  {
    path: "/my-item",

    element: <MyItem />,
  },
]);

export default router;
