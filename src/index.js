import { PowerSyncDatabase, SyncStreamConnectionMethod } from "@powersync/node";
import { default as Logger } from 'js-logger';
import Connector from "./connector.js";
import AppSchema from "./appSchema.js";

const main = async () => {
    const logger = Logger.get('PowerSyncDemo');
    Logger.useDefaults({ defaultLevel: logger.INFO });

    const db = new PowerSyncDatabase({
        schema: AppSchema,
        database: {
            dbFilename: "powersync.db",
        }
    });

    db.registerListener({
        statusChanged: (status) => {
            if(status && status.downloadProgress) {
                const progress = Number(status.downloadProgress.downloadedFraction * 100).toFixed(2)
                logger.info("Progress ", progress, "%");
                logger.info("Total Operations", status.downloadProgress.totalOperations);
            }
        }
    });

    // Not connected just checking version
    console.log(await db.get('SELECT powersync_rs_version();'));
    // Use HTTP stream
    await db.connect(new Connector(), { connectionMethod: SyncStreamConnectionMethod.HTTP });
    await db.waitForFirstSync();
    logger.info("Connected and first sync complete!")

    db.watch("SELECT * FROM lists", [], {
        onResult: (result) => {
            logger.info("Total Lists ", result.rows.length);
        }
    });
}

main();
