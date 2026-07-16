import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Trash2, Plus, Users, MapPin, Briefcase, Mail, Phone, Lock, User, Edit3, CheckSquare, Square, Clock, PenLine } from 'lucide-react';
import { ROLES_DICTIONARY, NINEVEH_GEOGRAPHY } from '../utils/constants';

export const AccountModal = ({ isOpen, onClose, initialData, onSave, mode = 'add', accountType = 'team', teams = [] }) => {
  // Common State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Director Specific State
  const [directorTitle, setDirectorTitle] = useState('');
  const [directorScopeMode, setDirectorScopeMode] = useState('all'); // 'all' or 'sector'
  
  // Sector Selection State (For both Team and Director Geo-Scope)
  const [sectorType, setSectorType] = useState('mosul'); // 'mosul' or 'district'
  const [mosulSide, setMosulSide] = useState('right');
  const [districtId, setDistrictId] = useState('');
  
  // Team Specific Geo State
  const [selectionMode, setSelectionMode] = useState('all'); // 'all' or 'custom'
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);

  // Tracker Specific State
  const [linkedTeamSector, setLinkedTeamSector] = useState('');

  // Team Members State (Object array: { name, title })
  const [doctors, setDoctors] = useState([{ name: '', title: 'الطبيب / المفتش المسؤول' }]);
  const [assistants, setAssistants] = useState([{ name: '', title: 'ملاحظ فني / مدقق' }]);

  // Team Smart Edit Settings
  const [editTimeWindow, setEditTimeWindow] = useState('open'); // 'open', '1h', '5h', '24h'
  const [editOneTimeOnly, setEditOneTimeOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setEmail(initialData.email || '');
        setPhone(initialData.phone || '');
        setUsername(initialData.username || '');
        setPassword(initialData.password || '');
        
        if (accountType === 'director') {
          setDirectorTitle(initialData.title || '');
          if (initialData.sector === 'الكل' || !initialData.sector) {
            setDirectorScopeMode('all');
          } else {
            setDirectorScopeMode('sector');
            // Parse logic for edit omitted for brevity, default to mosul right
            setSectorType('mosul');
            setMosulSide('right');
          }
        }

        if (accountType === 'team' && initialData.members) {
          // If old data is array of strings, convert to objects
          const mapToObj = (arr, defaultTitle) => arr?.length ? (typeof arr[0] === 'string' ? arr.map(a => ({ name: a, title: defaultTitle })) : arr) : [{ name: '', title: defaultTitle }];
          setDoctors(mapToObj(initialData.members.doctors, 'الطبيب / المفتش المسؤول'));
          setAssistants(mapToObj(initialData.members.assistants, 'ملاحظ فني / مدقق'));
          
          if (initialData.sector) {
             setSelectionMode('all');
          }
          if (initialData.editSettings) {
             setEditTimeWindow(initialData.editSettings.window || 'open');
             setEditOneTimeOnly(!!initialData.editSettings.oneTimeOnly);
          }
        }
        
        if (accountType === 'tracker') {
          setLinkedTeamSector(initialData.linkedTeamSector || initialData.sector || '');
        }
      } else {
        // Reset form
        setName(''); setEmail(''); setPhone(''); setUsername(''); setPassword('');
        setDirectorTitle('');
        setDirectorScopeMode('all');
        setSectorType('mosul'); setMosulSide('right'); setDistrictId('');
        setSelectionMode('all'); setSelectedNeighborhoods([]);
        setDoctors([{ name: '', title: 'الطبيب / المفتش المسؤول' }]);
        setAssistants([{ name: '', title: 'ملاحظ فني / مدقق' }]);
        setEditTimeWindow('open');
        setEditOneTimeOnly(false);
        setLinkedTeamSector('');
      }
    }
  }, [isOpen, initialData, accountType]);

  if (!isOpen) return null;

  const handleArrayChange = (setter, array, index, field, value) => {
    const newArr = [...array];
    newArr[index] = { ...newArr[index], [field]: value };
    setter(newArr);
  };

  const addField = (setter, array, defaultTitle) => setter([...array, { name: '', title: defaultTitle }]);
  const removeField = (setter, array, index) => {
    if (array.length > 1) {
      const newArr = [...array];
      newArr.splice(index, 1);
      setter(newArr);
    }
  };

  const toggleNeighborhood = (hood) => {
    if (selectedNeighborhoods.includes(hood)) {
      setSelectedNeighborhoods(prev => prev.filter(h => h !== hood));
    } else {
      setSelectedNeighborhoods(prev => [...prev, hood]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'add' && !password) {
      alert('يرجى تعيين كلمة مرور للحساب.');
      return;
    }

    let calculatedSector = '';
    
    if (accountType === 'director' && directorScopeMode === 'all') {
      calculatedSector = 'الكل'; // Full Province Access
    } else {
      if (sectorType === 'mosul') {
        const sideName = mosulSide === 'right' ? 'الجانب الأيمن' : 'الجانب الأيسر';
        if (accountType === 'team' && selectionMode === 'custom' && selectedNeighborhoods.length > 0) {
          calculatedSector = `${sideName} - ${selectedNeighborhoods.join('، ')}`;
        } else {
          calculatedSector = sideName; // All
        }
      } else {
        const district = NINEVEH_GEOGRAPHY.districts.find(d => d.id === districtId);
        if (accountType === 'team' && selectionMode === 'custom' && selectedNeighborhoods.length > 0) {
          calculatedSector = `${district?.label || ''} - ${selectedNeighborhoods.join('، ')}`;
        } else {
          calculatedSector = district?.label || '';
        }
      }
    }

    const result = {
      ...initialData,
      name,
      email,
      phone,
      username,
      active: true,
      sector: calculatedSector
    };

    if (password) result.password = password;

    if (accountType === 'director') {
      const matchedRole = ROLES_DICTIONARY.find(r => r.label === directorTitle);
      result.title = directorTitle;
      result.role = matchedRole ? matchedRole.id : 'director_custom';
      result.isDirector = true;
      result.isTeam = false;
    } else if (accountType === 'team') {
      result.title = 'فريق رقابي ميداني';
      result.role = 'field_team';
      result.isTeam = true;
      result.isDirector = false;
      result.members = {
        doctors: doctors.filter(d => d.name.trim() !== ''),
        assistants: assistants.filter(a => a.name.trim() !== '')
      };
      result.editSettings = {
        window: editTimeWindow,
        oneTimeOnly: editOneTimeOnly
      };
    } else if (accountType === 'tracker') {
      result.role = 'tracker';
      result.linkedTeamSector = linkedTeamSector;
    }

    onSave(result);
  };

  const renderNeighborhoodCheckboxes = () => {
    let list = [];
    if (sectorType === 'mosul') {
      list = NINEVEH_GEOGRAPHY.mosul.sides[mosulSide].neighborhoods;
    } else if (districtId) {
      list = NINEVEH_GEOGRAPHY.districts.find(d => d.id === districtId)?.subdistricts || [];
    }

    if (list.length === 0) return null;

    return (
      <div className="mt-5 p-4 bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-white/5 max-h-48 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2 text-xs custom-scrollbar">
        {list.map(hood => {
          const isSelected = selectedNeighborhoods.includes(hood);
          return (
            <div 
              key={hood} 
              onClick={() => toggleNeighborhood(hood)}
              className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all duration-300 border shadow-sm ${isSelected ? 'bg-teal-500/20 border-teal-500/40 text-teal-600 dark:text-teal-300 shadow-[inset_0_0_15px_rgba(45,212,191,0.1)]' : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}
            >
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                {isSelected ? <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]" /> : <Square className="w-4 h-4" />}
              </div>
              <span className="truncate flex-1 select-none font-bold">{hood}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGeoSelection = () => (
    <div className="space-y-5 bg-slate-100/40 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
      <div className="flex flex-wrap gap-4 mb-2">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
          <input type="radio" name="sectorType" value="mosul" checked={sectorType === 'mosul'} onChange={(e) => { setSectorType('mosul'); setSelectedNeighborhoods([]); }} className="accent-teal-500 w-4 h-4" />
          قضاء الموصل (المركز)
        </label>
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
          <input type="radio" name="sectorType" value="district" checked={sectorType === 'district'} onChange={(e) => { setSectorType('district'); setSelectedNeighborhoods([]); }} className="accent-teal-500 w-4 h-4" />
          الأقضية والنواحي
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {sectorType === 'mosul' ? (
          <select value={mosulSide} onChange={(e) => { setMosulSide(e.target.value); setSelectedNeighborhoods([]); }} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner">
            <option value="right">الجانب الأيمن</option>
            <option value="left">الجانب الأيسر</option>
          </select>
        ) : (
          <select value={districtId} onChange={(e) => { setDistrictId(e.target.value); setSelectedNeighborhoods([]); }} required className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner">
            <option value="">اختر القضاء</option>
            {NINEVEH_GEOGRAPHY.districts.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        )}
      </div>

      {accountType === 'team' && (
        <div className="mt-4 pt-5 border-t border-white/5">
          <div className="flex flex-wrap gap-4 mb-2">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
              <input type="radio" name="selectionMode" value="all" checked={selectionMode === 'all'} onChange={(e) => setSelectionMode('all')} className="accent-teal-500 w-4 h-4" />
              اختيار الكل (كامل النطاق)
            </label>
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
              <input type="radio" name="selectionMode" value="custom" checked={selectionMode === 'custom'} onChange={(e) => setSelectionMode('custom')} className="accent-teal-500 w-4 h-4" />
              تحديد مخصص (اختيار أحياء محددة)
            </label>
          </div>
          {selectionMode === 'custom' && renderNeighborhoodCheckboxes()}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative text-right max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/50 dark:bg-slate-900/40 sticky top-0 z-20 backdrop-blur-sm">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 flex items-center gap-3 drop-shadow-md">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-purple-600 dark:text-purple-400 shadow-inner">
              {accountType === 'director' ? <Briefcase className="w-5 h-5"/> : <Users className="w-5 h-5"/>}
            </div>
            {mode === 'add' 
              ? (accountType === 'director' ? 'إضافة حساب مدير/قيادة' : 'إضافة حساب ميداني') 
              : 'تعديل بيانات الحساب'
            }
          </h3>
          <button onClick={onClose} className="flex p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all items-center justify-center group shadow-sm border border-slate-200 dark:border-white/5">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8 text-sm font-bold text-right">
          
          {/* TEAM FLOW */}
          {accountType === 'team' && (
            <>
              {/* 1. Location */}
              <div className="space-y-2">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 1. تحديد الموقع وتوزيع الأحياء</label>
                {renderGeoSelection()}
              </div>

              {/* 2. Team Name */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><Users className="w-4 h-4"/> 2. اسم اللجنة الرقابية</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: لجنة الرقابة الصحية الأولى" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner" />
              </div>

              {/* 3. Members */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><User className="w-4 h-4"/> 3. إدارة أعضاء الفريق والمسميات</label>
                <div className="bg-slate-100/40 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
                  <div>
                    <label className="text-slate-400 block mb-3 text-xs font-semibold">الأطباء والمفتشون المسؤولون</label>
                    {doctors.map((doc, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">اسم العضو</label>
                          <input type="text" placeholder="الاسم الرباعي واللقب" value={doc.name} onChange={(e) => { const newDocs = [...doctors]; newDocs[idx].name = e.target.value; setDoctors(newDocs); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-teal-500 shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">المسمى الوظيفي المخصص</label>
                          <div className="relative">
                            <input type="text" placeholder="مثال: رئيس اللجنة" value={doc.title} onChange={(e) => { const newDocs = [...doctors]; newDocs[idx].title = e.target.value; setDoctors(newDocs); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-teal-500 shadow-inner pr-8" />
                            <PenLine className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5" />
                          </div>
                        </div>
                        {doctors.length > 1 && (
                          <button type="button" onClick={() => setDoctors(doctors.filter((_, i) => i !== idx))} className="md:absolute md:left-2 md:-top-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors self-end md:self-auto border border-red-500/20 opacity-0 group-hover:opacity-100">
                            <X className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setDoctors([...doctors, { name: '', title: 'طبيب / مفتش' }])} className="text-teal-600 dark:text-teal-400 text-xs font-black hover:text-teal-300 flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> إضافة عضو آخر
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="text-slate-400 block mb-3 text-xs font-semibold">الكوادر الساندة (ملاحظين / مدققين)</label>
                    {assistants.map((ast, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">اسم العضو</label>
                          <input type="text" placeholder="الاسم الرباعي" value={ast.name} onChange={(e) => { const newAst = [...assistants]; newAst[idx].name = e.target.value; setAssistants(newAst); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-teal-500 shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">المسمى الوظيفي المخصص</label>
                          <div className="relative">
                            <input type="text" placeholder="مثال: ملاحظ فني" value={ast.title} onChange={(e) => { const newAst = [...assistants]; newAst[idx].title = e.target.value; setAssistants(newAst); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-teal-500 shadow-inner pr-8" />
                            <PenLine className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5" />
                          </div>
                        </div>
                        {assistants.length > 1 && (
                          <button type="button" onClick={() => setAssistants(assistants.filter((_, i) => i !== idx))} className="md:absolute md:left-2 md:-top-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors self-end md:self-auto border border-red-500/20 opacity-0 group-hover:opacity-100">
                            <X className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setAssistants([...assistants, { name: '', title: 'ملاحظ فني / مدقق' }])} className="text-teal-600 dark:text-teal-400 text-xs font-black hover:text-teal-300 flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> إضافة عضو آخر
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Smart Edit Control (Flexible Edit) */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><Clock className="w-4 h-4"/> 4. قيود تعديل التقييمات (التعديل الذكي)</label>
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-xs block font-semibold">الفترة الزمنية المسموحة للتعديل بعد الحفظ</label>
                    <select value={editTimeWindow} onChange={(e) => setEditTimeWindow(e.target.value)} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 shadow-inner">
                      <option value="open">مفتوح (لا يوجد قيد زمني)</option>
                      <option value="1h">ساعة واحدة فقط</option>
                      <option value="5h">5 ساعات</option>
                      <option value="24h">24 ساعة</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-900/60 transition-colors">
                    <input type="checkbox" checked={editOneTimeOnly} onChange={(e) => setEditOneTimeOnly(e.target.checked)} className="w-4 h-4 accent-teal-500 rounded" />
                    <span className="text-sm font-semibold text-slate-300">السماح بتعديل النموذج لمرة واحدة فقط</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* DIRECTOR FLOW */}
          {accountType === 'director' && (
            <>
              {/* 1. Name */}
              <div className="space-y-2">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><User className="w-4 h-4"/> 1. الاسم الكامل للقيادي</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: د. أحمد صالح الجبوري" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500" />
              </div>

              {/* 2. Job Title (Open Field / Datalist) */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><Briefcase className="w-4 h-4"/> 2. المسمى الوظيفي / المنصب (قابل للتعديل)</label>
                <input 
                  type="text" 
                  list="roles-list"
                  required 
                  value={directorTitle} 
                  onChange={(e) => setDirectorTitle(e.target.value)} 
                  placeholder="مثال: مدير قسم الصحة العامة" 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500" 
                />
                <datalist id="roles-list">
                  {ROLES_DICTIONARY.filter(r => r.category === 'المدراء والقيادات' || r.category === 'الإدارة العليا' || r.category === 'الإدارة الوسطى').map(role => (
                    <option key={role.id} value={role.label} />
                  ))}
                </datalist>
                <p className="text-[10px] text-slate-400 mt-1">يمكنك اختيار منصب من القائمة أو كتابة منصب جديد يدوياً لتخصيص الإدارة.</p>
              </div>

              {/* 3. Scope of Authority */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 3. الربط الجغرافي ونطاق الصلاحية التقنية</label>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold">
                    <input type="radio" name="directorScopeMode" value="all" checked={directorScopeMode === 'all'} onChange={(e) => setDirectorScopeMode('all')} className="accent-teal-500 w-4 h-4" />
                    الكل (صلاحية كاملة لعموم نينوى)
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold">
                    <input type="radio" name="directorScopeMode" value="sector" checked={directorScopeMode === 'sector'} onChange={(e) => setDirectorScopeMode('sector')} className="accent-teal-500 w-4 h-4" />
                    تحديد قاطع / منطقة محددة
                  </label>
                </div>

                {directorScopeMode === 'sector' && renderGeoSelection()}
              </div>
            </>
          )}

          {/* TRACKER FLOW */}
          {accountType === 'tracker' && (
            <>
              {/* 1. Name */}
              <div className="space-y-2">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><User className="w-4 h-4"/> 1. اسم المتابع الميداني</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد خليل" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500" />
              </div>

              {/* 2. Linked Team Sector */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 2. ربط المتابع بقطاع الفريق الميداني</label>
                <select 
                  required 
                  value={linkedTeamSector} 
                  onChange={(e) => setLinkedTeamSector(e.target.value)} 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500"
                >
                  <option value="">اختر القطاع / الفريق الميداني المرتبط</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.sector || team.name}>
                      {team.name} ({team.sector})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">المتابع سيشاهد إغلاقات هذا القطاع حصراً للتحقق منها.</p>
              </div>
            </>
          )}

          {/* 4. Login Credentials (Common) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><Lock className="w-4 h-4"/> {accountType === 'team' ? '4. بيانات حساب الفريق' : '4. بيانات تسجيل الدخول'}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs">اسم المستخدم (Username)</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 text-left" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs">كلمة المرور</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" dir="ltr" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 text-left" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white cursor-pointer">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs flex items-center gap-1"><Mail className="w-3 h-3"/> البريد الإلكتروني</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 text-left" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs flex items-center gap-1"><Phone className="w-3 h-3"/> رقم الهاتف</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 text-left" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(20,184,166,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 active:translate-y-0 mt-8">
            {mode === 'add' ? 'إنشاء الحساب وحفظ البيانات' : 'حفظ التعديلات'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
