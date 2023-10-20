const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const {SpamMenu, MainMenu, TrueCallerMenu,ValidMenu,CallFilterMenu, GetContactMenu}  = require( './Menu.js')
const {exec} = require('child_process');
let token = '6633592726:AAEdbBPmmxGOdYZ9TIMXAi03Q5hNOteDZ9Q';
const bot = new TelegramBot(token, {polling: true});
const accountSid = "ACe1deca18a447738f1e7ead38ebbd72f5"
const authToken = "7244d3785374f0ca5aaeb028caaf3f0b"
const client = require('twilio')(accountSid, authToken);
const UripGetContact = require('urip-getcontact');
//a1i0U--iTy4xRkB-QlxKAXtlO9Mj5TIo6fBWiSCjkUz5tR1q4-_l9Gsxh7-4PoY-
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
        userState[chatId].activeCase = 'getContact';

          bot.sendMessage(chatId, 'GetContact logic here');
        
    } else if (text === 'Previous menu') {
        userState[chatId].activeCase = '';
        bot.sendMessage(chatId, 'Choose "Spam check" or "Valid check"', MainMenu);
    } else {
        if(userState[chatId].activeCase === 'getContact'){
            let numbers = msg.text
            let key = '0e67be15baf61560b11c8ea6a6174b244ef87faed0d437cc7d493d77854448c9';
            let token = 'bJLnFp7be7de1fb754a336bb24576c23c26fa3a38ed133ac0187f3f7ff';

            const getContact = new UripGetContact(token, key);

            const temp = []
            const arrNumbers = numbers.split('\n');
            const formattedPhoneNumberList = arrNumbers.map(phoneNumber => {
                const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
                if (!cleanedPhoneNumber.startsWith('+')) {
                  return '+' + cleanedPhoneNumber;
                }
                return cleanedPhoneNumber;
              });
              console.log(formattedPhoneNumberList)
            for (let i = 0 ; i < formattedPhoneNumberList.length ; i++) {
                try {
                    const response = await getContact.checkNumber(formattedPhoneNumberList[i])
                    temp[i] = `${arrNumbers[i]}: \nTags: ${response.tags.length > 5? response.tags.slice(0,5).join('\n'): response.tags.join('\n')}`
                    bot.sendMessage(msg.chat.id, `${temp[i]}` , GetContactMenu);

                } catch (error) {
                    bot.sendMessage(msg.chat.id, `Error occurred: ${arrNumbers[i]}: No result Found` , ValidMenu);
                  console.error(`Error occurred: ${error}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
        } else if (userState[chatId].activeCase === 'validNumbers') {
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
                          console.log(stdout)
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
                    await new Promise(resolve => setTimeout(resolve, 1200));
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
// try {
//     const result = await client.lookups.v2.phoneNumbers('+74993499029').fetch({ type: ['carrier'] });
//     console.log(result)
//     if (result.carrier) {
//       // Номер найден и информация о носителе доступна.
//       // Можно проводить дополнительную проверку, основанную на данных о носителе.
//       console.log(`Phone number ${phoneNumber} is not spam. Carrier: ${result.carrier.name}`);
//       return false;
//     } else {
//       console.log(`Phone number ${phoneNumber} is not valid or not found.`);
//       return false;
//     }

//   } catch (error) {
//     console.error(`Error checking phone number: ${error.message}`);
//     return false;
//   }





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