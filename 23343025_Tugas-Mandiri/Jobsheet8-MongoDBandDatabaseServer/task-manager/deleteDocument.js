require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const inquirer = require('inquirer').default;

const url = process.env.MONGODB_URL;
const namaDatabase = process.env.DATABASE_NAME;

const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Berhasil terhubung ke MongoDB 🚀');
        const db = client.db(namaDatabase);

        // 1. Show collections manually
        const collections = await db.listCollections().toArray();
        console.log('\n--- DAFTAR COLLECTION ---');
        collections.forEach((c, i) => console.log(`${i + 1}. ${c.name}`));

        const { colIndex } = await inquirer.prompt([{
            type: 'input',
            name: 'colIndex',
            message: 'Pilih nomor collection:',
            validate: val => (val > 0 && val <= collections.length) || "Nomor salah!"
        }]);
        const colName = collections[parseInt(colIndex) - 1].name;

        // 2. Fetch Data
        const data = await db.collection(colName).find({}).limit(10).toArray();
        if (!data.length) {
            console.log('Collection kosong.');
            return;
        }

        // 3. Display Data in a Table (Much cleaner!)
        console.log(`\n--- DATA DI COLLECTION: ${colName} ---`);
        console.table(data.map((d, i) => ({
            No: i + 1,
            ID: d._id.toString(),
            Data: JSON.stringify(d).substring(0, 50) + "..."
        })));

        const { targetIndex } = await inquirer.prompt([{
            type: 'input',
            name: 'targetIndex',
            message: 'Ketik NOMOR data yang ingin dihapus:',
            validate: val => (val > 0 && val <= data.length) || "Nomor tidak valid!"
        }]);

        const selectedData = data[parseInt(targetIndex) - 1];

        // 4. Final Confirmation
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: `Yakin hapus ID: ${selectedData._id}?`,
            default: false
        }]);

        if (confirm) {
            const result = await db.collection(colName).deleteOne({ _id: selectedData._id });
            console.log(result.deletedCount > 0 ? 'Berhasil dihapus ✅' : 'Gagal menghapus ❌');
        } else {
            console.log('Dibatalkan 👍');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

main();