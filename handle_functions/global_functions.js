function createID(str) {
    let newID = '';

    for (let i = str.length - 1; i >= str.length - 7; i--) {
        if (i % 2 !== 0) {
            newID += str[i];
        } else newID += str.charCodeAt(i);
    }

    return newID;
}

module.exports = createID;