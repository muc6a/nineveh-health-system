import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Trash2, Plus, Users, MapPin, Briefcase, Mail, Phone, Lock, Unlock, User, Edit3, CheckSquare, Square, Clock, PenLine, BarChart3, Building, Compass, Activity, ShieldAlert, Bell, Settings } from 'lucide-react';
import { ROLES_DICTIONARY, NINEVEH_GEOGRAPHY, DEFAULT_PERMISSIONS, PERMISSIONS_TABS, PERMISSION_DETAILS, PERMISSION_ROLES } from '../utils/constants';

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
  // Unified Permissions State
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [activePermissionsTab, setActivePermissionsTab] = useState('establishments');

  const togglePermission = (permId) => {
    setPermissions(prev => ({
      ...prev,
      [permId]: !prev[permId]
    }));
  };
  
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
  const [technicians, setTechnicians] = useState([{ name: '', title: 'ملاحظ فني' }]);

  // Team Smart Edit Settings
  const [editTimeWindow, setEditTimeWindow] = useState('open'); // 'open', '1h', '5h', '24h'
  const [editOneTimeOnly, setEditOneTimeOnly] = useState(false);

  // Copy Permissions State
  const [copyPermissionsFrom, setCopyPermissionsFrom] = useState('');

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
          if (initialData.permissions) setPermissions(initialData.permissions);
          if (initialData.sector === 'الكل' || !initialData.sector) {
            setDirectorScopeMode('all');
          } else {
            setDirectorScopeMode('sector');
            if (initialData.sector.includes('مركز المحافظة - الجانب الأيمن')) {
              setSectorType('mosul');
              setMosulSide('right');
            } else if (initialData.sector.includes('مركز المحافظة - الجانب الأيسر')) {
              setSectorType('mosul');
              setMosulSide('left');
            } else {
              setSectorType('district');
              const matchedDistrict = NINEVEH_GEOGRAPHY.districts.find(d => initialData.sector.includes(d.label.replace('قضاء ', '')));
              if (matchedDistrict) {
                setDistrictId(matchedDistrict.id);
              }
            }
          }
        }

        if (accountType === 'team') {
          if (initialData.permissions) setPermissions(initialData.permissions);
          // If old data is array of strings, convert to objects
          const mapToObj = (arr, defaultTitle) => arr?.length ? (typeof arr[0] === 'string' ? arr.map(a => ({ name: a, title: defaultTitle })) : arr) : [{ name: '', title: defaultTitle }];
          
          if (initialData.members) {
            setDoctors(mapToObj(initialData.members.doctors, 'الطبيب / المفتش المسؤول'));
            setAssistants(mapToObj(initialData.members.assistants, 'ملاحظ فني / مدقق'));
            setTechnicians(mapToObj(initialData.members.technicians, 'ملاحظ فني'));
          } else {
            setDoctors([{ name: '', title: 'الطبيب / المفتش المسؤول' }]);
            setAssistants([{ name: '', title: 'ملاحظ فني / مدقق' }]);
            setTechnicians([{ name: '', title: 'ملاحظ فني' }]);
          }
          
          if (initialData.sector) {
             let extractedNeighborhoods = initialData.assignedNeighborhoods || [];
             if (initialData.sector.includes(' - ') && extractedNeighborhoods.length === 0) {
               const parts = initialData.sector.split(' - ');
               if (parts[0].trim() === 'مركز المحافظة' && parts.length > 2) {
                 extractedNeighborhoods = parts.slice(2).join(' - ').split('،').map(s => s.trim());
               } else if (parts[0].trim() !== 'مركز المحافظة' && parts.length > 1) {
                 extractedNeighborhoods = parts.slice(1).join(' - ').split('،').map(s => s.trim());
               }
             }
             
             if (extractedNeighborhoods.length > 0) {
               setSelectionMode('custom');
               setSelectedNeighborhoods(extractedNeighborhoods);
             } else {
               setSelectionMode('all');
               setSelectedNeighborhoods([]);
             }

             if (initialData.sector.includes('مركز المحافظة - الجانب الأيمن')) {
               setSectorType('mosul');
               setMosulSide('right');
             } else if (initialData.sector.includes('مركز المحافظة - الجانب الأيسر')) {
               setSectorType('mosul');
               setMosulSide('left');
             } else {
               setSectorType('district');
               const matchedDistrict = NINEVEH_GEOGRAPHY.districts.find(d => initialData.sector.includes(d.label.replace('قضاء ', '')));
               if (matchedDistrict) {
                 setDistrictId(matchedDistrict.id);
               }
             }
          } else {
             setSelectionMode('all');
             setSelectedNeighborhoods([]);
          }
          if (initialData.editSettings) {
             setEditTimeWindow(initialData.editSettings.window || 'open');
             setEditOneTimeOnly(!!initialData.editSettings.oneTimeOnly);
          }
          if (initialData.clonedFrom) {
             setCopyPermissionsFrom(initialData.clonedFrom);
          } else {
             setCopyPermissionsFrom('');
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
        setPermissions(DEFAULT_PERMISSIONS);
        setActivePermissionsTab('establishments');
        setSectorType('mosul'); setMosulSide('right'); setDistrictId('');
        setSelectionMode('all'); setSelectedNeighborhoods([]);
        setDoctors([{ name: '', title: 'الطبيب / المفتش المسؤول' }]);
        setAssistants([{ name: '', title: 'ملاحظ فني / مدقق' }]);
        setTechnicians([{ name: '', title: 'ملاحظ فني' }]);
        setEditTimeWindow('open');
        setEditOneTimeOnly(false);
        setLinkedTeamSector('');
        setCopyPermissionsFrom('');
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
      calculatedSector = sectorType === 'mosul' 
        ? (mosulSide === 'right' ? 'مركز المحافظة - الجانب الأيمن' : 'مركز المحافظة - الجانب الأيسر')
        : (districtId ? NINEVEH_GEOGRAPHY.districts.find(d => d.id === districtId)?.label : '');
    }

    const neighborhoods = (accountType === 'team' && selectionMode === 'custom') ? selectedNeighborhoods : [];

    const result = {
      ...initialData,
      name,
      email,
      phone,
      username,
      active: true,
      sector: calculatedSector,
      assignedNeighborhoods: neighborhoods
    };

    if (password) result.password = password;

    if (accountType === 'director') {
      const matchedRole = ROLES_DICTIONARY.find(r => r.label === directorTitle);
      result.title = directorTitle;
      result.role = matchedRole ? matchedRole.id : 'director_custom';
      result.isDirector = true;
      result.isTeam = false;
      result.permissions = permissions;
    } else if (accountType === 'team') {
      result.title = 'فريق رقابي ميداني';
      result.role = 'field_team';
      result.isTeam = true;
      result.isDirector = false;
      result.members = {
        doctors: doctors.filter(d => (d.name || '').trim() !== ''),
        assistants: assistants.filter(a => (a.name || '').trim() !== ''),
        technicians: technicians.filter(t => (t.name || '').trim() !== '')
      };
      result.editSettings = {
        window: editTimeWindow,
        oneTimeOnly: editOneTimeOnly
      };
      
      const defaultTeamPermissions = { ...DEFAULT_PERMISSIONS };

      if (copyPermissionsFrom) {
        result.clonedFrom = copyPermissionsFrom;
        const sourceTeam = teams.find(t => String(t.id) === String(copyPermissionsFrom));
        if (sourceTeam && sourceTeam.permissions) {
          result.permissions = { ...defaultTeamPermissions, ...sourceTeam.permissions };
        } else {
          result.permissions = permissions;
        }
      } else {
        result.clonedFrom = '';
        result.permissions = permissions;
      }
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
              className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all duration-300 border shadow-sm ${isSelected ? 'bg-teal-500/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-300 shadow-[inset_0_0_15px_rgba(45,212,191,0.1)]' : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}
            >
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]" /> : <Square className="w-4 h-4" />}
              </div>
              <span className="truncate flex-1 select-none font-bold">{hood}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const accountRole = (accountType === 'team' || accountType === 'tracker') ? 'team' : 'management';

  const handleGrantAll = () => {
    const allPerms = { ...permissions };
    Object.keys(PERMISSION_DETAILS).forEach(key => {
      const targetRole = PERMISSION_ROLES[key] || 'all';
      const isOutofRole = accountRole !== 'management' && targetRole !== 'all' && targetRole !== accountRole;
      if (!isOutofRole) {
        allPerms[key] = true;
      }
    });
    setPermissions(allPerms);
  };

  const handleRevokeAll = () => {
    const noPerms = { ...permissions };
    Object.keys(PERMISSION_DETAILS).forEach(key => {
      const targetRole = PERMISSION_ROLES[key] || 'all';
      const isOutofRole = accountRole !== 'management' && targetRole !== 'all' && targetRole !== accountRole;
      if (!isOutofRole) {
        noPerms[key] = false;
      }
    });
    setPermissions(noPerms);
  };

  const renderPermissionsTabsUI = () => {
    const activeTabObj = PERMISSIONS_TABS.find(t => t.id === activePermissionsTab);
    return (
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row h-[420px] overflow-hidden">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-800/50 border-l border-slate-200 dark:border-white/5 p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {PERMISSIONS_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePermissionsTab(tab.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all duration-300 text-xs font-black relative overflow-hidden ${activePermissionsTab === tab.id ? 'bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'}`}
              >
                <div className={`p-1 rounded-lg ${activePermissionsTab === tab.id ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {tab.icon}
                </div>
                {tab.label}
                {activePermissionsTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Global Actions */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
            <button
              onClick={handleGrantAll}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-colors text-xs font-bold"
            >
              <CheckSquare className="w-4 h-4" />
              <span>منح كافة الصلاحيات المتاحة</span>
            </button>
            <button
              onClick={handleRevokeAll}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/20 transition-colors text-xs font-bold"
            >
              <Square className="w-4 h-4" />
              <span>سحب كافة الصلاحيات</span>
            </button>
          </div>
        </div>
        {/* Toggle Switches Area */}
        <div className="w-full md:w-2/3 p-5 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-white/5">
             <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
               {activeTabObj?.icon}
             </div>
             <h4 className="text-sm font-black text-slate-800 dark:text-white">{activeTabObj?.label}</h4>
          </div>
          <div className="space-y-3">
            {activeTabObj?.keys.map(key => {
              const detail = PERMISSION_DETAILS[key];
              const isGranted = !!permissions[key];
              const targetRole = PERMISSION_ROLES[key] || 'all';
              const isOutofRole = accountRole !== 'management' && targetRole !== 'all' && targetRole !== accountRole;
              
              if (isOutofRole && !isGranted) {
                return (
                  <div key={key} onClick={() => togglePermission(key)} className="group flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex flex-col ml-3">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{detail?.title}</span>
                      <span className="text-[10px] text-rose-500 mt-1">غير مخصص لهذا الحساب (انقر لكسر القفل ومنح الصلاحية)</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:text-rose-500 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                );
              }

              return (
                <div key={key} onClick={() => togglePermission(key)} className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${isGranted ? (isOutofRole ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/40' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500/40') : 'bg-slate-100/50 dark:bg-slate-800/20 border-dashed border-slate-300 dark:border-slate-700'}`}>
                  <div className="flex flex-col ml-3">
                    <span className={`text-xs font-black ${isGranted ? (isOutofRole ? 'text-amber-700 dark:text-amber-400' : 'text-purple-700 dark:text-purple-300') : 'text-slate-500 dark:text-slate-400'}`}>{detail?.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{detail?.desc}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isGranted ? (isOutofRole ? 'bg-amber-500 text-white border-amber-400' : 'bg-purple-500 text-white border-purple-400') : 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}>
                    {isGranted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 1. تحديد الموقع وتوزيع الأحياء</label>
                {renderGeoSelection()}
              </div>

              {/* 2. Team Name */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Users className="w-4 h-4"/> 2. اسم اللجنة الرقابية</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: لجنة الرقابة الصحية الأولى" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-inner" />
              </div>

              {/* 3. Members */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><User className="w-4 h-4"/> 3. إدارة أعضاء الفريق والمسميات</label>
                <div className="bg-slate-100/40 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
                  <div>
                    <label className="text-slate-400 block mb-3 text-xs font-semibold">الأطباء والمفتشون المسؤولون</label>
                    {doctors.map((doc, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">اسم العضو</label>
                          <input type="text" placeholder="الاسم الرباعي واللقب" value={doc.name} onChange={(e) => { const newDocs = [...doctors]; newDocs[idx].name = e.target.value; setDoctors(newDocs); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">المسمى الوظيفي المخصص</label>
                          <div className="relative">
                            <input type="text" placeholder="مثال: رئيس اللجنة" value={doc.title} onChange={(e) => { const newDocs = [...doctors]; newDocs[idx].title = e.target.value; setDoctors(newDocs); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner pr-8" />
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
                    <button type="button" onClick={() => setDoctors([...doctors, { name: '', title: 'طبيب / مفتش' }])} className="text-indigo-600 dark:text-indigo-400 text-xs font-black hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> إضافة عضو آخر
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="text-slate-400 block mb-3 text-xs font-semibold">الكوادر الساندة (ملاحظين / مدققين)</label>
                    {assistants.map((ast, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">اسم العضو</label>
                          <input type="text" placeholder="الاسم الرباعي" value={ast.name} onChange={(e) => { const newAst = [...assistants]; newAst[idx].name = e.target.value; setAssistants(newAst); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">المسمى الوظيفي المخصص</label>
                          <div className="relative">
                            <input type="text" placeholder="مثال: ملاحظ فني" value={ast.title} onChange={(e) => { const newAst = [...assistants]; newAst[idx].title = e.target.value; setAssistants(newAst); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner pr-8" />
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
                    <button type="button" onClick={() => setAssistants([...assistants, { name: '', title: 'ملاحظ فني / مدقق' }])} className="text-indigo-600 dark:text-indigo-400 text-xs font-black hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> إضافة عضو آخر
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="text-slate-400 block mb-3 text-xs font-semibold">الملاحظين الفنيين</label>
                    {technicians.map((tech, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 mb-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">اسم العضو</label>
                          <input type="text" placeholder="الاسم الرباعي" value={tech.name} onChange={(e) => { const newTech = [...technicians]; newTech[idx].name = e.target.value; setTechnicians(newTech); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-500">المسمى الوظيفي المخصص</label>
                          <div className="relative">
                            <input type="text" placeholder="مثال: ملاحظ فني" value={tech.title} onChange={(e) => { const newTech = [...technicians]; newTech[idx].title = e.target.value; setTechnicians(newTech); }} className="w-full p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-white outline-none focus:border-indigo-500 shadow-inner pr-8" />
                            <PenLine className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5" />
                          </div>
                        </div>
                        {technicians.length > 1 && (
                          <button type="button" onClick={() => setTechnicians(technicians.filter((_, i) => i !== idx))} className="md:absolute md:left-2 md:-top-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors self-end md:self-auto border border-red-500/20 opacity-0 group-hover:opacity-100">
                            <X className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setTechnicians([...technicians, { name: '', title: 'ملاحظ فني' }])} className="text-indigo-600 dark:text-indigo-400 text-xs font-black hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> إضافة عضو آخر
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Smart Edit Control (Flexible Edit) */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Clock className="w-4 h-4"/> 4. قيود تعديل التقييمات (التعديل الذكي)</label>
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-xs block font-semibold">الفترة الزمنية المسموحة للتعديل بعد الحفظ</label>
                    <select value={editTimeWindow} onChange={(e) => setEditTimeWindow(e.target.value)} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-500 shadow-inner">
                      <option value="open">مفتوح (لا يوجد قيد زمني)</option>
                      <option value="1h">ساعة واحدة فقط</option>
                      <option value="5h">5 ساعات</option>
                      <option value="24h">24 ساعة</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-900/60 transition-colors">
                    <input type="checkbox" checked={editOneTimeOnly} onChange={(e) => setEditOneTimeOnly(e.target.checked)} className="w-4 h-4 accent-indigo-500 rounded" />
                    <span className="text-sm font-semibold text-slate-300">السماح بتعديل النموذج لمرة واحدة فقط</span>
                  </label>
                </div>
              </div>

              {/* 5. Copy Permissions */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Lock className="w-4 h-4"/> 5. استنساخ الأذونات وصلاحيات النظام</label>
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                  <label className="text-slate-400 text-xs block font-semibold mb-2">استنساخ الأذونات من فريق ميداني آخر (اختياري)</label>
                  <select 
                    value={copyPermissionsFrom} 
                    onChange={(e) => setCopyPermissionsFrom(e.target.value)} 
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-indigo-500 shadow-inner"
                  >
                    <option value="">لا يوجد استنساخ (استخدام الأذونات الافتراضية)</option>
                    {teams.map(t => (
                      t.id !== initialData?.id && <option key={t.id} value={t.id}>نفس أذونات: {t.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold leading-relaxed">
                    هذا الخيار يتيح لك نسخ جميع الصلاحيات والأذونات (بما فيها الاستثناءات الممنوحة) من فريق آخر وتطبيقها فوراً على هذا الفريق لتوفير الوقت.
                  </p>
                </div>
              </div>

              {/* 6. Advanced Permissions (The Locks) */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Lock className="w-4 h-4"/> 6. الصلاحيات المتقدمة (الأقفال)</label>
                <div className="text-[10px] text-slate-500 font-bold mb-2">يمكنك ضبط صلاحيات الوصول والميزات الدقيقة للفريق هنا. الاستنساخ (أعلاه) سيقوم بملء هذه الصلاحيات تلقائياً.</div>
                {renderPermissionsTabsUI()}
              </div>
            </>
          )}

          {/* DIRECTOR FLOW */}
          {accountType === 'director' && (
            <>
              {/* 1. Name */}
              <div className="space-y-2">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><User className="w-4 h-4"/> 1. الاسم الكامل للقيادي</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: د. أحمد صالح الجبوري" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500" />
              </div>

              {/* 2. Job Title (Open Field / Datalist) */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Briefcase className="w-4 h-4"/> 2. المسمى الوظيفي / المنصب (قابل للتعديل)</label>
                <input 
                  type="text" 
                  list="roles-list"
                  required 
                  value={directorTitle} 
                  onChange={(e) => setDirectorTitle(e.target.value)} 
                  placeholder="مثال: مدير قسم الصحة العامة" 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500" 
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
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 3. الربط الجغرافي ونطاق الصلاحية التقنية</label>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold">
                    <input type="radio" name="directorScopeMode" value="all" checked={directorScopeMode === 'all'} onChange={(e) => setDirectorScopeMode('all')} className="accent-indigo-500 w-4 h-4" />
                    الكل (صلاحية كاملة لعموم نينوى)
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-bold">
                    <input type="radio" name="directorScopeMode" value="sector" checked={directorScopeMode === 'sector'} onChange={(e) => setDirectorScopeMode('sector')} className="accent-indigo-500 w-4 h-4" />
                    تحديد قاطع / منطقة محددة
                  </label>
                </div>

                {directorScopeMode === 'sector' && renderGeoSelection()}
              </div>
              
              {/* 4. Permissions (Locks) */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Lock className="w-4 h-4"/> 4. إدارة صلاحيات القراءة والوصول (الأقفال)</label>
                {renderPermissionsTabsUI()}
              </div>

            </>
          )}

          {/* TRACKER FLOW */}
          {accountType === 'tracker' && (
            <>
              {/* 1. Name */}
              <div className="space-y-2">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><User className="w-4 h-4"/> 1. اسم المتابع الميداني</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد خليل" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500" />
              </div>

              {/* 2. Linked Team Sector */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><MapPin className="w-4 h-4"/> 2. ربط المتابع بقطاع الفريق الميداني</label>
                <select 
                  required 
                  value={linkedTeamSector} 
                  onChange={(e) => setLinkedTeamSector(e.target.value)} 
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500"
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
            <label className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Lock className="w-4 h-4"/> {accountType === 'team' ? '4. بيانات حساب الفريق' : '4. بيانات تسجيل الدخول'}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs">اسم المستخدم (Username)</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 text-left" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs">كلمة المرور</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" dir="ltr" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 text-left" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white cursor-pointer">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs flex items-center gap-1"><Mail className="w-3 h-3"/> البريد الإلكتروني</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 text-left" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block text-xs flex items-center gap-1"><Phone className="w-3 h-3"/> رقم الهاتف</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 text-left" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:translate-y-0 mt-8">
            {mode === 'add' ? 'إنشاء الحساب وحفظ البيانات' : 'حفظ التعديلات'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
