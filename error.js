const error = () => {
    let random = Math.random();
    if (random > 0.5) {
        const err = new Error('Retry count exausted')
        throw err;
    }
}

module.exports = error;


// const err = new Error('Im an error2!')
// throw err;
// return true;
