public with sharing class ctrlGetAccounts {
     
    @AuraEnabled (cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accs = [SELECT Id, Name FROM Account ORDER BY LastModifiedDate LIMIT 20];
        return accs;
    }
}