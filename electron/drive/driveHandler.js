const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');
const IncomingForm = require('formidable').IncomingForm;

class driveHandler {
    
    constructor(SCOPES, TOKEN_PATH) {
        console.log(__filename);
        this.SCOPES = SCOPES;
        this.TOKEN_PATH = TOKEN_PATH;
        fs.readFile("./tokens/credentials.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            this.authorize(JSON.parse(content));
        });
    }

    setCipherHandler(cipherHandler) {
      this.cipherHandler = cipherHandler;
    }

    setDatabase(db) {
      this.db = db;
  }

    /**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(this.TOKEN_PATH, (err, token) => {
      if (err) return this.getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
      this.auth = oAuth2Client;
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   */
  getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        this.auth = oAuth2Client;
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
      });
    });
  }

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
  async listFiles() {
    var auth = this.auth;
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    });
    return res.data.files;
  }

  /* Function to create and upload a file 
     Usage: node drive.js create path
  */
  async createFile(name, filePath) {
    let auth = this.auth;
    let res = {"fileId": "", "keyId": "", "name": name};
    var drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
      'name': name
    };
    var media = {
      mimeType: 'text/plain', 
      body: fs.createReadStream(filePath+".enc")
    };
    var key_media = {
      mimeType: 'text/plain', 
      body: fs.createReadStream(filePath+".key")
    }
  
    const fileRes = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    res.fileId = fileRes.data.id;
    fs.unlinkSync(filePath+".enc");
      
    const keyRes = await drive.files.create({
      resource: {
        'name': fileMetadata["name"] + ".key"
      },
      media: key_media,
      fields: 'id'
    });
    res.keyId = keyRes.data.id;
    fs.unlinkSync(filePath+".key");
    this.db.collection('filesCollection').insertOne(res);
    return res;
  }
  
  /* Function to delete an uploaded file 
     Usage: node drive.js rm fileId
  */
  deleteFile(name) {
    let auth = this.auth;
    const drive = google.drive({ version: 'v3', auth });
    this.db.collection("filesCollection").findOne({"name": name}).then(file => {
      console.log(`Deleting file ${name} with id ${file.fileId} and keyId ${file.keyId}`);
      drive.files.delete({
        'fileId': file.fileId
      }).then(fileDeleteRes => {
        drive.files.delete({
          'fileId': file.keyId
        }).then(keyDeleteRes => {
          this.db.collection("filesCollection").deleteOne({"name": name}).then(res => console.log("File in the database deleted"));
        });
      });
    });
  }
  
  /* Function to clean all the files on the drive 
     Usage: node drive.js clean
  */
  cleanDrive() {
    let auth = this.auth;
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
      includeRemoved: false,
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Deleting files...');
        files.map((file) => {
          drive.files.delete({
            'fileId': file.id
          }).then(delRes => {
            console.log(`${file.name} (${file.id})`);
          });
        });
        this.db.collection("filesCollection").drop();
        console.log('Database cleaned');
      } else {
        console.log('No files found.');
      }
    });
  
  }
  
  /* Function to download all uploaded files of the drive 
     Usage: node drive.js dl_all
     This function will no longer work since we need to pass the key's ID
     */
  downloadFiles(param) {
    let auth = this.auth;
    if (typeof param != "undefined") {
      console.error(`This function does not take any parameter`);
      return;
    }
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        files.map((file) => {
          downloadFile(file.id);
        });
      } else {
        console.log('No files found.');
      }
    });
  }
  
  /* Function used to call the api and download a file by Id
  */
  downloadFile(name) {
    let auth = this.auth;
    const drive = google.drive({ version: 'v3', auth });
    var crypted_dest = fs.createWriteStream(`./tmp/${name}_encrypted_download`);
    var cipherHandler = this.cipherHandler;
    this.db.collection("filesCollection").findOne({"name": name}).then(file => {
      console.log(`Downloading file ${name} with id ${file.fileId} and keyId ${file.keyId}`);  
      drive.files.get({ fileId: file.fileId, alt: 'media' }, { responseType: 'stream' },
        function (err, res) {
          res.data
            .on('end', () => {
              console.log(`Downloaded file ${file.name}`);
              var cipherKey = fs.createWriteStream(`./tmp/${file.name}.key`);
              // Launch of an API call to download the key
              drive.files.get({ fileId: file.keyId, alt: 'media' }, { responseType: 'stream' },
                function (cipherErr, cipherRes) {
                  cipherRes.data
                    .on('end', () => {
                      console.log(`Downloaded key`);
                      cipherHandler.decrypt(name,`./tmp/${name}_encrypted_download`);
                    })
                    .on('error', cipherErr => {
                      console.log('Error', err);
                    })
                    .pipe(cipherKey);
                });
            })
            .on('error', err => {
              console.log('Error', err);
            })
            .pipe(crypted_dest);
        });
    });
  }
  
}
module.exports = driveHandler;