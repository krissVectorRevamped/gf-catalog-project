/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
//Main jsx
import React, {useContext, useRef, useState, useEffect }from 'react';
import ReactDOM from 'react-dom/client';
import styles from "./my-style.module.css";
import game_card_data from "./json/tdoll_data";
import game_char_data from "./json/char_data_full";
import * as GFL_card from "./girls_frontline";
const root = ReactDOM.createRoot(document.getElementById('root'));
//import { BrowserRouter, Routes, Route, link} from "react-router-dom";
//import Catalog from "./js/Catalog";
//import AdminPanel from "./js/AdminPanel";


console.log(game_char_data)
let database = "GFL";

const SettingContext = React.createContext()
export const MODIIIBoolContext = React.createContext()
export const CharacterBoolContext = React.createContext()
export const CharDataContext = React.createContext()

//sub component prep before main html
let Setting = (props) => {
  let ref = useRef(0)
  const {bool, setBool} = useContext(SettingContext)
  const {mod, setMod} = useContext(MODIIIBoolContext)

  let handleClose = () => {
    setBool(!bool);
    setTimeout(() => {
      setBool(!bool);
    }, 300);
  }

  let classBool = (bool && "active")
  let buttonMOD = () => {
    return (mod && 'mod_on')
  }

  const TopDiv = () => {
    return (
      <div className={styles.top}>
      <button onClick={() => {
        handleClose()
      }}/>
    </div>
    )
  }

  const MiddleDiv = () => {
    return(
      <div className={styles.mid_div}>
        <MODIIIBoolContext.Provider value={{mod, setMod}}>
        <div>
          <p>MODIII : </p>
          <button className={styles[buttonMOD()]} onClick={() => {
            setMod(!mod); console.log(this);
          }}></button>
        </div>
        </MODIIIBoolContext.Provider>
        <div>
          <button></button>
        </div>
        <div>
          <button></button>
        </div>
      </div>
    )
  }

  console.log(bool, styles[classBool])

  return (
    <SettingContext.Provider value={{bool, setBool}}>
      {classBool && (
      <div className={`${styles.settings} ${styles[classBool]}`}>
        <TopDiv />
        <MiddleDiv />
      </div>)}
    </SettingContext.Provider>
  )
}

let Navigation = (props) => {

  const {bool, setBool} = useContext(SettingContext);

  return (
    <div id={styles.nav_div}>
    <SettingContext.Provider value={{bool, setBool}}>
      <div className={styles.left_div}>
        <button id='nav_btn' onClick={() => {
          setBool(!bool); console.log('button triggered')
        }}/>
        <div id={styles[props.id]}/>
      </div>
      <div className={styles.mid_div}></div>
    </SettingContext.Provider>
      <div className={styles.right_div}></div>
    </div>
  )
}
let MiddleMain = () => {

  const game_database = sortGameDatabase(1);
  const CardName = {GFL:  GFL_card.Card}
  const CardDIV = CardName[database];

  return (
    <div className={styles.right_side}>
      {game_database.map((game_data) =>
          <CardDIV
          database={database}
          index={game_data.index}
          name={game_data.name[1]}
          name_img={game_data.name[0]}
          rarity={game_data.rarity}
          type={game_data.type}
          hasMODIII={game_data.has_MODIII}
          collab={game_data.collab}/>
        )}
    </div>)
  }

//the Whole HTML
const Main = () => {

  const JSONList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Fetch JSON data from the server
      fetch('/api/data')
        .then((response) => response.json())
        .then((json) => setData(json));
    }, []);

    return console.log(data)
  }

  const CardName = {GFL:  GFL_card.CharacterDIV}
  const CharacterDIV = CardName[database]

  const [bool, setBool] = useState(false);
  const [mod, setMod] = useState(false)
  const [char, setChar] = useState(false)
  const [charData, setCharData] = useState()

  return (
  <div id='main'>
  {<JSONList/>}
    <CharacterBoolContext.Provider value={{char,setChar}}>
    <MODIIIBoolContext.Provider value={{mod, setMod}} >
    <SettingContext.Provider value={{bool, setBool}}>
      <Setting />
      <Navigation id="nav_id"/>
    </SettingContext.Provider>
    <CharDataContext.Provider value={{charData,setCharData}}>
      <CharacterDIV />
      <MiddleMain/>
      </CharDataContext.Provider>
    </MODIIIBoolContext.Provider>
    </CharacterBoolContext.Provider>
  </div>
  )
}
const main = <Main/>
// other sub-function

function sortGameDatabase(type){

  const arrayObj = JSON.parse(JSON.stringify(game_card_data.tdolls));
  const list = [];let arr = []

  for (var key in arrayObj){
    if (key !==list){
      let value = [key, arrayObj[key].index]
      list.push(value);
    }
  }
  //sort them out from first to last
  list.sort(function(a,b){return a[1] - b[1]})

  const changeArrElement = (arr, key) => {
    return arr;
  }

  for (let key of list){
    let arr_temp = Object.assign(arrayObj[key[0]])
    let arr_temp_2 = changeArrElement(arr_temp, key)//send to a function to be change according to filter
    arr.push(arr_temp_2);
  }

  return arr;
}

// listener

root.render(main)
