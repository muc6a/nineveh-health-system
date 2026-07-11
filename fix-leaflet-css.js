const fs = require('fs');
let main = fs.readFileSync('src/main.jsx', 'utf8');
if (!main.includes('leaflet/dist/leaflet.css')) {
  main = "import 'leaflet/dist/leaflet.css';\n" + main;
  fs.writeFileSync('src/main.jsx', main);
}
