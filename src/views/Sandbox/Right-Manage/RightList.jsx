import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal } from 'antd'
import { Fragment } from 'react/cjs/react.development'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;
export default function RightList() {
  const [dateSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: tags => {
        return (
          <Tag color={'pink'} key={tags}>
            {tags}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button shape="circle" type='primary' icon={<EditOutlined />} />
            <Button shape="circle" danger icon={< DeleteOutlined />} onClick={() => doConfirm(item)} />
          </div>
        )
      }
    },
  ]
  const doConfirm = (item) => {
    confirm({
      title: '确认要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        //确认删除
        handleDel(item);
      },
      onCancel() {
        // console.log();
      },
    });
  }
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children')
      .then(res => {
        const list = res.data
        list.forEach(item => {
          if (item.children.length === 0) {
            item.children = ''
          }
        })
        setDataSource(list)
      })
  }, [])
  //删除操作
  const handleDel = (item) => {
    //需要前后端协同
    setDataSource(dateSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/rights/${item.id}`)
  }
  return (
    <Fragment>
      <Table columns={columns} dataSource={dateSource} pagination={{ pageSize: 5 }} />
    </Fragment>
  )
}
