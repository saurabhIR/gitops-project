import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class AppService implements OnModuleDestroy {
  private client: Client | null = null;
  private connecting: Promise<Client> | null = null;

  private createClient() {
    return new Client({
      host: process.env.POSTGRES_HOST || 'gitops-postgres',
      port: Number(process.env.POSTGRES_PORT || 5432),
      user: process.env.POSTGRES_USER || 'gitops',
      password: process.env.POSTGRES_PASSWORD || 'gitopspass',
      database: process.env.POSTGRES_DB || 'gitopsdb',
      connectionTimeoutMillis: 3000,
      query_timeout: 5000,
    });
  }

  private async getClient() {
    if (this.client) {
      return this.client;
    }

    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = (async () => {
      const client = this.createClient();
      await client.connect();
      this.client = client;
      return client;
    })();

    try {
      return await this.connecting;
    } catch (error) {
      this.client = null;
      throw error;
    } finally {
      this.connecting = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end().catch(() => undefined);
      this.client = null;
    }
  }

  async getMessage() {
    try {
      const client = await this.getClient();
      const result = await client.query('SELECT NOW() AS now');
      return {
        message: 'Hello from the GitOps backend microservice!',
        timestamp: new Date().toISOString(),
        dbTime: result.rows[0]?.now ?? null,
      };
    } catch (error) {
      this.client = null;
      return {
        message: 'Hello from the GitOps backend microservice! (DB unavailable)',
        timestamp: new Date().toISOString(),
        dbError: error?.message ?? String(error),
      };
    }
  }
}
