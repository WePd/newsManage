import React, { useRef, useEffect, useState } from "react"
import { Table, Button, Modal, Switch } from "antd"
import { UnorderedListOutlined, DeleteOutlined } from "@ant-design/icons"
import axios from "axios"

import UserForm from "../../../component/UserManage/UserForm"

export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  //弹出框展示状态
  const [isAddVisible, setisAddVisible] = useState(false)
  //区域
  const [region, setRegion] = useState([])
  //角色
  const [roleLists, setRoleLists] = useState([])
  const ref = useRef()
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch defaultChecked={roleState} disabled={item.default}></Switch>
        )
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              shape="circle"
              type="primary"
              icon={<UnorderedListOutlined />}
              disabled={item.default}
            />
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              disabled={item.default}
            />
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    axios
      .get("http://localhost:8000/users?_expand=role")
      .then((res) => setdataSource(res.data))
  }, [])

  //获取区域上拉框的显示内容
  useEffect(() => {
    axios
      .get("http://localhost:8000/regions")
      .then((res) => setRegion(res.data))
  }, [])
  //角色数据
  useEffect(() => {
    axios
      .get("http://localhost:8000/roles")
      .then((res) => setRoleLists(res.data))
  }, [])
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setisAddVisible(true)
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 8 }}
        rowKey={(item) => item.id} // 给每一行
      ></Table>

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setisAddVisible(false)}
        onOk={() => {
          console.log("add", ref.current)
        }}
      >
        <UserForm ref={ref} region={region} roleLists={roleLists} />
      </Modal>
    </div>
  )
}
