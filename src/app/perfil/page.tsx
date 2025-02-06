import React from 'react'
import OrdersBox from './ui/OrdersBox'
import UserDetailsBox from './ui/UserDetailsBox'

export default function Perfil() {
  return (
    <div>
      <div className='perfil-container'>
      <UserDetailsBox/>
        <OrdersBox/>

      </div>

    </div>
  )
}
