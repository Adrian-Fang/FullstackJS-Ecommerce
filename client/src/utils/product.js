//Not in use yet @2020-08-17

export function formatDate(dateStr) {
    return new Date(Date.parse(dateStr)).toLocaleString();
}

export function processImag(imgStr) {
    // In case of products 
    return imgStr.split(",")[0];
}

