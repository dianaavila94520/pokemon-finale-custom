import { sTim,getStats,fetchPokemonAnswers, getArtWorkImageBuffer, getSpriteImageBuffer } from "./prompt.js";
import fs from "fs-extra";
import figlet from 'figlet';
import { pastel } from "gradient-string";

const createdFolder = async() => {
const nameGiven = fetchPokemonAnswers.pokemonName;
  fs.mkdir(`./${nameGiven}`, { recursive: true}
);

for (const element of fetchPokemonAnswers.checkboxPrompt) {
    if(element === ('Sprites')) {
        await getSpriteImageBuffer()
     }
     else if(element === ('Art-Work')) {
        await getArtWorkImageBuffer()
     }
      else if(element === ('Stats')) {
       await  getStats()
     }
}
}
const allDone  = () => {
    console.clear();
    figlet(`                 Congrats
        
         ${fetchPokemonAnswers.pokemonName}   Directory
         created   successfully`, (err,da) => {
        console.log(pastel.multiline(da) + '\n');
    })
    
}
 const eTim = new Date()
 const time  = eTim - sTim
 console.log(time);
 export default createdFolder;
 export { allDone }