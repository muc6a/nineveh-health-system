import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# For incoming requests (pending_arrival)
old_incoming = """                            <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                            {req.senderNotes && <p className="text-xs text-slate-400 mt-1 bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block">ملاحظة: {req.senderNotes}</p>}"""

new_incoming = """                            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              {req.estName}
                              {req.sampleCode && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">كود: {req.sampleCode}</span>}
                              {req.sampleType && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">{req.sampleType}</span>}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                            {req.senderNotes && <p className="text-xs text-slate-400 mt-1 bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block">ملاحظة: {req.senderNotes}</p>}"""

content = content.replace(old_incoming, new_incoming)

# For testing requests (testing)
old_testing = """                            <h4 className="font-bold text-slate-800 dark:text-white text-lg">{req.estName}</h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - تم الاستلام: {new Date(req.receivedAt).toLocaleTimeString('ar-IQ')}</p>"""

new_testing = """                            <h4 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                              {req.estName}
                              {req.sampleCode && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">كود: {req.sampleCode}</span>}
                              {req.sampleType && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">{req.sampleType}</span>}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - تم الاستلام: {new Date(req.receivedAt).toLocaleTimeString('ar-IQ')}</p>"""

content = content.replace(old_testing, new_testing)


with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
