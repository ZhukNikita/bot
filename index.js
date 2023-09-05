import truecallerjs  from "truecallerjs";
import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import {SpamMenu, MainMenu, TrueCallerMenu,ValidMenu,CallFilterMenu} from './Menu.js'
import { exec } from 'child_process';
let token = '6633592726:AAEdbBPmmxGOdYZ9TIMXAi03Q5hNOteDZ9Q';
const bot = new TelegramBot(token, {polling: true});

let userState = {};
const allowedPasswords = ['password'];

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;


    if (!userState[chatId] || !userState[chatId].authorized) {
        if (allowedPasswords.includes(text)) {
            userState[chatId] = { authorized: true };
            bot.sendMessage(chatId, 'Welcome! You are now authorized to use the bot.' , MainMenu);
        } else {
            bot.sendMessage(chatId, "Sorry, you're not authorized to use this bot.");
        }
        return;
    }


    if (!userState[chatId]) {
        userState[chatId] = {};
    }
    if (text === '/start') {
        bot.sendMessage(chatId, 'Hello', MainMenu);
        userState[chatId].activeCase = '';
    } else if (text === 'Check SPAM numbers') {
        userState[chatId].activeCase = '';
        bot.sendMessage(chatId, 'Choose please app', SpamMenu);
    } else if (text === 'Check valid numbers') {
        userState[chatId].activeCase = 'validNumbers';
        bot.sendMessage(chatId, 'Give me your numbers separated by a comma');
    } else if (text === 'TrueCaller') {
        userState[chatId].activeCase = 'trueCaller';
        bot.sendMessage(chatId, 'You choose TrueCaller');
        bot.sendMessage(chatId, 'Give me your numbers(max 30 numbers)');
    } else if (text === 'CallFilter') {
        userState[chatId].activeCase = 'CallFilter';
        bot.sendMessage(chatId, 'You choose CallFilter');
        bot.sendMessage(chatId, 'Give me your numbers');
    } else if (text === 'GetContact') {
        bot.sendMessage(chatId, 'GetContact logic here');
    } else if (text === 'Previous menu') {
        userState[chatId].activeCase = '';
        bot.sendMessage(chatId, 'Choose "Spam check" or "Valid check"', MainMenu);
    } else {
        if (userState[chatId].activeCase === 'validNumbers') {
                let numbers = msg.text
                const apiKey = "915706c30b468174b2ddf1f8c485fc78";
                const arrNumbers = numbers.split('\n');
                let temp = []
                for (let i = 0 ; i < arrNumbers.length ; i++) {
                    try {
                        const response = await axios.get(`http://apilayer.net/api/validate?access_key=${apiKey}&number=${arrNumbers[i]}&country_code=&format=1`);
                        temp[i] = `${arrNumbers[i]}:  ${response.data.valid === true? '\u2705': '\u274C'}`
                        bot.sendMessage(msg.chat.id, `${temp[i]}` , ValidMenu);

                    } catch (error) {
                      console.error("Error occurred:", error);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                  }
        } else if (userState[chatId].activeCase === 'trueCaller') {
                const numbers = msg.text;
                let arr = numbers.split('\n')
                let temp = []
                const numbersInLine = numbers.replace(/\n/g, ',')
                try {
                    exec(`truecallerjs --bs ${numbersInLine}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Ошибка выполнения команды: ${error.message}`);
                            return;
                          }
                          if (stderr) {
                            console.error(`Ошибка в выводе команды: ${stderr}`);
                            return;
                          }
                          const jsonData = JSON.parse(stdout);
                          console.log(stdout);
                          if(jsonData.status === 429 ){
                            bot.sendMessage(msg.chat.id, `To many request` , TrueCallerMenu);
                          }else{
                            for(let i = 0 ; i < arr.length; i++){
                                let data = jsonData.data[i].value
                                    temp[i] = `${arr[i]}:  ${data.spamInfo?data.spamInfo.spamType + ' \u274C': 'NOT SPAMMER \u2705'} , tag: ${data.name?data.name:data.altName? data.altName : 'Non Tag'  }`
                              }
                                bot.sendMessage(msg.chat.id, `${temp.join('\n\n')}` , TrueCallerMenu);
                          }

                    });

    
                } catch (error) {
                    console.error("Error occurred:", error);
                }
        }  else if (userState[chatId].activeCase === 'CallFilter') {
            let numbersList = msg.text;
            const numbersInLine = numbersList.replace(/\n/g, ',');
            const numbers = numbersInLine.split(',');
            let temp = []
            let word = '<span style="color:#000">'
            try{
                const searchWords = [
                    'негативні', 'Відсутні', "позитивні" ,
                    "отрицательные", "положительные", "Отсутствуют", 
                    "negativas", "reseñas Sin" , "positivas" , 
                    "No ratings" , "negative" , "positive" ];
                for(let i = 0 ; i < numbers.length ; i++){
                    const response = await axios.get(`https://callfilter.app/${numbers[i]}`)
                    let foundWord = null;
                    let foundPosition = response.data.indexOf(word)
                    const TagWord = '</'
                    const tagString = response.data.slice(foundPosition + word.length, foundPosition + 131)
                    const TagWordPosition = tagString.indexOf(TagWord)
                    const Tags = tagString.slice(0,TagWordPosition).split(',')
                    const Tag = Tags[Tags.length-1]
                    for (const word of searchWords) {
                        const position = response.data.indexOf(word);
                        if (position !== -1 && (!foundWord || position < foundWord.position)) {
                            foundWord = { word, position };
                        }
                    }
                    if (foundWord) {
                        temp[i] =`${numbers[i]}: Feedbacks ${
                            foundWord.word === "негативні" || foundWord.word === "отрицательные" || foundWord.word === "negativas" || foundWord.word === "negative"?
                            '\u274C️': 
                            foundWord.word === "Відсутні" || foundWord.word === "Отсутствуют" || foundWord.word === "reseñas Sin" || foundWord.word === "No ratings"?
                            '\u2705':
                            foundWord.word === "позитивні" || foundWord.word === "положительные" || foundWord.word === "positivas" || foundWord.word === "positive"?
                            '\u2705'
                            : ""
                        }; Tag : ${Tag}`;
                        bot.sendMessage(msg.chat.id, `${temp[i]}` , CallFilterMenu);

                    }
                    await new Promise(resolve => setTimeout(resolve, 400));
                }
        
        
            }
            catch(e){
                console.log(e)
            }
        }else {
            console.log(msg.text.split('\n'))
            bot.sendMessage(chatId, "Sorry. I don't understand you. \nWhat you want to check?", MainMenu);
        }
    }
});


74993499029
74993499030
74993499031
74993499017
74993499032
74993499033
74993499034
74993498953
74993499035
74993499036
74993499037
74993499005
74993499038
74993499039
74993499040
74993499009
74993499027
74993499028
74993499041 