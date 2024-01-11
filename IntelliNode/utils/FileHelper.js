const fs = require('fs');


class FileHelper { 

    static writeDataToFile(filePath, data) {
        fs.writeFileSync(filePath, data);
    }

    static readData(filePath, fileFormat) {
        return fs.readFileSync(filePath, fileFormat)
    }

    static createReadStream(filePath) {
        return fs.createReadStream(filePath)
    }
    
}

module.exports = FileHelper
