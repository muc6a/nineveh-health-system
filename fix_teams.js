import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBQmCciaNSDdCQ6vA6PgcjUThPFtx7TMSE",
  authDomain: "nineveh-health.firebaseapp.com",
  projectId: "nineveh-health",
  storageBucket: "nineveh-health.firebasestorage.app",
  messagingSenderId: "352779322862",
  appId: "1:352779322862:web:333704a2bbb58c2483faff",
  measurementId: "G-NB4LKYNLK8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'prototype_state/teams_v2');

get(dbRef).then((snapshot) => {
  let teams = snapshot.val() || [];
  const baajTeam = {
    "active": true,
    "email": "baaj@test.com",
    "id": "team_baaj_restored",
    "members": {
      "assistants": ["مساعد البعاج"],
      "doctors": ["د. طبيب البعاج"],
      "technicians": ["فني البعاج"]
    },
    "name": "فريق قضاء البعاج",
    "password": "123",
    "permissions": {
      "addEval": true,
      "createEst": true,
      "deleteEst": false,
      "editEst": true,
      "manageEstablishments": true,
      "replyDirective": true,
      "sendDirective": true,
      "showDeliveryPage": true,
      "showDirectivesPage": true,
      "showMainDashboard": true,
      "showPublicEvalsPage": true,
      "showReportsPage": true
    },
    "phone": "07701112222",
    "sector": "قضاء البعاج",
    "username": "baaj"
  };
  
  if (!teams.find(t => t.name.includes('البعاج'))) {
    teams.push(baajTeam);
    set(dbRef, teams).then(() => {
      console.log('Successfully restored Baaj team');
      process.exit(0);
    });
  } else {
    console.log('Baaj team already exists');
    process.exit(0);
  }
});
