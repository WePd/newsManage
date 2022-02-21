import React, { useEffect, useState } from "react"
import { Table, Button, Modal, Tree } from "antd"
import axios from "axios"
import {
  UnorderedListOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  //树形控件
  const [treeSource, setTreeSource] = useState([])
  //当前点击角色的信息
  const [currentRight, setCurrentRight] = useState([])
  // 记录修改了权限的id
  const [currentId, setCurrentId] = useState(null)
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then((res) => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }, [])
  //获取树形控件数据源
  useEffect(() => {
    axios
      .get("http://localhost:8000/rights?_embed=children")
      .then((res) => setTreeSource(res.data))
  }, [])
  //表格数据
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              shape="circle"
              type="primary"
              onClick={() => {
                setIsModalVisible(true)
                setCurrentRight(item.rights)
                setCurrentId(item.id)
              }}
              icon={<UnorderedListOutlined />}
            />
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => doConfirm(item)}
            />
          </div>
        )
      },
    },
  ]
  // 删除弹出框
  const doConfirm = (item) => {
    confirm({
      title: "确认要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        //确认删除
        handleDel(item)
      },
      onCancel() {
        // console.log();
      },
    })
  }

  //删除操作
  const handleDel = (item) => {
    console.log(item)
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`http://localhost:8000/roles/${item.id}`)
  }

  //确认
  const handleOk = () => {
    console.log(currentRight)
    setIsModalVisible(false)
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return { ...item, rights: currentRight }
        }
        return item
      })
    )
    axios.patch(`http://localhost:8000/roles/${currentId}`, {
      rights: currentRight,
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  //树形控件方法
  const onCheck = (selectedKeys) => {
    // console.log(selectedKeys)
    setCurrentRight(selectedKeys.checked)
  }
  return (
    <div>
      <Table
    dataSource={dataSource}
    columns={columns}
    rowKey={(item) => item.id}
    />
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRight}
          onCheck={onCheck}
          treeData={treeSource}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
