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
    // Not connected just checking version
    console.log(await db.get('SELECT powersync_rs_version();'));
    // Use HTTP stream
    await db.connect(new Connector(), { connectionMethod: SyncStreamConnectionMethod.HTTP });
    await db.waitForFirstSync()
    console.log("Connected and first sync complete!");

    console.log(await db.get('SELECT * FROM lists'));
}

main();
