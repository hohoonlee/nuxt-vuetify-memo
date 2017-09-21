const fs = require('fs')
const google = require('googleapis')
const config = require('./auth_key.json');
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
	config.web.client_id,
	config.web.client_secret,
	config.web.redirect_uris[1]
);

oauth2Client.setCredentials({
	access_token: config.web.access_token,
	refresh_token: config.web.refresh_token
});

const sheets = google.sheets('v4')
function insertLog(type, uid, id, memo) {
	sheets.spreadsheets.values.append({
		auth: oauth2Client,
		spreadsheetId: 문서명,
		valueInputOption: 'USER_ENTERED',
		range: 시트명,
		resource: {
			values: [
				[new Date(), type, uid, id, memo]
			]
		}
		}, function(err, response) {
			console.log(err, response)
		}
	);
}

exports.insertLog = insertLog