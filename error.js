const error = () => {
    let random = Math.random();
    if (random > 0.5) {
        return true;
    }
    return false;
}

module.exports = error;


// const err = new Error('Im an error2!')
// throw err;
// return true;
