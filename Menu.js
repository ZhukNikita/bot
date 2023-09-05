export const MainMenu = {
    reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            [{text: 'Check SPAM numbers'}],
            [{text: 'Check valid numbers'}]
        ]
    })
};

export const TrueCallerMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'GetContact'} , {text: 'CallFilter'}],
            [{text: 'Previous menu'}]
        ]
    }
};
export const CallFilterMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'GetContact'}],
            [{text: 'Previous menu'}]
        ]
    }
};
export const ValidMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'Previous menu'}]
        ]
    }
};
export const GetContactMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'CallFilter'}],
            [{text: 'Previous menu'}]
        ]
    }
};
export const SpamMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'TrueCaller'}, {text: 'GetContact'} , {text: 'CallFilter'}],
            [{text: 'Previous menu'}]
        ]
    }
};