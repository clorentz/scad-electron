const path = require('path');
const crypto = require('crypto');
const asym_crypto = require('quick-encrypt');
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
var Crypt = require('hybrid-crypto-js').Crypt;
var crypt = new Crypt();

const AppendInitVect = require('./appendInitVect');


class cipherHandler {

    constructor(login) {
        this.login = login;
        this.newKeys = false;
        if (fs.existsSync("./tokens/asym_keys.json")) {
            let keysFile = fs.readFileSync("./tokens/asym_keys.json");
            this.keys = JSON.parse(keysFile);
        }
        else {
            this.keys = asym_crypto.generate(2048)

            let asym_key = fs.createWriteStream("./tokens/asym_keys.json");
            asym_key.write(JSON.stringify(this.keys));
            console.log("Keys generated");
            this.newKeys = true;
        }
    }

    setDriveHandler(driveHandler) {
        this.driveHandler = driveHandler;
    }

    setDatabase(db) {
        this.db = db;
        if (this.newKeys) {
            this.db.collection("usersCollection").insertOne({"login": this.login, "pubKey": this.keys.public});
        }
    }

    /* 
 * Function in which will be integrated the file encryption 
 * @param Path of the file to be encrypted
 */
    async encrypt(req, res, userKeys) {
        var form = new IncomingForm();
        var keys = this.keys;
        form.on('file', (field, file) => {
          let name = file.name;
          let filePath = file.path;
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
        // cipherKeyFile.write(asym_crypto.encrypt(CIPHER_KEY.toString('base64'), keys.public));
        let keysArray = [keys.public];
        if (userKeys !== undefined) {
            userKeys.forEach(key => {
                keysArray.push(key);
            });
        }
        let encKey = crypt.encrypt(keysArray, CIPHER_KEY.toString('base64'));
        let encryptedKey = JSON.parse(encKey);
        cipherKeyFile.write(encryptedKey.iv + encryptedKey.cipher);
        writeStream.on('finish', () => {
            console.log("File encrypted");
            this.driveHandler.createFile(name, filePath, encryptedKey.keys).then(ret => {return;}); // call for the upload of the file
        });
    });
    form.on('end', () => {
    });
    form.parse(req);

    }

    async getCipherKey(name) {
        var keyCipher = fs.readFileSync(`./tmp/${name}.key`);
        let file = await this.db.collection("filesCollection").findOne({"name": name});
        console.log(file.keys);
        let key = {
            "v": "hybrid-crypto-js_0.1.6", 
            "iv": keyCipher.toString('utf8', 0, 44),
            "keys": file.keys,
            "cipher": keyCipher.toString('utf8', 44)
        };
        let decryptedKey = crypt.decrypt(this.keys.private, JSON.stringify(key));
          
        return Buffer.from(decryptedKey.message, 'base64'); // Call for the decryption of the key      
    }

    /* 
     * Function in which will be integrated the file encryption 
     * @param The file Id on the drive, the path of the ciher File and the Key used to encrypt the data 
     * @return null 
     */

    decrypt(name, cipherFile) {
        const readInitVect = fs.createReadStream(cipherFile, { end: 15 });
        var dest = fs.createWriteStream(`./tmp/${name}.download`);

        // fetch the initialization Vector on the downloaded file
        let initVect;
        readInitVect.on('data', (chunk) => {
            initVect = chunk;
        });

        // Once we’ve got the initialization vector, we can decrypt the file.
        readInitVect.on('close', () => {
            let cipherKey = this.getCipherKey(name).then(cipherKey => {
                const readStream = fs.createReadStream(cipherFile, { start: 16 }); // Start at 16 since the initialization vector is of size 16
                const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
        
                readStream
                    .pipe(decipher)
                    .pipe(dest);
                dest.on('finish', () => {
                    console.log("File decrypted");
                    fs.unlinkSync(cipherFile); // Cleaning the temporary files 
                    fs.unlinkSync(`./tmp/${name}.key`);
                });
            });
        }); // Call for the decryption of the key
    }
}
module.exports = cipherHandler;