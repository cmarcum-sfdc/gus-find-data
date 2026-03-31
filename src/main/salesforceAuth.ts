import jsforce, { Connection } from 'jsforce';

export interface SalesforceCredentials {
  username: string;
  password: string;
  securityToken: string;
  instanceUrl: string;
}

export interface WorkItem {
  Id: string;
  Name: string;
  Subject__c?: string;
  Status__c?: string;
  Priority__c?: string;
  Assignee__c?: string;
  Epic__c?: string;
  Sprint__c?: string;
  Type__c?: string;
  Details_and_Steps_to_Reproduce__c?: string;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface Epic {
  Id: string;
  Name: string;
  Status__c?: string;
  Priority__c?: string;
  Description__c?: string;
  Target_Date__c?: string;
  CreatedDate: string;
  LastModifiedDate: string;
}

export class SalesforceAuthService {
  private connection: Connection | null = null;
  private authenticated: boolean = false;

  async login(credentials: SalesforceCredentials): Promise<any> {
    try {
      // Create a new connection
      this.connection = new jsforce.Connection({
        loginUrl: credentials.instanceUrl || 'https://login.salesforce.com',
      });

      // Login with username, password + security token
      const userInfo = await this.connection.login(
        credentials.username,
        credentials.password + credentials.securityToken
      );

      this.authenticated = true;
      return {
        userId: userInfo.id,
        organizationId: userInfo.organizationId,
      };
    } catch (error) {
      this.authenticated = false;
      throw new Error(`Authentication failed: ${(error as Error).message}`);
    }
  }

  async logout(): Promise<void> {
    if (this.connection) {
      await this.connection.logout();
      this.connection = null;
      this.authenticated = false;
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  private ensureAuthenticated(): void {
    if (!this.authenticated || !this.connection) {
      throw new Error('Not authenticated. Please login first.');
    }
  }

  async queryWork(params: {
    searchText?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    epic?: string;
    limit?: number;
  }): Promise<WorkItem[]> {
    this.ensureAuthenticated();

    const conditions: string[] = [];

    if (params.searchText) {
      conditions.push(
        `(Subject__c LIKE '%${params.searchText}%' OR Name LIKE '%${params.searchText}%')`
      );
    }

    if (params.status) {
      conditions.push(`Status__c = '${params.status}'`);
    }

    if (params.priority) {
      conditions.push(`Priority__c = '${params.priority}'`);
    }

    if (params.assignee) {
      conditions.push(`Assignee__c LIKE '%${params.assignee}%'`);
    }

    if (params.epic) {
      conditions.push(`Epic__c = '${params.epic}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = params.limit || 100;

    // Note: You'll need to adjust the object name based on your GUS setup
    // Common names: ADM_Work__c, agf__ADM_Work__c
    const query = `
      SELECT Id, Name, Subject__c, Status__c, Priority__c,
             Assignee__c, Epic__c, Sprint__c, Type__c,
             Details_and_Steps_to_Reproduce__c, CreatedDate, LastModifiedDate
      FROM ADM_Work__c
      ${whereClause}
      ORDER BY LastModifiedDate DESC
      LIMIT ${limit}
    `;

    try {
      const result = await this.connection!.query<WorkItem>(query);
      return result.records;
    } catch (error) {
      throw new Error(`Query failed: ${(error as Error).message}`);
    }
  }

  async queryEpics(params: {
    searchText?: string;
    status?: string;
    priority?: string;
    limit?: number;
  }): Promise<Epic[]> {
    this.ensureAuthenticated();

    const conditions: string[] = [];

    if (params.searchText) {
      conditions.push(
        `(Name LIKE '%${params.searchText}%' OR Description__c LIKE '%${params.searchText}%')`
      );
    }

    if (params.status) {
      conditions.push(`Status__c = '${params.status}'`);
    }

    if (params.priority) {
      conditions.push(`Priority__c = '${params.priority}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = params.limit || 100;

    // Note: You'll need to adjust the object name based on your GUS setup
    // Common names: ADM_Epic__c, agf__ADM_Epic__c
    const query = `
      SELECT Id, Name, Status__c, Priority__c, Description__c,
             Target_Date__c, CreatedDate, LastModifiedDate
      FROM ADM_Epic__c
      ${whereClause}
      ORDER BY LastModifiedDate DESC
      LIMIT ${limit}
    `;

    try {
      const result = await this.connection!.query<Epic>(query);
      return result.records;
    } catch (error) {
      throw new Error(`Query failed: ${(error as Error).message}`);
    }
  }

  async getWorkDetails(workId: string): Promise<WorkItem> {
    this.ensureAuthenticated();

    const query = `
      SELECT Id, Name, Subject__c, Status__c, Priority__c,
             Assignee__c, Epic__c, Sprint__c, Type__c,
             Details_and_Steps_to_Reproduce__c, CreatedDate, LastModifiedDate
      FROM ADM_Work__c
      WHERE Id = '${workId}'
      LIMIT 1
    `;

    try {
      const result = await this.connection!.query<WorkItem>(query);
      if (result.records.length === 0) {
        throw new Error('Work item not found');
      }
      return result.records[0];
    } catch (error) {
      throw new Error(`Query failed: ${(error as Error).message}`);
    }
  }
}
