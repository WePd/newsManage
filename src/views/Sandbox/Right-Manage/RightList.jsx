import React, { useEffect, useState } from "react"
import axios from "axios"
import { Table, Tag, Button, Modal, Popover, Switch } from "antd"
import { Fragment } from "react/cjs/react.development"
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"

const { confirm } = Modal
export default function RightList() {
  const [dateSource, setDataSource] = useState([])
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (tags) => {
        return (
          <Tag color={"pink"} key={tags}>
            {tags}
          </Tag>
        )
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onClick={() => switchChange(item)}
                  ></Switch>
                </div>
              }
              title="权限配置"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                shape="circle"
                type="primary"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
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
  //开关方法
  const switchChange = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    console.log(item)
    setDataSource([...dateSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    } else {
      axios.patch(`http://localhost:8000/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    }
  }

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
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      const list = res.data
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setDataSource(list)
    })
  }, [])
  //删除操作
  const handleDel = (item) => {
    console.log(item)
    //需要前后端协同
    if (item.grade === 1) {
      //若是一级可以直接删除
      setDataSource(dateSource.filter((data) => data.id !== item.id))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    } else {
      //二级或者更高的情况下可以先获取到在source中rightID的数组，然后通过数组的筛选
      let list = dateSource.filter((data) => data.id === item.rightId)
      // console.log(list[0].children.filter(data => data.id === item.id));
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      // console.log(list, dateSource);
      //这个地方是浅拷贝，要想变化就需要重新解构
      setDataSource([...dateSource])
    }
  }
  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={dateSource}
        pagination={{ pageSize: 5 }}
      />
    </Fragment>
  )
}
