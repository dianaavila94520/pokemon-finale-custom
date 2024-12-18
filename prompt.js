import { input, checkbox, confirm } from '@inquirer/prompts';
import fs from "fs";
import path from 'path';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';

const sTim = new Date()
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome () {
    const rainboeTitle = chalkAnimation.rainbow(`******Welcome to Pokemon Downloader******\n              🐏\n.......Spread the love......\n`);
    await sleep();
    rainboeTitle.stop()
};

await welcome();

const fetchPokemonAnswers = {
    pokemonName: await input({ message: chalk.blue("Please enter a Pokemon Name")}),
    
    checkboxPrompt: await checkbox({
        message: chalk.green(" Select Your Product to Download\n"),
        choices: [
            { name: chalk.red('Sprites'),value : 'Sprites' },
            { name: 'Art-Work', value: 'Art-Work' },
            { name: chalk.yellow('Stats'), value: 'Stats' }
        ],
        required: true,

    }),
}
const directory = path.join(import.meta.dirname, `${fetchPokemonAnswers.pokemonName}` )
function fetchPendingApi() {
const pokemonRes = fetch(`https://pokeapi.co/api/v2/pokemon/${fetchPokemonAnswers.pokemonName}`)
return pokemonRes;
}
const fetchImageAndDownload = async(imageUrl) => {
    const imageRes = fetch(imageUrl)
    const imageResponse = await imageRes;
    const pendingarrayBuffer = (await imageResponse).arrayBuffer();
    const arrBufferRes = await pendingarrayBuffer;
    const bufferImage = Buffer.from(arrBufferRes);
     return bufferImage;
    }

const getJsonData = async () => {
    const pendingGivenPokemon = fetchPendingApi();
    const pendingJsonVal = await pendingGivenPokemon;
    const pendingjsonRes = pendingJsonVal.json();
    const responsejsonRes =  await pendingjsonRes;
    return responsejsonRes;
    
}
const hanndleName = async () => {
    const nameArr = ["bulbasaur","ivysaur","venusaur","pikachu","charmander","charmeleon","charizard","squirtle","wartortle","ditto","blastoise","caterpie","metapod","butterfree","weedle","beedrill","pidgey","kakuna","pidgeotto"]
    const spinner = createSpinner('Checking answer...').start();
    await sleep();
    
    if (nameArr.includes(fetchPokemonAnswers.pokemonName) ) {
        spinner.success({ text: `Nice work. That's a legit answer` });
      } else {
        spinner.error({ text: `💀💀💀 Please enter a valid PokeMon Name!` });
        process.exit(1)
      }}
await hanndleName()
const getSpriteImageBuffer= async () => {
    const resJson = await getJsonData();
    const allSprites = Object.entries(resJson.sprites)
    const filterSpriteImage = ["back_default","back_female","back_shiny","back_shiny_female","front_default","front_female","front_shiny","front_shiny_female"]
    for ( const [key, val] of allSprites) {
        if (filterSpriteImage.includes(key)) {
            if (val !== null) {
              const imageRes = await fetchImageAndDownload(String(val))
              fs.writeFileSync(directory + `/${key}.png`, imageRes)
            }
        } 
    }
}

const getArtWorkImageBuffer= async (folder) => {
    const resJson = await getJsonData();
    const a = resJson.sprites.other["official-artwork"]
    const allSprites = Object.entries(a);
    for ( const [key, val] of allSprites) {
            const imageRes = await fetchImageAndDownload(String(val))
              fs.writeFileSync(directory + `/${key}-art.png`, imageRes)
    }
}

const getStats =  async() => {
    const resJson = await getJsonData();
    let newString = ""
    const allSprites =  Object.values(resJson.stats)
    for (const element of allSprites) {
     newString += `${element.stat.name} => ${element.base_stat}\n`
    }
    fs.writeFileSync(directory + `/${fetchPokemonAnswers.pokemonName}-Stat.txt`, newString )
}

const restart = await confirm({ message: "Do You want Another Pokemon?"})
restart;

export { sTim,input, fetchPokemonAnswers, getSpriteImageBuffer,  getStats, getArtWorkImageBuffer };