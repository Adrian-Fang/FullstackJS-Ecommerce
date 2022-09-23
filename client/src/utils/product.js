//Not in use yet @2020-08-17

export function formatDate(dateStr) {
    return new Date(Date.parse(dateStr)).toLocaleString();
}

export function processImage(imgStr) {
    // In case of products 
  if(imgStr) {
    return `/static/${imgStr.split(',')[0]}`;
  } else {
    return '/static/default.png';
  }
}

