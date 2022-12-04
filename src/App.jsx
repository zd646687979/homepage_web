import { useEffect, useState } from 'react'
import styles from "./App.module.less"
import {Button} from 'antd'
import { useDispatch,useSelector } from 'react-redux';
import {test} from './assets/image'

// function GetHLC(userId, cityId) {
//   /// <summary>根据城市ID获取热线医生代表</summary>
//   /// <param name="userId" type="int">用户ID</param>
//   /// <param name="cityId" type="int">城市ID</param>
//   /// <returns type="String" />
//   return "张晓华"
// }


const App = ()=>{
  const dispatch = useDispatch()
  const {count} = useSelector(({NPage})=>NPage)
  const {incrementAsync} = useSelector(({load})=>load.effects.NPage)
  useEffect(()=>{
    console.log('incrementAsync: ', incrementAsync);
    console.log('dispatch: ', dispatch);
  },[])
  return (
    <div className={styles.app}>
    </div>
  )
}
export default App
