import React, { useState, useEffect, forwardRef } from "react"
import { Form, Input, Select } from "antd"

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setDisabled] = useState(false)

  useEffect(() => {
    setDisabled(props.isUpdateAble)
  }, [props.isUpdateAble])

  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={
            isDisabled ? [] : [{required: true, message: "请选择区域"}]
          }
        >
          <Select  disabled={isDisabled}>
            {props.region.map((item) => {
              return (
                <Option value={item.value} key={item.id}>
                  {item.title}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: "请选择角色",
            },
          ]}
        >
          <Select
            onChange={(value) => {
              if (value === 1) {
                ref.current.setFieldsValue({
                  regions: "",
                })
                setDisabled(true)
              } else {
                setDisabled(false)
              }
            }}
          >
            {props.roleLists.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.roleName}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
})

export default UserForm
