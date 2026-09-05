import re

# ------------- TeamDashboard.jsx -------------
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

# 1. Remove reply tab initialization
team_content = team_content.replace(
    "if (user?.permissions?.replyDirective) return 'replies';",
    ""
)

# 2. Remove reply button in tab list
reply_btn_regex = r"\{hasPerm\('replyDirective'\) && \([\s\S]*?سجل الردود\n\s*</button>\n\s*\)\}"
team_content = re.sub(reply_btn_regex, "", team_content)

# 3. Remove reply tab content
reply_content_regex = r"\{directiveTab === 'replies' && hasPerm\('replyDirective'\) && \([\s\S]*?لا توجد ردود مسجلة حالياً\.</p>\n\s*</div>\n\s*\)\}"
team_content = re.sub(reply_content_regex, "", team_content)

# 4. Add reply button in inbox
inbox_loop_end = """                        <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                      </div>"""
new_inbox_loop_end = """                        <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                        {hasPerm('replyDirective') && (
                          <button
                            onClick={() => {
                              const msg = window.prompt("اكتب ردك على هذا التبليغ:");
                              if (msg) {
                                if (typeof notify !== 'undefined') notify('تم إرسال الرد بنجاح', 'success');
                              }
                            }}
                            className="mt-3 px-4 py-2 bg-slate-700/50 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all w-fit border border-slate-600"
                          >
                            💬 إضافة رد
                          </button>
                        )}
                      </div>"""
team_content = team_content.replace(inbox_loop_end, new_inbox_loop_end)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(team_content)


# ------------- ExecutivePortal.jsx -------------
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

exec_inbox_loop_end = """                        <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                      </div>"""
exec_new_inbox_loop_end = """                        <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                        {hasPerm('replyDirective') && (
                          <button
                            onClick={() => {
                              const msg = window.prompt("اكتب ردك على هذا التبليغ:");
                              if (msg) {
                                if (typeof notify !== 'undefined') notify('تم إرسال الرد بنجاح', 'success');
                              }
                            }}
                            className="mt-3 px-4 py-2 bg-slate-700/50 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all w-fit border border-slate-600"
                          >
                            💬 إضافة رد
                          </button>
                        )}
                      </div>"""
exec_content = exec_content.replace(exec_inbox_loop_end, exec_new_inbox_loop_end)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(exec_content)

print("Applied reply logic modifications to TeamDashboard and ExecutivePortal.")
