const path = require('path');
const crypto = require('crypto');
const asym_crypto = require('quick-encrypt');
const fs = require('fs');

const AppendInitVect = require('./appendInitVect');


class cipherHandler {

    constructor() {
        if (fs.existsSync("./tokens/asym_keys.json")) {
            let keysFile = fs.readFileSync("./tokens/asym_keys.json");
            this.keys = JSON.parse(keysFile);
        }
        else {
            this.keys = asym_crypto.generate(2048)

            let asym_key = fs.createWriteStream("./tokens/asym_keys.json");
            asym_key.write(JSON.stringify(keys));
            console.log("Keys generated");
        }
    }

    setDriveHandler(driveHandler) {
        this.driveHandler = driveHandler;
    }
    /* 
 * Function in which will be integrated the file encryption 
 * @param Path of the file to be encrypted
 */
    encrypt(filePath) {
        // var name = path.basename(filePath);
        if (typeof filePath === 'undefined') {
            console.error("Please type the name of the file as an argument");
            return;
        }

        // Generation of a random initialization vector
        const initVect = crypto.randomBytes(16);

        // Generation of a random Key
        const CIPHER_KEY = crypto.randomBytes(32);
        const readStream = fs.createReadStream(filePath); // The file to encrypt
        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect); // The cipher
        const appendInitVect = new AppendInitVect(initVect); // AppendInitVect to append it tothe file after encryption
        // Create a write stream with a different file extension.
        const writeStream = fs.createWriteStream(path.join(filePath + ".enc"));

        readStream
            .pipe(cipher)
            .pipe(appendInitVect)
            .pipe(writeStream)


        var cipherKeyFile = fs.createWriteStream(filePath + ".key"); // Creation of the key File
        // Asymetric encryption of the file key 
        // The base64 option allows to keep the correct key size
        cipherKeyFile.write(asym_crypto.encrypt(CIPHER_KEY.toString('base64'), this.keys.public));

        writeStream.on('finish', () => {
            console.log("File encrypted");
            this.driveHandler.createFile(filePath); // call for the upload of the file
        });

    }

    getCipherKey(fileId) {
        var encrypted_key = fs.readFileSync(`./tmp/${fileId}.key`);
        var d_key = asym_crypto.decrypt(encrypted_key.toString(), this.keys.private); // Decryption of the key with the peer's key
        return Buffer.from(d_key, 'base64'); // Change to buffer with base64 format to have the correct key size for decryption of the file
    }

    /* 
     * Function in which will be integrated the file encryption 
     * @param The file Id on the drive, the path of the ciher File and the Key used to encrypt the data 
     * @return null 
     */

    decrypt(fileId, cipherFile) {
        const readInitVect = fs.createReadStream(cipherFile, { end: 15 });
        var dest = fs.createWriteStream(`./tmp/${fileId}.download`);

        // fetch the initialization Vector on the downloaded file
        let initVect;
        readInitVect.on('data', (chunk) => {
            initVect = chunk;
        });

        // Once we’ve got the initialization vector, we can decrypt the file.
        readInitVect.on('close', () => {
            const cipherKey = this.getCipherKey(fileId); // Call for the decryption of the key
            const readStream = fs.createReadStream(cipherFile, { start: 16 }); // Start at 16 since the initialization vector is of size 16
            const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);

            readStream
                .pipe(decipher)
                .pipe(dest);
            dest.on('finish', () => {
                console.log("File decrypted");
                fs.unlinkSync(cipherFile); // Cleaning the temporary files 
                fs.unlinkSync(`./tmp/${fileId}.key`);
            });
        });
    }
}
module.exports = cipherHandler;