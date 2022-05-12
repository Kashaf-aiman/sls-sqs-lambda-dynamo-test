
const Backoff = (retries) => {
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    let jitter = Math.min(160, Math.pow(2, retries)*60);
    // var temp = jitter/2;
    let backoff =  random(59, jitter);
    
    return backoff;
}
module.exports = Backoff;
// let jitter = Math.floor((Math.random() * 60) + 1);
// let backoff = Math.pow(2, retries) * 30 + jitter;