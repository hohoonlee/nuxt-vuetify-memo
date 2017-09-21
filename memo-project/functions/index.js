const functions = require('firebase-functions')
const admin 	= require('firebase-admin')
const sheets	= require('./sheets')

admin.initializeApp(functions.config().firebase);

function memoHandler(e) {
	let msg = e.data.val();
	if(!msg) {
		msg = {
			id:e.params.key,
			memo:''
		}
	}
	console.log('event', e, msg);
	sheets.insertLog(e.eventType, e.params.uid, msg.id, msg.memo);
}

exports.select = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).send('Forbidden!');
		return;
	}

	const key = 'notes/'
	admin.database().ref(key).once('value', (snapshot)=>{
		console.log('value:', snapshot.val());
		res.status(200).send(JSON.stringify(snapshot.val()));
	});
});

exports.createMemo = functions.database.ref('/notes/{uid}/{key}').onCreate(memoHandler);
exports.updateMemo = functions.database.ref('/notes/{uid}/{key}').onUpdate(memoHandler);
exports.deleteMemo = functions.database.ref('/notes/{uid}/{key}').onDelete(memoHandler);