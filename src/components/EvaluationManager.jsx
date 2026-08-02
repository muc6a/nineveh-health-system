import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Plus, Trash2, Edit, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EvaluationManager = () => {
  const { inspectionTemplates, setInspectionTemplates, notify } = useContext(AppContext);
  
  // Accordion state
  const [expandedActivity, setExpandedActivity] = useState(null);
  
  // Modals / Inline Add states
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  
  const [newSectionNameFor, setNewSectionNameFor] = useState(null); // holds activity key
  const [newSectionName, setNewSectionName] = useState('');
  
  // Edit states
  const [editingActivity, setEditingActivity] = useState({ oldKey: null, newKey: '' });
  const [editingSection, setEditingSection] = useState({ activityKey: null, oldName: null, newName: '' });
  
  // Calculate total points for an activity
  const getTotalPoints = (activityKey) => {
    const items = inspectionTemplates[activityKey] || [];
    return items.reduce((acc, item) => acc + (parseInt(item.points) || 0), 0);
  };

  // --- Handlers ---
  const handleAddActivity = () => {
    if (!newActivityName.trim()) return;
    if (inspectionTemplates[newActivityName.trim()]) {
      notify('هذا النشاط موجود مسبقاً', 'error');
      return;
    }
    
    setInspectionTemplates(prev => ({
      ...prev,
      [newActivityName.trim()]: []
    }));
    
    setNewActivityName('');
    setShowAddActivity(false);
    setExpandedActivity(newActivityName.trim());
    notify('تم إضافة النشاط بنجاح', 'success');
  };

  const handleDeleteActivity = (activityKey) => {
    if (Object.keys(inspectionTemplates).length <= 1) {
      notify('يجب إبقاء نشاط واحد على الأقل في النظام', 'error');
      return;
    }
    if (window.confirm(`هل أنت متأكد من حذف نشاط "${activityKey}" بكافة أقسامه وبنوده؟`)) {
      setInspectionTemplates(prev => {
        const copy = { ...prev };
        delete copy[activityKey];
        return copy;
      });
      if (expandedActivity === activityKey) setExpandedActivity(null);
      notify('تم حذف النشاط', 'success');
    }
  };

  const handleSaveActivityName = (oldKey) => {
    const newKey = editingActivity.newKey.trim();
    if (!newKey || oldKey === newKey) {
      setEditingActivity({ oldKey: null, newKey: '' });
      return;
    }
    if (inspectionTemplates[newKey]) {
      notify('هذا الاسم موجود مسبقاً', 'error');
      return;
    }
    setInspectionTemplates(prev => {
      const copy = { ...prev };
      copy[newKey] = copy[oldKey];
      delete copy[oldKey];
      return copy;
    });
    if (expandedActivity === oldKey) setExpandedActivity(newKey);
    setEditingActivity({ oldKey: null, newKey: '' });
    notify('تم تعديل اسم النشاط بنجاح', 'success');
  };

  const handleSaveSectionName = (activityKey, oldName) => {
    const newName = editingSection.newName.trim();
    if (!newName || oldName === newName) {
      setEditingSection({ activityKey: null, oldName: null, newName: '' });
      return;
    }
    setInspectionTemplates(prev => {
      const items = prev[activityKey] || [];
      const updatedItems = items.map(item => {
        if (item.sectionName === oldName || item.section === oldName) {
          return { ...item, sectionName: newName, section: newName };
        }
        return item;
      });
      return { ...prev, [activityKey]: updatedItems };
    });
    setEditingSection({ activityKey: null, oldName: null, newName: '' });
    notify('تم تعديل اسم القسم بنجاح', 'success');
  };

  const handleAddSection = (activityKey) => {
    if (!newSectionName.trim()) return;
    
    // Add a dummy empty item just to establish the section, 
    // or we can wait for the user to add an item. 
    // But since the data model relies on items having a section, we must add a placeholder item,
    // OR we change the UI to allow empty sections.
    // Let's add a placeholder item with 0 points.
    const newItem = {
      id: Date.now(),
      section: newSectionName.trim(), // Use name as key
      sectionName: newSectionName.trim(),
      text: 'بند جديد (يرجى تعديل النص)',
      points: 0
    };
    
    setInspectionTemplates(prev => ({
      ...prev,
      [activityKey]: [...(prev[activityKey] || []), newItem]
    }));
    
    setNewSectionName('');
    setNewSectionNameFor(null);
    notify('تم إضافة القسم بنجاح', 'success');
  };
  
  const handleAddItem = (activityKey, sectionName) => {
    const newItem = {
      id: Date.now(),
      section: sectionName,
      sectionName: sectionName,
      text: '',
      points: 0
    };
    setInspectionTemplates(prev => ({
      ...prev,
      [activityKey]: [...(prev[activityKey] || []), newItem]
    }));
  };

  const handleItemChange = (activityKey, itemId, field, value) => {
    setInspectionTemplates(prev => {
      const items = prev[activityKey] || [];
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: field === 'points' ? parseInt(value) || 0 : value };
        }
        return item;
      });
      return { ...prev, [activityKey]: updatedItems };
    });
  };

  const handleDeleteItem = (activityKey, itemId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البند؟')) {
      setInspectionTemplates(prev => {
        const items = prev[activityKey] || [];
        return { ...prev, [activityKey]: items.filter(item => item.id !== itemId) };
      });
    }
  };

  const handleDeleteSection = (activityKey, sectionName) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${sectionName}" بكافة بنوده؟`)) {
      setInspectionTemplates(prev => {
        const items = prev[activityKey] || [];
        return { ...prev, [activityKey]: items.filter(item => item.sectionName !== sectionName) };
      });
      notify('تم حذف القسم', 'success');
    }
  };

  return (
    <div className="glassmorphic-card p-6 flex flex-col mt-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" />
            <span>إدارة النشاطات وبنود التقييم</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            قم ببناء الهيكل التقييمي لكل نشاط (المستوى الأول: النشاط، المستوى الثاني: الأقسام، المستوى الثالث: البنود).
          </p>
        </div>
        <button
          onClick={() => setShowAddActivity(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-teal-500/30"
        >
          <Plus className="w-4 h-4" />
          إضافة نشاط جديد
        </button>
      </div>

      {/* Add Activity Modal/Inline */}
      {showAddActivity && (
        <div className="mb-6 p-5 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-2xl flex flex-col gap-4 animate-slide-down">
          <h3 className="text-sm font-bold text-teal-800 dark:text-teal-300">✨ تعريف نشاط جديد (المستوى الأول)</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم النشاط (مثال: قاعات الأعراس)</label>
              <input
                type="text"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                placeholder="أدخل اسم النشاط..."
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:border-teal-500 text-slate-700 dark:text-slate-300"
              />
            </div>
            <div className="w-32">
              <label className="block text-[10px] font-bold text-slate-500 mb-1">الدرجة الكلية</label>
              <input
                type="text"
                value="100"
                disabled
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-center text-slate-500 cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleAddActivity}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all h-[42px]"
            >
              حفظ النشاط
            </button>
            <button
              onClick={() => {
                setShowAddActivity(false);
                setNewActivityName('');
              }}
              className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all h-[42px]"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Activities Accordion List */}
      <div className="space-y-4">
        {Object.keys(inspectionTemplates).map(activityKey => {
          const totalPoints = getTotalPoints(activityKey);
          const isExpanded = expandedActivity === activityKey;
          const isPerfect = totalPoints === 100;
          
          return (
            <div key={activityKey} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-teal-500 shadow-md shadow-teal-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-teal-300'}`}>
              
              {/* Activity Header (Level 1) */}
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isExpanded ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                onClick={() => setExpandedActivity(isExpanded ? null : activityKey)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPerfect ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {isPerfect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    {editingActivity.oldKey === activityKey ? (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingActivity.newKey}
                          onChange={e => setEditingActivity({ ...editingActivity, newKey: e.target.value })}
                          className="p-1.5 text-xs rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleSaveActivityName(activityKey)}
                        />
                        <button onClick={() => handleSaveActivityName(activityKey)} className="text-teal-600 bg-teal-50 p-1.5 rounded-lg font-bold text-[10px]">حفظ</button>
                        <button onClick={() => setEditingActivity({ oldKey: null, newKey: '' })} className="text-slate-500 bg-slate-100 p-1.5 rounded-lg font-bold text-[10px]">إلغاء</button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{activityKey}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPerfect ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20 animate-pulse'}`}>
                            المجموع: {totalPoints} / 100
                          </span>
                          {!isPerfect && (
                            <span className="text-[10px] text-red-500 font-bold">
                              (لا يمكن تفعيل النموذج إلا بضبط المجموع إلى 100)
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!editingActivity.oldKey && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingActivity({ oldKey: activityKey, newKey: activityKey });
                      }}
                      className="p-2 rounded-lg text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                      title="تعديل اسم النشاط"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteActivity(activityKey);
                    }}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="حذف النشاط بالكامل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Activity Body (Levels 2 & 3) */}
              {isExpanded && (
                <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
                  
                  {/* Sections List */}
                  {(() => {
                    const items = inspectionTemplates[activityKey] || [];
                    // Group items by sectionName
                    const sectionsMap = new Map();
                    items.forEach(item => {
                      const secName = item.sectionName || item.section;
                      if (!sectionsMap.has(secName)) {
                        sectionsMap.set(secName, []);
                      }
                      sectionsMap.get(secName).push(item);
                    });
                    
                    const sections = Array.from(sectionsMap.entries());

                    return (
                      <div className="space-y-6">
                        {sections.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-xs font-bold bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            لم يتم إضافة أي أقسام لهذا النشاط بعد.
                          </div>
                        )}
                        
                        {sections.map(([sectionName, secItems], sIdx) => {
                          const sectionTotal = secItems.reduce((acc, i) => acc + (parseInt(i.points)||0), 0);
                          
                          return (
                            <div key={sectionName} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                              {/* Section Header (Level 2) */}
                              <div className="bg-slate-100/50 dark:bg-slate-900/50 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center text-[10px] font-black shrink-0">
                                    {sIdx + 1}
                                  </span>
                                  {editingSection.activityKey === activityKey && editingSection.oldName === sectionName ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={editingSection.newName}
                                        onChange={e => setEditingSection({ ...editingSection, newName: e.target.value })}
                                        className="p-1 text-xs rounded border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                                        autoFocus
                                        onKeyDown={e => e.key === 'Enter' && handleSaveSectionName(activityKey, sectionName)}
                                      />
                                      <button onClick={() => handleSaveSectionName(activityKey, sectionName)} className="text-teal-600 bg-teal-50 px-2 py-1 rounded font-bold text-[9px]">حفظ</button>
                                      <button onClick={() => setEditingSection({ activityKey: null, oldName: null, newName: '' })} className="text-slate-500 bg-slate-100 px-2 py-1 rounded font-bold text-[9px]">إلغاء</button>
                                    </div>
                                  ) : (
                                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-200">
                                      {sectionName} <span className="text-teal-600 font-bold ml-1">({sectionTotal} درجة)</span>
                                    </h4>
                                  )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {(!editingSection.activityKey || editingSection.oldName !== sectionName) && (
                                    <button
                                      onClick={() => setEditingSection({ activityKey, oldName: sectionName, newName: sectionName })}
                                      className="p-1.5 rounded-lg text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                                      title="تعديل اسم القسم"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleAddItem(activityKey, sectionName)}
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-teal-600 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" /> إضافة بند تقييم
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSection(activityKey, sectionName)}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="حذف القسم"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Items List (Level 3) */}
                              <div className="p-4 space-y-3">
                                {secItems.map((item, iIdx) => (
                                  <div key={item.id} className="flex gap-3 items-start group">
                                    <span className="mt-2.5 text-[9px] font-bold text-slate-300 dark:text-slate-600 w-4 text-center">
                                      {iIdx + 1}
                                    </span>
                                    <div className="flex-1">
                                      <textarea
                                        rows="2"
                                        placeholder="وصف البند التقييمي..."
                                        value={item.text}
                                        onChange={(e) => handleItemChange(activityKey, item.id, 'text', e.target.value)}
                                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-teal-500 text-slate-700 dark:text-slate-300 resize-none transition-all"
                                      />
                                    </div>
                                    <div className="w-20 shrink-0">
                                      <div className="relative">
                                        <input
                                          type="number"
                                          placeholder="الدرجة"
                                          value={item.points || ''}
                                          onChange={(e) => handleItemChange(activityKey, item.id, 'points', e.target.value)}
                                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black outline-none focus:border-teal-500 text-teal-600 dark:text-teal-400 text-center transition-all"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-white dark:bg-slate-950 px-1 text-[8px] text-slate-400 font-bold">الدرجة</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteItem(activityKey, item.id)}
                                      className="mt-2 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                                      title="حذف البند"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Add New Section UI */}
                        {newSectionNameFor === activityKey ? (
                          <div className="flex gap-2 items-center bg-white dark:bg-slate-950 p-3 rounded-xl border border-teal-200 dark:border-teal-900/30">
                            <input
                              type="text"
                              value={newSectionName}
                              onChange={(e) => setNewSectionName(e.target.value)}
                              placeholder="اسم القسم الجديد (مثال: النظافة العامة)"
                              className="flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-xs font-bold outline-none focus:ring-1 focus:ring-teal-500 text-slate-700 dark:text-slate-300"
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddSection(activityKey)}
                              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                            >
                              حفظ القسم
                            </button>
                            <button
                              onClick={() => {
                                setNewSectionNameFor(null);
                                setNewSectionName('');
                              }}
                              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setNewSectionNameFor(activityKey)}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:border-teal-400 hover:text-teal-600 dark:hover:border-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" /> إضافة قسم رئيسي جديد
                          </button>
                        )}
                        
                      </div>
                    );
                  })()}
                  
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
