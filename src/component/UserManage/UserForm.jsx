import React from "react"
import { Form, Input, Select } from "antd"
import { forwardRef } from "react/cjs/react.production.min"

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="title"
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
              message: "password",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="regions"
          label="区域"
          rules={[
            {
              required: true,
              message: "password",
            },
          ]}
        >
          <Select allowClear>
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
          name="roles"
          label="角色"
          rules={[
            {
              required: true,
              message: "roles",
            },
          ]}
        >
          <Select allowClear>
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
