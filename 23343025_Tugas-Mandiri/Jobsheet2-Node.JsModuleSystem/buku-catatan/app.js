const yargs = require('yargs');
const catatan = require('./catatan.js');
const readline = require('readline');

// ================= WELCOME =================
console.log('\n📒 Buku Catatan CLI');
console.log('Ketik --help untuk melihat command, atau "quit" untuk keluar.\n');

// ================= YARGS SETUP =================
yargs.version('1.0.0');
yargs.exitProcess(false);
yargs.scriptName('notes');

// custom error handler
yargs.fail((msg, err, yargsInstance) => {
    if (msg) {
        console.log('\n❌ Error:', msg);
        console.log('\nGunakan format yang benar:\n');
        yargsInstance.showHelp();
    }
});

// ================= TAMBAH =================
yargs.command({
    command: 'tambah',
    describe: 'Tambah sebuah catatan baru',
    builder: {
        judul: {
            describe: 'Judul catatan',
            demandOption: true,
            type: 'string',
            alias: 'j'
        },
        isi: {
            describe: 'Isi catatan',
            demandOption: true,
            type: 'string',
            alias: 'i'
        }
    },
    handler(argv) {
        catatan.tambahCatatan(argv.judul, argv.isi);
    }
}).example('tambah -j "myday" -i "capek banget"', 'Menambah catatan baru');

// ================= HAPUS =================
yargs.command({
    command: 'hapus',
    describe: 'Hapus catatan berdasarkan judul',
    builder: {
        judul: {
            describe: 'Judul catatan',
            demandOption: true,
            type: 'string',
            alias: 'j'
        }
    },
    handler(argv) {
        catatan.hapusCatatan(argv.judul);
    }
}).example('hapus -j "myday"', 'Menghapus catatan');

// ================= BACA SEMUA =================
yargs.command({
    command: 'read_all',
    describe: 'Menampilkan semua catatan',
    handler() {
        catatan.bacaSemua();
    }
}).example('read_all', 'Menampilkan semua catatan');

// ================= BACA SATU =================
yargs.command({
    command: 'read',
    describe: 'Menampilkan satu catatan',
    builder: {
        judul: {
            describe: 'Judul catatan',
            demandOption: true,
            type: 'string',
            alias: 'j'
        }
    },
    handler(argv) {
        catatan.bacaJudul(argv.judul);
    }
}).example('read -j "myday"', 'Menampilkan satu catatan');

yargs.help();

// ================= INTERACTIVE MODE =================
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '📒 > '
});

console.log('Mode interaktif aktif.\n');
rl.prompt();

rl.on('line', (line) => {
    const input = line.trim();

    // kosong → skip
    if (!input) {
        rl.prompt();
        return;
    }

    // quit
    if (input.toLowerCase() === 'quit') {
        console.log('👋 Sampai jumpa!');
        rl.close();
        return;
    }

    // split aman utk string pakai spasi
        const args = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    // handle help manual
        if (args.includes('--help') || args.includes('-h')) {
            yargs.showHelp();
            rl.prompt();
            return;
        }

    // parse fresh
        yargs.parse(args, {}, () => {});


    rl.prompt();
});

rl.on('SIGINT', () => {
    console.log('\nGunakan "quit" untuk keluar 🙂');
    rl.prompt();
});

rl.on('close', () => {
    process.exit(0);
});
