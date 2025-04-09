import 'dotenv/config';

class Connector {
    fetchCredentials () {
        // TODO: Use an authentication service or custom implementation here.
        const credentials = {
            endpoint: process.env.POWERSYNC_URL,
            token: process.env.POWERSYNC_DEV_TOKEN,
        };
        console.log(credentials);
        return credentials
    }

    async uploadData(database) {
        const transaction = await database.getNextCrudTransaction();

        if (!transaction) {
            return;
        }

        try {
            for (const op of transaction.crud) {
                // The data that needs to be changed in the remote db
                const record = { ...op.opData, id: op.id };
                // TODO: Instruct your backend API to CREATE a record using the data defined above
            }
            await transaction.complete();
        } catch (error) {
            console.error(`Data upload error - discarding`, error);
            await transaction.complete();
        }
    }
}

export default Connector;
