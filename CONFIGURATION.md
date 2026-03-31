# Configuration Guide

## Customizing GUS Object Names

Your Salesforce GUS installation may use different object names depending on whether it's packaged or has custom namespaces. Here's how to configure the app for your specific setup.

### Finding Your GUS Object Names

1. Log in to Salesforce
2. Go to Setup → Object Manager
3. Search for "Work" or "Epic" to find your GUS objects
4. Note the API names (e.g., `ADM_Work__c`, `agf__ADM_Work__c`)

### Common GUS Object Naming Patterns

| Type | Unpackaged | With Namespace |
|------|-----------|----------------|
| Work Items | `ADM_Work__c` | `agf__ADM_Work__c` |
| Epics | `ADM_Epic__c` | `agf__ADM_Epic__c` |

### Updating Object Names in Code

Edit `src/main/salesforceAuth.ts` and update the object names in the SQL queries:

#### For Work Items (queryWork method)

```typescript
const query = `
  SELECT Id, Name, Subject__c, Status__c, Priority__c,
         Assignee__c, Epic__c, Sprint__c, Type__c,
         Details_and_Steps_to_Reproduce__c, CreatedDate, LastModifiedDate
  FROM ADM_Work__c  // <- Change this line
  ${whereClause}
  ORDER BY LastModifiedDate DESC
  LIMIT ${limit}
`;
```

#### For Epics (queryEpics method)

```typescript
const query = `
  SELECT Id, Name, Status__c, Priority__c, Description__c,
         Target_Date__c, CreatedDate, LastModifiedDate
  FROM ADM_Epic__c  // <- Change this line
  ${whereClause}
  ORDER BY LastModifiedDate DESC
  LIMIT ${limit}
`;
```

#### For Work Details (getWorkDetails method)

```typescript
const query = `
  SELECT Id, Name, Subject__c, Status__c, Priority__c,
         Assignee__c, Epic__c, Sprint__c, Type__c,
         Details_and_Steps_to_Reproduce__c, CreatedDate, LastModifiedDate
  FROM ADM_Work__c  // <- Change this line
  WHERE Id = '${workId}'
  LIMIT 1
`;
```

### Customizing Field Names

If your GUS fields have different names (e.g., with namespace prefixes), update them in the same queries:

**Without namespace:**
```typescript
Subject__c, Status__c, Priority__c
```

**With namespace (e.g., agf):**
```typescript
agf__Subject__c, agf__Status__c, agf__Priority__c
```

### After Making Changes

1. Rebuild the app:
```bash
npm run build
```

2. Restart the application:
```bash
npm start
```

## Testing Your Configuration

1. Log in to the app with your Salesforce credentials
2. Try searching for work items or epics
3. If you get "Query failed" errors:
   - Check the browser console (View → Toggle Developer Tools)
   - Verify the object/field names match your Salesforce setup
   - Ensure your user has read permissions on the GUS objects

## Common Configuration Issues

### "sObject type 'ADM_Work__c' is not supported"
- Your GUS objects likely have a namespace prefix
- Add the namespace to the object names (e.g., `agf__ADM_Work__c`)

### "No such column 'Subject__c'"
- Your field names may have namespace prefixes
- Update all field names in the SELECT statements (e.g., `agf__Subject__c`)

### Empty Results
- Verify that work items/epics exist in your Salesforce org
- Check that your user has appropriate permissions
- Try querying without filters first

## Advanced: Using Salesforce Developer Console

To test your queries directly in Salesforce:

1. Open Developer Console (Setup → Developer Console)
2. Go to Query Editor
3. Test your queries:

```sql
SELECT Id, Name, Subject__c, Status__c
FROM ADM_Work__c
LIMIT 10
```

This helps verify object and field names before updating the app.
