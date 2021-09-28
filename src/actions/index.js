export const loadData = (allData, waiters) => {
    return {
        type: "DATA_LOAD",
        allData,
        waiters
    };
};

export const updateWaiters = (waiters) => {
    return {
        type: "WAITERS",
        waiters
    }
}

export const getAllProducts = (products) => {
    return {
        type: "ALLPRODUCTS",
        products
    }
}

export const postAllCollections = (collections) => {
    return {
        type: "ALLCOLLECTIONS",
        collections
    }
}