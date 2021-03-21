import { v4 as uuidv4 } from "uuid";
import music1 from "./assets/Blooom_Be-Around.mp3"
import music2 from "./assets/Max-Brhon_Pain.mp3"
import music3 from "./assets/Egzod-EMM_Don't-Surrender.mp3"
import music4 from "./assets/Warriyo_Mortals(feat. Laura Brehm).mp3"
import music5 from "./assets/Sub-Urban_Cradles.mp3"
import music6 from "./assets/lost-sky_need-you.mp3"
import music7 from "./assets/Unknown-Brain_Superhero-(feat. Chris Linton).mp3"
import music8 from "./assets/Lost-Sky_Where-We-Started-(feat. Jex).mp3"

function musicData() {
  return [
    {
      name: "Be Around",
      artist: "Blooom",
      audio: music1,
      color: 130,
      id: uuidv4(),
    },
    {
      name: "Pain",
      artist: "Max Brhon",
      audio: music2,
      color: "white",
      id: uuidv4(),
    },
    {
      name: "Don't Surrender",
      artist: "Egzod, EMM",
      audio: music3,
      color: "red",
      id: uuidv4(),
    },
    {
      name: "Mortals",
      artist: "Warriyo, feat. Laura Brehm",
      audio: music4,
      color: -10,
      id: uuidv4(),
    },
    {
      name: "Cradles",
      artist: "Sub Urban",
      audio: music5,
      color: 150,
      id: uuidv4(),
    },
    {
      name: "Need You",
      artist: "Lost Sky",
      audio: music6,
      color: 250,
      id: uuidv4(),
    },
    {
      name: "Superhero (feat. Chris Linton)",
      artist: "Unknown Brain",
      audio: music7,
      color: 25,
      id: uuidv4(),
    },
    {
      name: "Where We Started (feat. Jex)",
      artist: "Lost Sky",
      audio: music8,
      color: 300,
      id: uuidv4(),
    },
  ];
}

export default musicData;
