import React, { useRef, useEffect, useState } from "react"
import { Table, Button, Modal, Switch } from "antd"
import {
  UnorderedListOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import axios from "axios"

import UserForm from "../../../component/UserManage/UserForm"

const { confirm } = Modal

export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  //弹出框展示状态
  const [isAddVisible, setisAddVisible] = useState(false)
  //区域
  const [region, setRegion] = useState([])
  //角色
  const [roleLists, setRoleLists] = useState([])
  //更新弹出框
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  // 弹出框更新权限
  const [isUpdateAble, setIsUpdateAble] = useState(false)
  const [current, setCurrent] = useState(null)

  const ref = useRef()
  const updateRef = useRef()

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
          ...region.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      },
      onFilter: (value, item) =>
      {
        if(value === '全球'){
          return item.region === ''
        }
          return item.region === value}
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
          <Switch defaultChecked={roleState} disabled={item.default} onChange={() => handleChange(item)}/>
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
              onClick={() => editHandle(item)}
            />
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              disabled={item.default}
              onClick={() => deleteHandle(item)}
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

  //添加用户
  const addHandle = () => {
    // console.log("add", ref.current)
    ref.current
      .validateFields()
      .then((value) => {
        setdataSource([...dataSource], value)
        setisAddVisible(false)
        //每次添加完设置表单清空
        ref.current.resetFields()
        addUser(value)
        // console.log(value)
      })
      .catch((error) => new Error())
  }
  //添加用户发送请求
  const addUser = (value) => {
    axios
      .post("http://localhost:8000/users", {
        ...value,
        roleState: true,
        default: false,
      })
      .then((res) => {
        // console.log(res.data)
        //合并数据
        setdataSource([
          //原数据
          ...dataSource,
          {
            ...res.data,
            role: roleLists.filter((item) => item.id === value.roleId)[0],
          },
        ])
      })
  }

  //删除用户
  const deleteHandle = (item) => {
    confirm({
      title: "确认要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        //确认删除
        setdataSource(dataSource.filter((data) => data.id !== item.id))
        //删除数据请求
        deleteUser(item)
      },
      onCancel() {
        setisAddVisible(false)
      },
    })
  }
  //删除用户数据请求
  const deleteUser = (item) => {
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }

  //控制开关
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState,
    })
    console.log(item)
  }

  //编辑按钮， 弹出修改框
  const editHandle = (item) => {
    setTimeout(() => {
      // console.log(item)
      setisUpdateVisible(true)
      // console.log(updateRef.current)
      if (item.roleId === 1) {
        setIsUpdateAble(true)
      } else {
        setIsUpdateAble(false)
      }
      updateRef.current.setFieldsValue(item)
      setCurrent(item)
    }, 0)
  }

  //更新确认
  const updateHandle = () => {
      updateRef.current.validateFields()
        .then((value) => {
          setdataSource(
            dataSource.map((item) =>{
              if (item.id === current.id) {
                return {
                  ...item,
                  ...value,
                  role: roleLists.filter((data) => data.id === value.roleId)[0],
                }
              }
              return item
            })
          )
          setIsUpdateAble(!isUpdateAble)
          setisUpdateVisible(false)
          update(value)
        })
        .catch((error) => new Error())
  }
//更新请求
 const update = (value) => {
    axios.patch(`http://localhost:8000/users/${current.id}`,{
      ...value
    })
 }

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
        pagination={{pageSize: 8}}
        rowKey={(item) => item.id} // 给每一行
    />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setisAddVisible(false)}
        onOk={() => addHandle()}
      >
        <UserForm ref={ref} region={region} roleLists={roleLists} />
      </Modal>

      {/* //更新的弹出框 */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          console.log(isUpdateAble)
          setIsUpdateAble(!isUpdateAble)
          console.log(isUpdateAble)
        }}
        onOk={() => updateHandle()}
      >
        <UserForm
          ref={updateRef}
          // 通过组件传值确定若是超级管理员则不能修改地区
          isUpdateAble={isUpdateAble}
          region={region}
          roleLists={roleLists}
        />
      </Modal>
    </div>
  )
}
