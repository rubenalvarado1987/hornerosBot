// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const serviceAccount = {
  "type": "service_account",
  "project_id": "horneros",
  "private_key_id": "23615e7752f2df6ff4200df493cbf9f10d174c1a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxxGR9iRYh9iQ8\npamKx/Vs5ypMbi17WurO3Tdh/sBh60hEmwTDpE4Jm6zZNbNMolzUhAhvF1Gb19WC\nR6yirPBl9Fv//bA/mwWRFThqQ6F9CLF3JnDTm9tamIIhlFDTmd2y89A+tE4rqwnU\n9StG9IF6uP9ZEh+IQEmyGw7v9ko2Obcb3yfk0X6oSsJ+XuyLfLQMCeZUerdDOmMi\nf2BIi+ixTzVE/fvj6vPM5fKtqdxhR9luZGqXBbF/yFjs+zWBMUb6eG0eoPVhlpKQ\nJ4ZFmorbpCU4A3Wp23XUfvZi8rB6s++9t4oTDQ2R2Bnzd5Jxmuzdc4eVSpd9wPvX\nQolCUqpzAgMBAAECggEAOW/CJEmBzDFSXgIMuJmI88nxAcbrjRrAGVyig1gjYr/5\nlqkbrfbNfA8/luLh7tXa9pM+gl5fcOIYy0JLRjhoaBi/DQQzySlWcB0SIEt/xv1j\nEaNq+wQ1qJz0FtNsFiJ13lcmpsvtIfDeeV9Jv2BK4ZMadfYEGCrlZNWXSvMh4UjU\nJGua5nL5CkFWAwQVAFoXsoPsNIamsPaJefXsRg/UX1yw6l8p91NvGtnoeT2mLOSs\nGOEjqx8R9Y+jF4BUI1S+2TTDsc0Myf6VDD+zjhIP4rZxZGVo2g/0Zz5HcTrZF67E\nVBRs2uvJ7GyNdNj5pAHBxBs2AvCXczVEgbfWdicZ4QKBgQDqsqUBvqJ9O3F4vg1I\nWaHgbkJGqzFhmLHsJj0V78iz9NJYMIe/uBVU9UUls28jOdvZCrBZXt4Mx/H3X8C/\nCWDKqYO5zWlVkv/k7IeIwWgNjzgFd53l54WNwX+jE4AruRNcF6VPNSPxYCzitWmb\noGnci6vLXWzwbGNJFhOvLkn0kQKBgQDB5u1Wz0Wn4sqoArbtzcl3FhbZ3i5GcyjL\nH7aaVSJlMIlJ2beHD6kZ0+FR1GYuSOmKl7LNpY7XIwFy6S2Bxqo+XnoTVtFi6RW0\nXPORp5OO88bInFj5IKNGcblm+WOewUQpqPCAGbwgSjSISX+QvmlYHCNsHB/sfU53\n+XsQN1dgwwKBgQDfFKDc0Ku4J0lLADK142SHY6Yhb9VHNBFiKlKDyGBYFMvewXo2\nlC3KjDuGg1CPBg7e9Vb8C706Hs7yWBRoQOy8lXW8pO+LRGdw3BZTuapCwS/5mmH+\nRhtey16bzgxVAtzQ+zTI3fTlGIpxjwfrwgT9edD4QzwqJowUyyQ4reHj0QKBgQCB\nbUQk+sty6bX9+XnjN8ZvX+Y23NAkpD+pfeykDYmc443wJowTcgecvsoaldzyriZ9\nJQ7rp8O1pJ8V9cEza8k9QlDX0c6H6C9dqeHG6oVbGSspwvq8p+V0YvqvWm39jOGT\nsTl/OC5Tm1R/WBf3JLIqZvXZ9tf0Qhv7hyJ2y4negwKBgDcYSBAHwFihaC5Z4QZ+\ncRTfmyEbMIuuuzzy1lWAdOnhkBpm5HUM2xtvCRGoKbvrJz/7iOqSnpM0Di2L3HFR\nft/O45c0TMUvHP1r2vIiuv8nahgw67Uh/N50pl6RTNP4p30Cq/xFIP5LAhCzMAJ6\n1Ps479b2jGy222OttHzeN5M7\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-s3wdp@horneros.iam.gserviceaccount.com",
  "client_id": "110569823568545658765",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s3wdp%40horneros.iam.gserviceaccount.com"
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://horneros-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function getFromFireBase(agent) {
    let Rut = agent.parameters["Rut"];
    return admin.database().ref(Rut).once("value").then((snapshot) => {
        console.log("resultado snapshot");
    	console.log(snapshot);
    	var info = snapshot.val();
      	try{
          	agent.add("Hola " + info.Nombre + " " + info.Apellido + ", nos complace informarte que tienes un total de " + info.Dias + " Día" + (parseFloat(info.Dias) > 1 ? "s" : "") + " libres"); 
        }catch(e){
        	console.log("excepcion generada", e);
          	agent.add("No encontramos registros en nuestros sistema para este Documento");
        }
    });
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Tramites.consultar', getFromFireBase);
  agent.handleRequest(intentMap);
});
