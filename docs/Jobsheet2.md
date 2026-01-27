# Jobsheet Node.js

# Buku Catatan CLI

A simple interactive **Node.js CLI Notes App** built with **yargs** and **readline**. This tool lets you add, read, and delete notes directly from your terminal with a friendly interactive prompt.

---

## Features

* ✅ Interactive mode
* ✅ Add, read, delete notes
* ✅ JSON file storage
* ✅ Short flags (`-j`, `-i`)
* ✅ Friendly error handling
* ✅ Auto help
* ✅ Exit with `quit`

---

## 📦 Requirements

* Node.js v16+
* npm

---

## Installation

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd buku-catatan
npm install
```

If you haven't installed deps yet:

```bash
npm install yargs chalk
```

---

## ▶️ Run the App

```bash
node app.js
```

You will enter interactive mode:

```
📒 >
```

Exit with:

```text
quit
```

---

## Commands

### ➕ Add Note

```bash
tambah -j "myday" -i "capek banget"
```

### 📖 Read All Notes

```bash
read_all
```

### 🔍 Read One Note

```bash
read -j "myday"
```

### 🗑 Delete Note

```bash
hapus -j "myday"
```

---

## 🏷 Flags

| Flag      | Alias | Description  |
| --------- | ----- | ------------ |
| --judul   | -j    | Note title   |
| --isi     | -i    | Note content |
| --help    |       | Show help    |
| --version |       | Show version |


---

## Data Storage

All notes are stored in:

```text
catatan.json
```

as an array of objects:

```json
[{ "judul": "myday", "isi": "capek" }]
```

---

## 🛠 Example Session

```
📒 > tambah -j belajar -i "Node.js itu seru"
📒 > read_all
📒 > read -j belajar
📒 > hapus -j belajar
📒 > quit
```

---




