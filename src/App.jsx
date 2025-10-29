import JSONList from "./components/JSONList";
import CharacterDIV from "./components/CharacterDIV";
import MiddleMain from "./components/MiddleMain";
import Navigation from "./components/Navigation";
import Setting from "./components/Setting";

// your context imports
import { CharacterBoolContext, MODIIIBoolContext, SettingContext, CharDataContext } from "./contexts";

export default function App() {
  // these are your hooks — same as before
  const [char, setChar] = useState(false);
  const [mod, setMod] = useState(false);
  const [bool, setBool] = useState(false);
  const [charData, setCharData] = useState([]);

  return (
    <div id='main'>
      <JSONList/>
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
  );
}
