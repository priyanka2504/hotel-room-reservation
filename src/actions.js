export const addBooking = (newEntry) => {
    return {
        type: 'ADD_BOOKING',
        newEntry
    }
};

export const checkAvailability = (checkDate) => ({
    type: 'checkAvailability',
    checkDate
})
