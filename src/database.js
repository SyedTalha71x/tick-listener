import pg from 'pg';
import { pgConfig, TARGET_PAIRS } from './config.js';
import logger from './utils/logger.js';
import {  configDotenv } from "dotenv";
configDotenv();

const pgClient = new pg.Client(pgConfig);

export async function connectDatabase() {
  try {
    await pgClient.connect();
    logger.info('Connected to PostgreSQL database');
    console.log('Connected with PostgreSQL');
    await pgClient.query('LISTEN tick');
    logger.info('Listening to "tick" channel');
    console.log('listening to tick channel');
    return pgClient;
  } catch (error) {
    logger.error('Database connection error:', error);
    console.log('Database connection error:', error);
    
    throw error;
  }
}

export function setupNotificationHandler(io) {
    pgClient.on('notification', (msg) => {
        if (msg.channel === 'tick') {
            try {
                const [symbol, lots, bora, price, timestamp] = msg.payload.split(' ');
                
                if (parseInt(lots) === 1 && TARGET_PAIRS.includes(symbol)) {
                    const tickData = {
                        symbol,
                        price: parseFloat(price),
                        timestamp: parseInt(timestamp),
                        type: bora === 'B' ? 'BID' : 'ASK'
                    };

                    // console.log(`Tick received: ${symbol} ${tickData.type} ${price}`);
                    io.emit('tick',JSON.stringify(tickData));
                } else {
                    // console.log(`Filtered out: ${symbol} (Lots: ${lots})`);
                }
            } catch (error) {
                console.error('Error processing tick:', error.message);
            }
        }
    });

    logger.info('Monitoring these currency pairs:');
    logger.info(TARGET_PAIRS.join(', '));
}

export async function closeDatabase() {
  try {
    await pgClient.end();
    logger.info('PostgreSQL connection closed');
  } catch (error) {
    logger.error('Error closing PostgreSQL connection:', error);
    throw error;
  }
}