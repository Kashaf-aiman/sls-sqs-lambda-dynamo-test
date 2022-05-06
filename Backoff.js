
const Backoff = (retries) => {
    let jitter = Math.floor((Math.random() * 60) + 1);
    let backoff = Math.pow(2, retries) + 30 + jitter;

    return backoff;
}

module.exports = Backoff;