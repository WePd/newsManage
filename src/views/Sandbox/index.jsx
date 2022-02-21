import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HeaderMenu from '../../component/sandbox/HeaderMenu'
import SideMenu from '../../component/sandbox/SideMenu'
import Home from './Home'
import UserList from './User-Manage/UserList'
import RoleList from './Right-Manage/RoleList'
import RightList from './Right-Manage/RightList'
import NoPermission from './NoPermission'
import { Layout } from 'antd';

import './index.css'

const { Content } = Layout
export default function Sandbox() {
  return (
    <Layout>
      <SideMenu/>
      <Layout className="site-layout">
        <HeaderMenu/>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/user-manage/list' component={UserList} />
            <Route path='/right-manage/role/list' component={RoleList} />
            <Route path='/right-manage/right/list' component={RightList} />
            <Redirect from='/' to='/home' exact />
            <Route path='*' component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
