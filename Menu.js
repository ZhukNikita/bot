const MainMenu = {
    reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            [{text: 'Check SPAM numbers'}],
            [{text: 'Check valid numbers'}]
        ]
    })
};

const TrueCallerMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'GetContact'} , {text: 'CallFilter'}, {text: 'SpamCalls'}],
            [{text: 'Previous menu'}]
        ]
    }
};
const CallFilterMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'GetContact'}, {text: 'SpamCalls'}],
            [{text: 'Previous menu'}]
        ]
    }
};
const SpamCallsMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'GetContact'}, {text: 'CallFilter'}],
            [{text: 'Previous menu'}]
        ]
    }
};
const ValidMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'Previous menu'}]
        ]
    }
};
const GetContactMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'CallFilter'}, {text: 'SpamCalls'}],
            [{text: 'Previous menu'}]
        ]
    }
};
const SpamMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'GetContact'} , {text: 'CallFilter'}, {text: 'SpamCalls'}],
            [{text: 'Previous menu'}]
        ]
    }
};
module.exports = {SpamMenu,GetContactMenu,MainMenu,ValidMenu,TrueCallerMenu,CallFilterMenu}