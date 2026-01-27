require('dotenv').config(); // Memuat variabel dari .env
const { MongoClient, ObjectId } = require('mongodb');

// Ambil nilai dari process.env
const url = process.env.MONGODB_URL;
const namaDatabase = process.env.DATABASE_NAME;

const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 3000
});

async function main(){
    try {
        // Validasi sederhana jika variabel lingkungan tidak terbaca
        if (!url || !namaDatabase) {
            throw new Error('Konfigurasi database tidak ditemukan di file .env');
        }

        await client.connect();
        console.log('Berhasil terhubung ke MongoDB database server');

        const db = client.db(namaDatabase);

        // Cari satu dokumen berdasarkan nama 'Nobel'
        const byNama = await db.collection('pengguna').findOne({ nama: 'Nobel'});

        // Cari satu dokumen berdasarkan id objek tertentu
        const byObjectId = await db.collection('pengguna').findOne({
            _id: new ObjectId("69512d132594840a238ef820")
        });

        // Mencari dokumen dengan usia 21
        const toArray = await db.collection('pengguna').find({ usia: 21 }).toArray();

        // Logika pengecekan hasil
        if(byNama || byObjectId || (toArray && toArray.length > 0)){
            console.log('Data Pengguna ditemukan (berdasarkan nama): ', byNama);
            console.log('Data Pengguna ditemukan (berdasarkan ID Objek): ', byObjectId);
            console.log('Data Pengguna ditemukan (dalam format array): ', toArray);
        } else {
            console.log('Data pengguna tidak ditemukan');
        }

    } catch(err) {
        console.error('Terjadi kesalahan:', err.message);
    } finally {
        await client.close();
    }
}

main().catch(console.error);