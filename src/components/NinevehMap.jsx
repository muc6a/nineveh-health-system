import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { AppContext } from '../context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons based on score
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const greenIcon = createIcon('green');
const orangeIcon = createIcon('orange');
const redIcon = createIcon('red');
const greyIcon = createIcon('grey');
const blueIcon = createIcon('blue');

// Helper to center map on markers
function MapBounds({ establishments }) {
  const map = useMap();
  useEffect(() => {
    if (establishments && establishments.length > 0) {
      const bounds = L.latLngBounds(establishments.map(e => [e.lat, e.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView([36.34, 43.13], 10);
    }
  }, [establishments, map]);
  return null;
}

export const NinevehMap = ({ establishments, selectedSector, onSectorSelect, isTeamView = false, teamSector = '', liveTeams = [] }) => {
  const { config, teams, reports } = useContext(AppContext);
  const [showHeatmap, setShowHeatmap] = useState(false);
  // Mosul Center coordinates as default
  const defaultCenter = [36.34, 43.13];
  
  // Assign random coordinates around Mosul if not present
  const estWithCoords = establishments.map((est, i) => {
    if (est.lat && est.lng) return est;
    
    // Base coordinates for different sectors
    const baseCoords = {
      'الموصل': [36.3400, 43.1300],
      'الجانب الأيمن': [36.3400, 43.1100],
      'الزهور': [36.3600, 43.1500],
      'المصارف': [36.3800, 43.1400],
      'تلعفر': [36.3758, 42.4542],
      'سنجار': [36.3209, 41.8368],
      'البعاج': [36.0469, 41.8081],
      'الحضر': [35.5802, 42.7231]
    };
    
    const base = baseCoords[est.sector] || baseCoords['الموصل'];
    // Random jitter around base (approx 1-3km)
    const jitterLat = (Math.random() - 0.5) * 0.04;
    const jitterLng = (Math.random() - 0.5) * 0.04;
    
    return {
      ...est,
      lat: base[0] + jitterLat,
      lng: base[1] + jitterLng
    };
  });

  const activeSectorKey = teamSector === 'الجانب الأيمن' || teamSector === 'الزهور' || teamSector === 'المصارف' || teamSector === 'الغزلاني' ? 'الموصل' : teamSector;

  const filteredEsts = selectedSector && selectedSector !== 'all' 
    ? estWithCoords.filter(e => e.sector === selectedSector || (selectedSector === 'الموصل' && ['الزهور','المصارف','الجانب الأيمن'].includes(e.sector)))
    : (isTeamView && activeSectorKey ? estWithCoords.filter(e => e.sector === activeSectorKey || ['الزهور','المصارف','الجانب الأيمن'].includes(e.sector)) : estWithCoords);

  // Calculate live team locations based on their most recent inspection or report
  const computedLiveTeams = (teams || []).map(team => {
    if (team.lastLocation) {
      return {
        ...team,
        lat: team.lastLocation.lat,
        lng: team.lastLocation.lon,
        lastActive: team.lastLocation.timestamp,
        currentEst: team.lastLocation.estName
      };
    }
    
    // Fallback: Find the latest report by this team
    const teamReports = (reports || []).filter(r => r.teamId === team.id || r.teamName === team.name);
    // Sort by date descending
    teamReports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (teamReports.length > 0) {
      const latestReport = teamReports[0];
      // Find the establishment to get its coordinates
      const est = estWithCoords.find(e => e.id === latestReport.establishmentId);
      if (est) {
        return {
          ...team,
          lat: est.lat,
          lng: est.lng,
          lastActive: latestReport.date,
          currentEst: est.name
        };
      }
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="flex flex-col h-full justify-between text-right">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <MapPin className="w-5 h-5 animate-bounce" />
          <h3 className="text-sm font-black">{isTeamView ? 'الخريطة الميدانية للقطاع' : 'الخريطة التفاعلية لمحافظة نينوى'}</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-900/50">
            <input 
              type="checkbox" 
              className="accent-rose-500" 
              checked={showHeatmap} 
              onChange={() => setShowHeatmap(!showHeatmap)} 
            />
            🔥 عرض الخريطة الحرارية للمخالفات
          </label>
          <span className="text-[10px] text-slate-400 hidden md:inline">تظهر الخريطة دبابيس للمنشآت بناءً على حالتها الصحية</span>
        </div>
      </div>

      <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10" style={{ isolation: 'isolate' }}>
        <MapContainer center={defaultCenter} zoom={10} style={{ width: '100%', height: '100%', zIndex: 1 }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          />
          <MapBounds establishments={filteredEsts} />
          {filteredEsts.map(est => {
            let icon = greyIcon;
            if (est.lastInspection !== 'لم يزر بعد') {
              if (est.score >= (config.passingScore || 90)) icon = greenIcon;
              else if (est.score >= (config.warningScore || 70)) icon = orangeIcon;
              else icon = redIcon;
            }

            return (
              <Marker key={est.id} position={[est.lat, est.lng]} icon={icon}>
                <Popup className="dir-rtl">
                  <div className="text-right p-1" style={{ fontFamily: 'inherit' }}>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{est.name}</h4>
                    <p className="text-xs text-slate-600 mb-2">{est.sector} - {est.neighborhood}</p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                      {est.lastInspection === 'لم يزر بعد' ? (
                        <span className="text-slate-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3"/> لم يتم التفتيش</span>
                      ) : (
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${est.score >= (config.passingScore || 90) ? 'text-teal-600' : est.score >= (config.warningScore || 70) ? 'text-amber-600' : 'text-rose-600'}`}>
                          {est.score >= (config.passingScore || 90) ? <CheckCircle2 className="w-3 h-3"/> : <ShieldAlert className="w-3 h-3"/>}
                          تقييم: {est.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Heatmap overlay for bad scores */}
          {showHeatmap && filteredEsts.map(est => {
            if (est.lastInspection !== 'لم يزر بعد' && est.score < (config.warningScore || 70)) {
              return (
                <Circle 
                  key={`heat_${est.id}`}
                  center={[est.lat, est.lng]}
                  pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.3 }}
                  radius={600}
                />
              );
            }
            return null;
          })}
          
          {/* Render Live Team Locations based on last inspection */}
          {!isTeamView && computedLiveTeams.map(team => (
            <Marker key={`team-${team.id}`} position={[team.lat, team.lng]} icon={blueIcon} zIndexOffset={1000}>
              <Popup className="dir-rtl">
                <div className="text-right p-1" style={{ fontFamily: 'inherit' }}>
                  <h4 className="font-black text-blue-600 text-sm mb-1">📍 موقع الفريق الميداني</h4>
                  <p className="text-xs font-bold text-slate-800">{team.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">آخر نقطة تفتيش: <strong className="text-slate-700">{team.currentEst}</strong></p>
                  <p className="text-[9px] text-slate-400 mt-1 dir-ltr text-right">{new Date(team.lastActive).toLocaleString('ar-IQ')}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-teal-500"></span> ملتزم ({config.passingScore || 90}-100%)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> تحت المراقبة ({config.warningScore || 70}-{(config.passingScore || 90) - 1}%)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span> مخالف (&lt;{config.warningScore || 70}%)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-400"></span> لم يتم التفتيش</div>
        {liveTeams && liveTeams.length > 0 && (
          <div className="flex items-center gap-1 font-black text-blue-600"><span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span> فرق ميدانية نشطة</div>
        )}
      </div>
    </div>
  );
};

export default NinevehMap;
