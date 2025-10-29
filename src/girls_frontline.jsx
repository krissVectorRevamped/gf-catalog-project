/* eslint-disable react/prop-types */
import React, { useMemo, useRef, useState, useEffect, useContext } from 'react';
import GFL_CSS from "./my-style.module.css";
import game_char_data from "./json/char_data_full";
import char_stat from "./json/char_data_stat.json"
import{ MODIIIBoolContext, CharacterBoolContext, CharDataContext} from './main';

console.log(char_stat)

export const Card = (props) =>{

  const { mod,setMod } = useContext(MODIIIBoolContext)
  const { char, setChar } = useContext(CharacterBoolContext)
  const { charData, setCharData} = useContext (CharDataContext)

  const mod_bool = () => {return (mod && props.hasMODIII ? true: false)}

     let Rarity = (num = props.rarity) => {
          if (mod_bool()){num++; if(props.rarity == 2){num++}}
          return num;
     }

     let CharImg = () => {
          let string = 'src/char_img/';
          (props.rarity == "EXTRA" ? string += "Collab/" + props.name_img : null);
          (mod && props.hasMODIII ? string += "MODIII/" + props.name_img +"Mod" : null);
          (string == 'src/char_img/' ? string += props.name_img : null)

          return (
          <img className={GFL_CSS.char_img}
               src={string +"_S.png"}/>
               )
     }
     let CardBg = () => {
          return (
          <img className={GFL_CSS.char_img_background}
               src={"src/char_img_bg/char_bg_" + Rarity() + ".png"}/>
     )
     }
     let Icon = () => {
          return (<img className={GFL_CSS.icon_img}
               src={"src/icon/Icon_" + props.type + '_' + Rarity() +"star.png"}/>
               )
     }
     let Header = () => {
          return (<img className={GFL_CSS.header_img}
               src={"src/header/header_" + Rarity() + "star.png"}/>)
     }
     let stars = (num) => {
          let star = '★';
          if (num === 'EXTRA'){return (star)}
          for(let itt = 1;itt < num;itt++){star += '★';}
          //console.log(props.index,num, star)
          return star
     }
     let Icon_extra = () => {
          let string = '';
          if(mod_bool()){string = 'mod'}
          if(props.rarity == 'EXTRA'){string = 'extra'}
          if(string == ''){return null}
          return (
               <img className={GFL_CSS.icon_img_extra}
               src={"src/icon/gfl_extra/"+string+".png"}/>
          )}

   return (
     <MODIIIBoolContext.Provider value={{mod, setMod}}>
     <div className={GFL_CSS.card_container}>
          <div className={GFL_CSS.card_container_inner}>
          <CharacterBoolContext.Provider value={{char,setChar}}>
          <div className={GFL_CSS.card_frame}
               index={props.index}
               onClick={() => {setChar(true);setCharData(props)/*console.log(char)*/}}/>
          </CharacterBoolContext.Provider>
          <p id={GFL_CSS.star}>{stars(Rarity())}</p>
          <p id={GFL_CSS.name}>{props.name}</p>
          <p id={GFL_CSS.index}>{props.index}</p>
          <img className={GFL_CSS.border}
               src={"src/border.png"}/>
               <CharImg/>
               <CardBg/>
               <Header/>
               <Icon/>
               <Icon_extra />
          </div>
     </div>
   </MODIIIBoolContext.Provider>
   )
 }

 export const CharacterDIV = () => {
     const { char, setChar } = useContext(CharacterBoolContext)
     const { charData, setCharData } = useContext (CharDataContext)//char obj from card
     const { mod, setMod} = useContext(MODIIIBoolContext)

     const [ skinState, setSkinState ] = useState(0);
     const [ skinName, setSkinName ] = useState('');
     const [ damageBool, toggleDamageBool] = useState(false)
     const [ localMod, setLocalMod] = useState(mod)
     const [ skinDiv, setSkinDiv] = useState(false);

     useEffect(()=> {
          setLocalMod(mod)
     }, [mod],[skinState])

     const handleStateChange = () => {
          toggleDamageBool(false);
          setChar(false);
          setSkinDiv(false);
          setLocalMod(mod);
          setSkinName('');
          setSkinState(mod ? 'mod' : 0);
     }

     //console.log(char)

     const LeftDiv = () => {
          const CharSkinDiv = () => {
               useEffect(()=> {
                    setLocalMod(skinState == 'mod' ? true : false)
               })

               //console.log(charData)
               let charSkinName = ( game_char_data?.skin[charData.name_img] || game_char_data.skin.default);
               //console.log(charSkinName, charData.name)
               let charSkinArr = Object.entries(charSkinName);
               console.log(charSkinArr)

               const handleSkin = (skinState, skinName) => {
                    setSkinState(skinState); setSkinName(skinName)
               }

               const SkinListElem = (props) => {
                    //console.log(props);
                    return (
                    <p className={skinState == props.id && GFL_CSS.mod_on}
                       onClick={() => {handleSkin(props.id, props.value)}}>
                         {props.value}
                    </p>)
               }

               return(
               <div className={GFL_CSS.skin}>
                    <p   className={damageBool && GFL_CSS.damage_on}
                         onClick={() => {toggleDamageBool(!damageBool);
                    }}>Damaged</p>
                    <p   className={skinState == 0 && GFL_CSS.mod_on}
                         onClick={() => {handleSkin(0, '');
                    }}>Default</p>
                    {charData?.hasMODIII &&
                    <p   className={skinState == 'mod' && GFL_CSS.mod_on}
                         onClick={()=>{handleSkin('mod','');
                        }}>MODIII</p>}
                    {charSkinArr.map((item)=>
                         <SkinListElem id={item[0]} value={item[1]}/>
                         )}
               </div>
               )
          }

       return (
         <div className={GFL_CSS.left}>
          {skinDiv && <CharSkinDiv/>}
           <button onClick={() => {
             handleStateChange();
           }}/>
           <button onClick={() => {
               setSkinDiv(!skinDiv);
               //console.log(skinDiv)
           }}/>
       </div>
       )
     }
     const MainDiv = () => {

       let name_img = () => {
         let string = 'src/char_img_full/';
         {skinState == 'mod' && charData?.hasMODIII ? string += charData.type +'/'+charData.name_img+ '/Pic_'+charData.name_img+'Mod':null}
         {charData.rarity == "EXTRA" ? string += "Collab Unit/" +charData.collab+ '/Pic_'+charData.name_img:null}
         {string ==  'src/char_img_full/' ? string += charData.type +'/'+charData.name_img+ '/Pic_'+charData.name_img:null}
         //console.log(string);
         {skinState != 'mod' ? string + '_' + skinState : null}
         return (string + (skinState != 'mod' ? (skinState != 0 ? '_' + skinState: '') : '')+(damageBool ? "_D":'')+"_HD.png")
         }

       let CharSkinName = () => {

          return <p className={GFL_CSS.charSkinName}>{skinName}</p>
       }

       let CharImg = () => {
         try {
         return (
           <img src={name_img()}/>)
         } catch (error) {
           return <img/>
         }
       }
   
       let CharNation = () => {
         let nationData = game_char_data.nation[charData?.name_img];
         let nation_bg = "src/char_nation/"+nationData+".png";
         //console.log(nation_bg)
         if(nationData == undefined){nation_bg = "src/char_nation/G&K.png"}
   
         return <img className={GFL_CSS.charNation} src={nation_bg}/>
       }
   
       let CharBg = () => {
         let src = "src/char_nation/"
         return (
           <div className={GFL_CSS.nation_bg}>
             <img src={src + "bgleft.png"}/>
             <img src={src + "bgright.png"}/>
           </div>
   
         )
       }
   
       return (
         <div className={GFL_CSS.main}>
           <CharSkinName />
           <CharImg />
           <CharNation />
           <CharBg />
         </div>
       )
     }
     const RightDiv = () => {
          const CharType = () => {
               console.log('type rendered')
               let Rarity = () => {
                    let num = charData?.rarity;
                    if (localMod && charData?.hasMODIII){num++; if(charData.rarity == 2){num++}}
                    return num;
               }

          return (
          <div className={GFL_CSS.charType}>
               <img src={"src/icon/Icon_"+ charData?.type+"_"+Rarity()+"star.png"}/>
               <p>{game_char_data?.type[charData?.type]}</p>
          </div>
          )
          }
          const CharName = () =>{
               console.log('name rendered')
               const MODIII = () => {
               if(charData?.hasMODIII && localMod ){return <p className={GFL_CSS.charNameMOD}>MODIII</p>}
               return null;
               }
               return (
               <div className={GFL_CSS.charName}>
                    <p className={GFL_CSS.name}>{charData?.name}</p>
                    <MODIII />
               </div>)
          }
          const CharStatRank = () => {
               console.log('rank rendered')
               let arr = (Object.entries(char_stat[charData?.name_img]?.stat || false) || 'object cant read');
               let CharStatElement = (props) => {
                    //console.log(props); 
                    return (
                         <div>
                              <p className={GFL_CSS.rank}>{props.value}</p>
                              <p className={GFL_CSS.tag}>{props.id}</p>
                          </div>
                    )
               }

               return (
                    <div className={GFL_CSS.charStatRank}>
                         {arr.map((item) => <CharStatElement id={item[0]} value={item[1]}/>)}
                    </div>
               )
          }
          const CharBuffTile = React.memo(({ charData }) => {
               console.log('tile render');
             
               const tileArray = useMemo(
                 () => char_stat[charData?.name_img]?.buff?.tile_buff || null,
                 [charData]
               );const tileChar = useMemo(
                 () => char_stat[charData?.name_img]?.buff?.tile_char || null,
                 [charData]
               );

               const gunType = useMemo(
                    () => char_stat[charData?.name_img]?.buff?.gun_type || [],
                    [charData]
               );
               const buffType = useMemo(
                    () => (char_stat[charData?.name_img]?.buff?.buff_type ? Object.entries(char_stat[charData?.name_img]?.buff?.buff_type) : []),
                    [charData]
               );console.log(buffType)

               const tileArr = useMemo(() => {
                 const newArr = new Array(9).fill('');
             
                 if (tileArray !== null) {
                   tileArray.forEach((number) => {
                     const index = number - 1;
                     newArr[index] = GFL_CSS.tile_buff;
                   });
                 }
             
                 if (tileChar !== null) {
                   const index = tileChar - 1;
                   newArr[index] = GFL_CSS.tile_char;
                 }
             
                 return newArr;
               }, [tileArray, tileChar]);


             
               return (
                 <div className={GFL_CSS.charBuff}>
                   <div className={GFL_CSS.buffTile}>
                     {tileArr.map((style, index) =>
                       <div key={index} className={style}/>
                     )}
                    </div>
                    <div className={GFL_CSS.buff_detail}>
                         <div className={GFL_CSS.gun_type}>
                              {gunType.map((item) =>
                                   <img src={"src/icon/Icon_"+item+"_2star.png"}/>
                              )}
                         </div>
                         <div className={GFL_CSS.gun_buff}>
                              {buffType.map((item)=>
                              <div>
                                   <p className={GFL_CSS.num}>+{item[1]}%</p>
                                   <p className={GFL_CSS.buff}>{item[0]}</p>
                              </div>
                              )}
                         </div>
                   </div>
                 </div>
               );
             });
          CharBuffTile.displayName = 'CharBuffTile';
          //const charBuffTile = useMemo(() => <CharBuffTile/>, [charData])
       return (
         <div className={GFL_CSS.right}>
             <CharName />
             <CharType />
             <CharStatRank />
             {char_stat[charData?.name_img] && <CharBuffTile charData={charData}/>}
           </div>
       )
     }
     const rightDiv = useMemo(()=> <RightDiv/>,[localMod, charData])//omfg it ate tons of my braincells just to figure out how not to re-render some parts

     return (
       <CharacterBoolContext.Provider value={{char, setChar}}>
         <div className={`${GFL_CSS.CharacterDIV} ${GFL_CSS[(char ? 'active': '')]}`}>
           <LeftDiv />
           <MainDiv/>
           {rightDiv}
         </div>
       </CharacterBoolContext.Provider>
     )
   }