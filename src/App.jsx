/*import React, { useState, useContext} from "react";
import Admin from "./Admin";
import User from "./Users";
import Guest from "./Guest";
import { GlobalContext } from "./Context/context";
//import { decodeToken } from 'react-jwt' //remove comment after adding the backend api 
const ComponentsByRoles = {
  'admin': Admin,
  'user': User,
  'guest': Guest
}

const getUserRole = (params) => ComponentsByRoles[params] || ComponentsByRoles['guest']
//const getDecodeToken = (token) => decodeToken || null      //remove comment after adding the backend api 

export default function App() {

  const { state, dispatch } = useContext(GlobalContext)


  //const currentToken = getDecodeToken (state.token)  //remove comment after adding the backend api 

  //const CurrentUser = getUserRole(currentToken.role) //remove comment after adding the backend api 
  const CurrentUser = getUserRole(state.role) //remove this after add backend api
  return <CurrentUser />
}*/


import React, { useContext, useState } from 'react'
import Admin from './Admin';
import  Guest from './Guest';
import Users from './Users';
import { GlobalContext } from './Context/context';
import { decodeToken } from 'react-jwt'


export const AppRoute = '/'
const componentsByRoles = {
  'admin': Admin,
  'user': Users,
  'guest': Guest,
}

const getUserRole = (role) => componentsByRoles[role] || componentsByRoles['guest']

export default function App() {
  const { state, dispatch } = useContext(GlobalContext)

  const decodeUser = (token) => {
    if (!token) {
      return undefined
    }
    else {
      const res = decodeToken(token)
      return res?.role
    }
  }

  const currentToken = decodeUser(state.token)
  const CurrentUser = getUserRole(currentToken)
  return <CurrentUser />
}
