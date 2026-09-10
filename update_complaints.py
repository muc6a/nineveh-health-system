import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add complaintTab state
if "const [complaintTab" not in content:
    content = content.replace("const [isSidebarOpen", "const [complaintTab, setComplaintTab] = useState(hasPerm('showPublicEvalsPage') ? 'citizens' : 'delivery');\n  const [isSidebarOpen")

# 2. Replace the whole complaints render block
old_complaints = """        ) : activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) ? (
          <div className="grid grid-cols-1 gap-6 items-start">
            {/* Public Evals / Complaints List */}
            <div className="glassmorphic-card p-5 border border-slate-700/60 bg-slate-900 rounded-3xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 text-right">
                <h3 className="text-sm font-black text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  سجل شكاوى المواطنين وبلاغاتهم
                </h3>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-right custom-scrollbar">
                {/* Active Complaints */}
                {(reports || []).filter(r => !r.isDelivery && !r.forwarded).length > 0 ? (
                  (reports || []).filter(r => !r.isDelivery && !r.forwarded).map((comp, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-red-500/20 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-black text-white">{comp.establishmentName}</h4>
                          <span className="text-[10px] text-slate-400">القطاع: {comp.sector}</span>
                        </div>
                        <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full border border-red-500/20">
                          {comp.date || 'تاريخ غير محدد'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-bold bg-slate-900 p-3 rounded-xl border border-slate-700 mt-2">
                        {comp.details}
                      </p>
                      {comp.evidenceImage && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                          <Camera className="w-3.5 h-3.5" />
                          مرفق صورة إثبات المخالفة ({comp.evidenceImage})
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRedirectComplaint(comp)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-500/30"
                        >
                          <Send className="w-4 h-4" />
                          إعادة توجيه للفريق
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد شكاوى جديدة معلقة</div>
                )}

                {/* Archived Complaints */}
                {(reports || []).filter(r => !r.isDelivery && r.forwarded).length > 0 && (
                  <div className="mt-8 pt-4 border-t border-slate-700/50">
                    <h4 className="text-xs font-black text-slate-500 mb-4 flex items-center gap-2">
                      <Archive className="w-4 h-4" />
                      أرشيف الشكاوى المحالة (آخر 30 يوم)
                    </h4>
                    <div className="space-y-4 opacity-75">
                      {(reports || []).filter(r => !r.isDelivery && r.forwarded).map((comp, idx) => {
                        const forwardedDate = new Date(comp.forwardedAt || comp.date || comp.timestamp || Date.now());
                        const isRecent = (new Date() - forwardedDate) < 30 * 24 * 60 * 60 * 1000;
                        if (!isRecent) return null;
                        return (
                          <div key={`arch-${idx}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-sm font-black text-slate-300">{comp.establishmentName}</h4>
                                <span className="text-[10px] text-slate-500">القطاع: {comp.sector}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-500 text-[10px] font-bold">
                                  ✓ تمت الإحالة
                                </span>
                                <span className="text-slate-500 text-[9px]">
                                  {comp.forwardedAt ? new Date(comp.forwardedAt).toLocaleDateString('ar-IQ') : ''}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">
                              {comp.details}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}"""

new_complaints = """        ) : activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) ? (
          <div className="grid grid-cols-1 gap-6 items-start">
            <div className="glassmorphic-card p-5 border border-slate-700/60 bg-slate-900 rounded-3xl">
              
              {/* Complaints Tabs */}
              <div className="flex border-b border-slate-700 mb-6 pb-2 justify-start gap-4">
                {hasPerm('showPublicEvalsPage') && (
                  <button 
                    onClick={() => setComplaintTab('citizens')}
                    className={`pb-2 text-sm font-bold transition-all border-b-2 ${complaintTab === 'citizens' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    شكاوى المواطنين
                  </button>
                )}
                {hasPerm('showDeliveryPage') && (
                  <button 
                    onClick={() => setComplaintTab('delivery')}
                    className={`pb-2 text-sm font-bold transition-all border-b-2 ${complaintTab === 'delivery' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    شكاوى خدمة التوصيل
                  </button>
                )}
              </div>

              {complaintTab === 'citizens' && hasPerm('showPublicEvalsPage') && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-right custom-scrollbar">
                  {/* Active Complaints */}
                  {(reports || []).filter(r => !r.isDelivery && !r.forwarded).length > 0 ? (
                    (reports || []).filter(r => !r.isDelivery && !r.forwarded).map((comp, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-red-500/20 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-black text-white">{comp.establishmentName}</h4>
                            <span className="text-[10px] text-slate-400">القطاع: {comp.sector}</span>
                          </div>
                          <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full border border-red-500/20">
                            {comp.date || 'تاريخ غير محدد'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-bold bg-slate-900 p-3 rounded-xl border border-slate-700 mt-2">
                          {comp.details}
                        </p>
                        {comp.evidenceImage && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                            <Camera className="w-3.5 h-3.5" />
                            مرفق صورة إثبات المخالفة ({comp.evidenceImage})
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleRedirectComplaint(comp)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-500/30"
                          >
                            <Send className="w-4 h-4" />
                            إعادة توجيه للفريق
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد شكاوى جديدة معلقة</div>
                  )}

                  {/* Archived Complaints */}
                  {(reports || []).filter(r => !r.isDelivery && r.forwarded).length > 0 && (
                    <div className="mt-8 pt-4 border-t border-slate-700/50">
                      <h4 className="text-xs font-black text-slate-500 mb-4 flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        أرشيف الشكاوى المحالة (آخر 30 يوم)
                      </h4>
                      <div className="space-y-4 opacity-75">
                        {(reports || []).filter(r => !r.isDelivery && r.forwarded).map((comp, idx) => {
                          const forwardedDate = new Date(comp.forwardedAt || comp.date || comp.timestamp || Date.now());
                          const isRecent = (new Date() - forwardedDate) < 30 * 24 * 60 * 60 * 1000;
                          if (!isRecent) return null;
                          return (
                            <div key={`arch-${idx}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 relative overflow-hidden">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-sm font-black text-slate-300">{comp.establishmentName}</h4>
                                  <span className="text-[10px] text-slate-500">القطاع: {comp.sector}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-emerald-500 text-[10px] font-bold">
                                    ✓ تمت الإحالة
                                  </span>
                                  <span className="text-slate-500 text-[9px]">
                                    {comp.forwardedAt ? new Date(comp.forwardedAt).toLocaleDateString('ar-IQ') : ''}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 font-medium">
                                {comp.details}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {complaintTab === 'delivery' && hasPerm('showDeliveryPage') && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-right custom-scrollbar">
                  {/* Active Delivery Complaints */}
                  {(reports || []).filter(r => r.isDelivery && !r.forwarded).length > 0 ? (
                    (reports || []).filter(r => r.isDelivery && !r.forwarded).map((comp, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-amber-500/20 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-black text-white">{comp.deliveryCompanyName || 'شركة توصيل غير محددة'}</h4>
                            <span className="text-[10px] text-slate-400">القطاع: {comp.sector || 'غير محدد'}</span>
                          </div>
                          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-500/20">
                            {comp.date || 'تاريخ غير محدد'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-bold bg-slate-900 p-3 rounded-xl border border-slate-700 mt-2">
                          {comp.details}
                        </p>
                        {comp.evidenceImage && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                            <Camera className="w-3.5 h-3.5" />
                            مرفق صورة إثبات المخالفة ({comp.evidenceImage})
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleRedirectComplaint(comp)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-500/30"
                          >
                            <Send className="w-4 h-4" />
                            إعادة توجيه للفريق
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد شكاوى توصيل جديدة معلقة</div>
                  )}

                  {/* Archived Delivery Complaints */}
                  {(reports || []).filter(r => r.isDelivery && r.forwarded).length > 0 && (
                    <div className="mt-8 pt-4 border-t border-slate-700/50">
                      <h4 className="text-xs font-black text-slate-500 mb-4 flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        أرشيف شكاوى التوصيل المحالة
                      </h4>
                      <div className="space-y-4 opacity-75">
                        {(reports || []).filter(r => r.isDelivery && r.forwarded).map((comp, idx) => {
                          const forwardedDate = new Date(comp.forwardedAt || comp.date || comp.timestamp || Date.now());
                          const isRecent = (new Date() - forwardedDate) < 30 * 24 * 60 * 60 * 1000;
                          if (!isRecent) return null;
                          return (
                            <div key={`arch-del-${idx}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 relative overflow-hidden">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-sm font-black text-slate-300">{comp.deliveryCompanyName || 'شركة توصيل'}</h4>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-emerald-500 text-[10px] font-bold">
                                    ✓ تمت الإحالة
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 font-medium">
                                {comp.details}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}"""

content = content.replace(old_complaints, new_complaints)

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
