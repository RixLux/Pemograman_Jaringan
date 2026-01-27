require('dotenv').config(); // Memuat konfigurasi dari .env
const { MongoClient, ObjectId } = require('mongodb');

// Mengambil konfigurasi dari environment variables
const url = process.env.MONGODB_URL;
const namaDatabase = process.env.DATABASE_NAME;

const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 3000
});

async function main(){
    try {
        // Validasi koneksi
        if (!url || !namaDatabase) {
            throw new Error("Variabel lingkungan MONGODB_URL atau DATABASE_NAME belum diatur.");
        }

        await client.connect();
        console.log('Berhasil terhubung ke MongoDB database server');

        const db = client.db(namaDatabase);

        // --- BAGIAN UPDATE BANYAK DATA SECARA DINAMIS ---

        // Mengambil semua dokumen di koleksi pengguna
        const semuaPengguna = await db
            .collection('pengguna')
            .find({})
            .sort({ _id: 1 })
            .toArray();

        let usiaAwal = 25;

        const ops = semuaPengguna.map(user => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $inc: { usia: 1 } }
            }
        }));

        await db.collection('pengguna').bulkWrite(ops);
        console.log("Update massal selesai 🚀");


    }
    catch(err){
        console.error('Terjadi kesalahan:', err.message);
    }
    finally {
        // Menutup koneksi setelah semua operasi selesai atau jika terjadi error
        await client.close();
        console.log('Koneksi database ditutup.');
    }
}

main();