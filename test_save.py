import json

ROLE_CORE_BASICS = {
  'director': ['showMainDashboard'],
  'central_director': ['showDirectivesPage', 'sendDirective', 'replyDirective', 'showPublicEvalsPage', 'showDeliveryPage', 'showOperationsRoom', 'authenticatePenalties', 'issueFine', 'closeEst', 'reopenEst', 'editEst', 'deleteEst', 'financialReports']
}

keys = ['manageEstablishments', 'showMainDashboard', 'sendDirective']

account = {'role': 'central_director', 'permissions': {'manageEstablishments': true}}

allFalse = account['permissions'].copy()
coreBasics = ROLE_CORE_BASICS[account['role']]

for k in keys:
    if k not in coreBasics:
        allFalse[k] = False
    else:
        allFalse[k] = True

print(allFalse)
