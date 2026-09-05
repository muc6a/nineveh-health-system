import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The block we want to wrap starts with:
    #             {/* Directives Inbox/Outbox List */}
    #             <div className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto">
    # And ends with:
    #                 )}
    #               </div>
    #             </div>
    
    # We can use a regex that matches the start, and then we just use string replacement.
    target_start = """            {/* Directives Inbox/Outbox List */}
            <div className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto">"""
    
    replacement_start = """            {/* Directives Inbox/Outbox List */}
            {hasPerm('showDirectivesPage') && (
            <div className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto">"""
    
    if target_start in content:
        # Replace the start
        content = content.replace(target_start, replacement_start)
        
        # Now find the end of this div block. It ends right before `</div>` that closes `grid-cols-1`
        # In TeamDashboard:
        #                 )}
        #               </div>
        #             </div>
        #           </div>
        #             
        #             {hasPerm('quickTeamDispatch') && (
        
        # A simpler way is to find the exact string that follows the block
        # For ExecutivePortal it might be slightly different.
        
        # Let's find:
        #               </div>
        #             </div>
        #           </div>
        
        target_end_team = """                )}
              </div>
            </div>
          </div>
            
            {hasPerm('quickTeamDispatch') && ("""
        replacement_end_team = """                )}
              </div>
            </div>
            )}
          </div>
            
            {hasPerm('quickTeamDispatch') && ("""
        
        target_end_exec = """                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'lab_management'"""
        replacement_end_exec = """                )}
              </div>
            </div>
            )}
          </div>
        ) : activeTab === 'lab_management'"""

        content = content.replace(target_end_team, replacement_end_team)
        content = content.replace(target_end_exec, replacement_end_exec)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/pages/TeamDashboard.jsx')
fix_file('src/pages/ExecutivePortal.jsx')

print("Fixed Directives rendering")
