import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogOut, Camera, ShieldAlert, CheckCircle2, MapPin, X } from 'lucide-react';

export const TrackerDashboard = () => {
  const { user, establishments, closureVerifications, setClosureVerifications, navigate, notify } = useContext(AppContext);
  const [selectedEst, setSelectedEst] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLog, setLocationLog] = useState('');
  const [liveLocation, setLiveLocation] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fallback to team's sector or default
  const trackerSector = user?.linkedTeamSector || 'الجانب الأيسر';

  // Find establishments closed by this team (score < 70)
  const closedEstablishments = establishments.filter(e => 
    e.sector === trackerSector && e.lastInspection !== 'لم يزر بعد' && e.score < 70
  );

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Get Location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);
            setLiveLocation({ lat, lon });
            setLocationLog(`${lat}° N, ${lon}° E`);
          },
          (error) => {
            console.error(error);
            const mockLat = (36.3489 + (Math.random() - 0.5) * 0.02).toFixed(6);
            const mockLon = (43.1578 + (Math.random() - 0.5) * 0.02).toFixed(6);
            setLiveLocation({ lat: mockLat, lon: mockLon });
            setLocationLog(`${mockLat}° N, ${mockLon}° E (محاكاة)`);
          }
        );
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      notify('تعذر الوصول للكاميرا. يرجى التأكد من الصلاحيات.', 'error');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUrl);
      
      // Stop stream
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
    }
  };

  const cancelCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setSelectedEst(null);
  };

  const submitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newVerification = {
        id: `ver_${Date.now()}`,
        trackerId: user.id,
        trackerName: user.name,
        estId: selectedEst.id,
        estName: selectedEst.name,
        photo: capturedPhoto,
        location: liveLocation,
        locationLog,
        date: new Date().toISOString()
      };
      
      setClosureVerifications([newVerification, ...closureVerifications]);
      notify('تم رفع تقرير المتابعة بنجاح وإرساله للمديرية!', 'success', true);
      
      setIsSubmitting(false);
      setCapturedPhoto(null);
      setSelectedEst(null);
    }, 1500);
  };

  if (user?.role !== 'tracker') {
    return <div className="p-8 text-center text-white">غير مصرح لك بالدخول</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-cairo dir-rtl">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h1 className="font-black text-sm text-slate-800 dark:text-white">فريق متابعة الإغلاق</h1>
              <p className="text-[10px] text-slate-500 font-bold">{user.name} - {trackerSector}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => navigate('/login')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4">قائمة المنشآت المغلقة ({closedEstablishments.length})</h2>
        
        <div className="space-y-4">
          {closedEstablishments.length === 0 ? (
            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">لا توجد منشآت مغلقة حالياً في قطاعك</h3>
            </div>
          ) : (
            closedEstablishments.map(est => (
              <div key={est.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-rose-200 dark:border-rose-900/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white">{est.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{est.neighborhood}</p>
                    <p className="text-[10px] text-rose-500 font-bold mt-1">التقييم: {est.score}% - مُغلق</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEst(est);
                      startCamera();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20"
                  >
                    <Camera className="w-4 h-4" />
                    التحقق من الإغلاق
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Camera/Verification Modal */}
      {(isCameraOpen || capturedPhoto) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-4 rounded-3xl text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-amber-500">توثيق إغلاق: {selectedEst?.name}</h3>
              <button onClick={() => { setCapturedPhoto(null); cancelCamera(); }} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!capturedPhoto ? (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button 
                  onClick={capturePhoto}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-slate-300 shadow-xl flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-rose-500 rounded-full animate-pulse"></div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700">
                  <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
                  <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm p-3 text-[10px] text-slate-300 font-mono text-left" dir="ltr">
                    <p>{new Date().toLocaleString('en-US')}</p>
                    <p className="text-amber-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {locationLog}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setCapturedPhoto(null); startCamera(); }}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs"
                    disabled={isSubmitting}
                  >
                    إعادة الالتقاط
                  </button>
                  <button 
                    onClick={submitVerification}
                    className="flex-[2] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg flex justify-center items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري رفع التقرير...' : 'تأكيد وإرسال للمديرية'}
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};
