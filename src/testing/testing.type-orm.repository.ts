import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TestingTypeOrmRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async dataBaseClear(): Promise<boolean> {
    console.log('dataBaseClear');
    try {
      await this.dataSource.query(`
    CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
    DECLARE
    statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE tableowner = username AND schemaname = 'public';
    BEGIN
    FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    END LOOP;
    END;
    $$ LANGUAGE plpgsql;

    SELECT truncate_tables ('postgres')
    `);
      return true;
    } catch (e) {
      return false;
      console.log(e);
    }
  }
}
