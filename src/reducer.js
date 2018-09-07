export const initialState = {
    customerDetails: [],
    newArray: []
}

export const bookingDetails = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_BOOKING': {
            return {
                customerDetails: [...state.customerDetails, action.newEntry]  
             }}
        case 'checkAvailability':
        
            return {
                customerDetails: action.checkAvailability
                
            }
        default:
            return state;
    }
}

export default bookingDetails;

