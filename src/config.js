import {  configDotenv } from "dotenv";
configDotenv();

export const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
};

console.log(pgConfig);

export const serverPort = process.env.PORT || 5008;

export const CURRENCY_PAIRS = {
  CRYPTO: ['ADAUSD', 'BTCUSD', 'CHZUSD', 'DOGUSD', 'EOSUSD', 'ETHBTC'],
  FOREX: ["EURUSD","GBPUSD","AUDUSD","USDJPY","USDCAD","USDCHF"],
  METALS: ['ALUMINIUM', 'COPPER', 'XAGEUR', 'XAGUSD', 'XAUEUR', 'XAUUSD'],
  SPOT_INDICES: ['CHNspot', 'AUS200spot', 'EU50spot', 'FRA40spot', 'GER30spot', 'HKspot']
};

export const TARGET_PAIRS = [
  ...CURRENCY_PAIRS.CRYPTO,
  ...CURRENCY_PAIRS.FOREX,
  ...CURRENCY_PAIRS.METALS,
  ...CURRENCY_PAIRS.SPOT_INDICES
];