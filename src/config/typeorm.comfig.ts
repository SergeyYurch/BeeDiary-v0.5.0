import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.LOCAL_PGHOST,
  port: 5432,
  username: process.env.LOCAL_PGUSER,
  password: process.env.LOCAL_PGPASSWORD,
  database: process.env.LOCAL_PGDATABASE,
  autoLoadEntities: true,
  synchronize: true,
};
// process.env.DB_LOCATION === 'LOCAL'
//   ? {
//       type: 'postgres',
//       host: process.env.LOCAL_PGHOST,
//       port: 5432,
//       username: process.env.LOCAL_PGUSER,
//       password: process.env.LOCAL_PGPASSWORD,
//       database: process.env.LOCAL_PGDATABASE,
//       autoLoadEntities: true,
//       synchronize: true,
//     }
//   : {
// type: 'postgres',
// host: process.env.PGHOST,
// port: 5432,
// username: process.env.PGUSER,
// password: process.env.PGPASSWORD,
// database: process.env.PGDATABASE,
// autoLoadEntities: true,
// synchronize: true,
// ssl: true,
// };
