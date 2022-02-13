import React from 'react'
import { useState } from 'react';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;
export default function HeaderMenu() {
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapses = () => {
    setCollapsed(!collapsed)
  }
  const menu = (
    <Menu>
      <Menu.Item>
        超级管理员
      </Menu.Item>
      <Menu.Item danger>退出</Menu.Item>
    </Menu>
  );
  return (
    // <div>head</div>
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapses} /> : <MenuFoldOutlined onClick={changeCollapses} />
      }
      <div style={{ float: 'right' }}>
        欢迎回来Admin
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header >
  )
}
