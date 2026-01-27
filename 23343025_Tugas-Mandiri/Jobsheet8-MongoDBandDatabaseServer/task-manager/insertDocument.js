require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.MONGODB_URL;
const namaDatabase = process.env.DATABASE_NAME;

const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 3000
});

const id = new ObjectId();

// Logging informasi ObjectId
console.log({id});
console.log({hexaId: id.id});
console.log({hexaLen: id.id.length});
console.log({timestamp: id.getTimestamp()});
console.log({strHexaLen: id.toHexString().length});

async function main(){
    try {
        // Validasi jika .env lupa dikonfigurasi
        if (!url || !namaDatabase) {
            throw new Error("Konfigurasi MONGODB_URL atau DATABASE_NAME tidak ditemukan di .env");
        }

        await client.connect();
        console.log("Berhasil terhubung ke MongoDB database server");

        const db = client.db(namaDatabase);
        const clPengguna = db.collection('pengguna');
        const clTugas = db.collection('tugas');

        // Input 1 data ke koleksi pengguna
        const insertPengguna = await clPengguna.insertOne({
            _id: id,
            nama: 'Nobel',
            usia: 22
        });
        console.log('Memasukkan data pengguna ke koleksi => ', insertPengguna);

        // Input banyak data ke koleksi tugas
        const insertTugas = await clTugas.insertMany([
            {
                Deskripsi: 'Membersihkan rumah',
                StatusPenyelesaian: true
            },
            {
                Deskripsi: 'Mengerjakan tugas kuliah',
                StatusPenyelesaian: false
            },
            {
                Deskripsi: 'Memberikan bimbingan',
                StatusPenyelesaian: false
            }
        ]);
        console.log('Memasukkan data Tugas ke koleksi => ', insertTugas);

        return 'Data selesai dimasukkan';
    }
    catch(err){
        console.error('Terjadi Error:', err.message);
    }
    finally {
        // Gunakan await untuk menutup koneksi secara bersih
        await client.close();
        console.log('Koneksi MongoDB ditutup');
    }
}

main().then(console.log).catch(console.error);