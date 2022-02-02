import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

import { initModels } from './models/init-models'
dotenv.config()

// TODO: Replace creator tools db with pg host etc


const connectionString = process.env.CREATOR_TOOLS_DB_URL || "postgres://" + process.env.PGUSER + ":" + process.env.PGPASSWORD + "@" + process.env.PGHOST + ":" + process.env.PGPORT + "/" + process.env.PGDATABASE

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: process.env.CREATOR_TOOLS_DB_URL ? { ssl: { rejectUnauthorized: false } } : {},
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
  logging:
    process.env.LOG_SQL === 'true'
      ? (sql, time) =>
        // eslint-disable-next-line no-console
        console.log({
          msg: 'SQL execution info',
          context: { time, sql },
        })
      : false,
})

export const creatorToolsDatabase = { sequelize, ...initModels(sequelize) }
