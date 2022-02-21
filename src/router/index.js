import { HashRouter, Redirect, Route, Switch } from "react-router-dom"
import React from "react"

import Login from "../views/Login"
import Sandbox from "../views/Sandbox"

export default function RouterIndex() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        {/* <Route path="/" component={Sandbox} /> */}
        <Route
          path="/"
          render={() => {
            return localStorage.getItem("token") ? (
              <Sandbox/>
            ) : (
              <Redirect to="/login" />
            )
          }}
        />
      </Switch>
    </HashRouter>
  )
}
