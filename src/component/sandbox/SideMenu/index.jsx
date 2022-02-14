import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { Layout, Menu } from "antd"
import axios from "axios"
import { UserOutlined } from "@ant-design/icons"
import "./index.css"

const { Sider } = Layout
const { SubMenu } = Menu
// 渲染出来是没有图标的，可以在蹦迪创建一个图标的映射
const iconList = {
  "/home": <UserOutlined />,
}
function SideMenu(props) {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:8000/rights?_embed=children")
      .then((res) => setMenu(res.data))
  }, [])
  //判断后端数据是否有pagePermission权限， 若是没有则在主页面不会渲染出来
  const checkPermission = (item) => {
    return item.pagepermisson === 1
  }
  const renderSide = (item) => {
    return item.map((item) => {
      if (item.children?.length > 0 && checkPermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderSide(item.children)}
          </SubMenu>
        )
      }
      return (
        checkPermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => props.history.push(item.key)}
          >
            {item.title}
          </Menu.Item>
        )
      )
    })
  }
  // console.log(props.location.pathname);
  //获取当前的路径然后使item保持选中
  const selectKey = [props.location.pathname]
  //设置初始展开的item数组项，为一个路径
  const openKey = ["/" + props.location.pathname.split("/")[1]]
  // console.log(openKey)
  return (
    <Sider trigger={null}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{ flex: "1", overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKey}
            defaultOpenKeys={openKey}
          >
            {renderSide(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
