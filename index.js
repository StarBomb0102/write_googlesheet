// const { readFile, writeFile } = require('fs');
// const { createInterface } = require('readline');
const { google } = require('googleapis');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Sheets API.
//     authorize(JSON.parse(content), writeData);
// });


// async function getCredentialsFromSecretManager(){
//     const client = new SecretManagerServiceClient();
//     const [accessResponse] = await client.accessSecretVersion({
//         name: 'projects/polished-bridge-398122/secrets/meta_cred/versions/1'
//     });
//     return accessResponse.payload.data.toString('utf8');
// }

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
// async function authorize(credentials, callback) {
//     const credentials = await getCredentialsFromSecretManager();
//     const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).installed;
    
//     const oAuth2Client = new google.auth.OAuth2(
//         client_id, client_secret, redirect_uris[0]);

//     // Check if we have previously stored a token.
//     readFile(TOKEN_PATH, (err, token) => {
//         if (err) return getNewToken(oAuth2Client, callback);
//         oAuth2Client.setCredentials(JSON.parse(token));
//         callback(oAuth2Client);
//     });
// }

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// function getNewToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         oAuth2Client.getToken(code, (err, token) => {
//             if (err) return console.error('Error while trying to retrieve access token', err);
//             oAuth2Client.setCredentials(token);
//             // Store the token to disk for later program executions
//             writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//                 if (err) return console.error(err);
//                 console.log('Token stored to', TOKEN_PATH);
//             });
//             callback(oAuth2Client);
//         });
//     });
// }

/**
 * Writes data to our Google sheet
 */
async function writeData() {
    const client = new SecretManagerServiceClient();
    const [accessResponse] = await client.accessSecretVersion({
        name: 'projects/polished-bridge-398122/secrets/meta_cred/versions/1'
    })
    const payload = accessResponse.payload.data.toString('utf8');
    const credentials = JSON.parse(payload);

    const sheets = google.sheets({ version: 'v4', credentials });
    let values = [
        [
            'Chris',
            'Male',
            '4. Senior',
            'FL',
            'Art',
            'Baseball'
        ],
    ];
    const resource = {
        values,
    };
    sheets.spreadsheets.values.append({
        spreadsheetId: '1XnbJ5JHeJS2KsTzz6wXtwASb5mkwkICn_XP_pDJIyTA',
        range: 'Class Data!A1',
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
        }
    });
}

writeData();