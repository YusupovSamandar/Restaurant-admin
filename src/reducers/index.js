import { createStore } from "redux";
export const AppState = {
    data: {},
    waiters: [],
    products: [],
    collections: {}
};

const reducer = (state = AppState, action) => {
    switch (action.type) {

        case "DATA_LOAD": {
            const { allData, waiters } = action;
            return {
                ...state,
                data: allData,
                waiters
            }
        }

        case "WAITERS": {
            const { waiters } = action;
            return {
                ...state,
                waiters
            }
        }

        case "ALLPRODUCTS": {
            const { products } = action;
            return {
                ...state,
                products
            }
        }

        case "ALLCOLLECTIONS": {
            const { collections } = action
            return {
                ...state,
                collections
            }
        }

        default:
            return state;
    }
}

export default createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);