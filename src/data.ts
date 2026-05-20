export interface MockLesson {
  id: number;
  title: string;
  content_markdown: string;
}

export interface MockMaterial {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  lessons: MockLesson[];
  quizQuestion: string;
  quizOptions: string[];
  correctQuizIndex: number;
}

export const MOCK_MATERIALS: MockMaterial[] = [
  {
    id: 1,
    title: 'Cloud Computing: Dasar-Dasar dan Layanan Utama AWS',
    slug: 'cloud-computing',
    description: 'Pelajari konsep dasar cloud computing (IaaS, PaaS, SaaS), model deployment, serta arsitektur serverless modern menggunakan AWS Lambda dan Amazon S3.',
    difficulty_level: 'Beginner',
    duration_minutes: 45,
    quizQuestion: 'Apa perbedaan utama antara konsep IaaS (Infrastructure as a Service) dengan PaaS (Platform as a Service) dalam administrasi awan?',
    quizOptions: [
      'A. IaaS hanya menyediakan software aplikasi siap pakai, sedangkan PaaS menyediakan infrastruktur server mentah.',
      'B. IaaS memberikan kontrol penuh atas OS dan infrastruktur virtual, sedangkan PaaS mengabstraksi OS sehingga pengembang fokus ke penulisan kode aplikasi.',
      'C. PaaS membutuhkan setup kabel fisik server secara manual, sedangkan IaaS bekerja secara nirkabel seluruhnya.',
      'D. Tidak ada perbedaan biaya ataupun model kontrol antara IaaS dan PaaS.'
    ],
    correctQuizIndex: 1,
    lessons: [
      {
        id: 11,
        title: 'Pengenalan Cloud Computing & Model Layanan',
        content_markdown: `Cloud Computing adalah penyediaan sumber daya IT sesuai permintaan (on-demand) melalui internet dengan model pembayaran sesuai pemakaian (pay-as-you-go). Alih-alih membeli dan memelihara pusat data fisik, Anda bisa menyewa kapasitas komputasi, penyimpanan, dan basis data dari penyedia cloud seperti AWS, Google Cloud, atau Azure.

Tiga Model Layanan Utama:
1. **Infrastructure as a Service (IaaS)**: Menyediakan akses ke fitur jaringan, mesin virtual, dan ruang penyimpanan data. Contoh: AWS EC2, Google Compute Engine. Anda mengelola sistem operasi dan middleware.
2. **Platform as a Service (PaaS)**: Mengurangi kebutuhan untuk mengelola infrastruktur dasar (Sistem Operasi dan perangkat keras). Memungkinkan Anda fokus pada deployment aplikasi. Contoh: Heroku, AWS Elastic Beanstalk.
3. **Software as a Service (SaaS)**: Produk lengkap yang dijalankan dan dikelola oleh penyedia layanan. Contoh: Google Workspace, Slack.`
      },
      {
        id: 12,
        title: 'Arsitektur Serverless Modern',
        content_markdown: `Serverless adalah model eksekusi cloud di mana penyedia cloud secara dinamis mengelola alokasi dan eksekusi sumber daya mesin virtual. Disebut "serverless" bukan karena tidak ada server, melainkan karena tugas pemeliharaan server diabstraksi sepenuhnya dari developer.

Kelebihan Serverless:
* **No Server Management**: Tidak perlu patch OS atau konfigurasi network.
* **Auto-Scaling**: Skala naik dan turun secara otomatis dari nol hingga ribuan request per detik tanpa intervensi manusia.
* **Pay-for-Value**: Anda hanya membayar ketika kode Anda berjalan (dihitung per milidetik). Jika tidak ada request, biaya adalah nol.`
      }
    ]
  },
  {
    id: 2,
    title: 'Data Science: Siklus Analisis & Visualisasi Python',
    slug: 'data-science',
    description: 'Pahami siklus hidup data science dari data ingestion, cleaning dengan Pandas, analisis statistik deskriptif, hingga teknik visualisasi interpretatif.',
    difficulty_level: 'Intermediate',
    duration_minutes: 60,
    quizQuestion: 'Dalam manipulasi data menggunakan library Pandas di Python, apa perbedaan fungsional antara metode loc[] dan iloc[]?',
    quizOptions: [
      'A. loc[] digunakan untuk pencarian berdasarkan indeks string/label, sedangkan iloc[] mencari menggunakan indeks berbasis integer (angka urutan).',
      'B. loc[] menghapus baris bernilai null, sedangkan iloc[] menambahkan baris data baru.',
      'C. iloc[] bekerja lebih lambat karena harus memproses komputasi GPU, sedangkan loc[] bekerja di memori CPU.',
      'D. Keduanya memiliki fungsi yang sepenuhnya indentik tanpa perbedaan parameter.'
    ],
    correctQuizIndex: 0,
    lessons: [
      {
        id: 21,
        title: 'Siklus Hidup Data Science',
        content_markdown: `Setiap proyek data science mengikuti alur kerja terstruktur yang disebut OSEMN:
1. **Obtain**: Mengumpulkan data dari berbagai sumber (file CSV, database SQL, web scraping, API).
2. **Scrub (Clean)**: Membersihkan data dari nilai duplikat, anomali, atau baris kosong (handling null values).
3. **Explore**: Melakukan Exploratory Data Analysis (EDA) dengan melihat distribusi statistika dasar (mean, median, standar deviasi) untuk melihat relasi antar variabel.
4. **Model**: Menerapkan algoritma machine learning (regresi, klasifikasi, clustering) untuk mengekstrak pola cerdas.
5. **iNterpret**: Menerjemahkan visualisasi statistika menjadi kesimpulan strategis bisnis.`
      },
      {
        id: 22,
        title: 'Manipulasi Data dengan Library Pandas',
        content_markdown: `Pandas adalah pustaka Python open-source yang paling populer untuk analisis data dan struktur data tabular. Pandas memperkenalkan objek utama:
* **Series**: Array satu dimensi berlabel.
* **DataFrame**: Struktur data dua dimensi seperti tabel SQL dengan kolom dan baris.

Metode penting penyaringan:
* \`df.head()\` : Menampilkan 5 data pertama.
* \`df[df['usia'] > 20]\` : Memfilter baris data berdasarkan kriteria numerik.
* \`df.groupby('kategori').mean()\` : Melakukan agregasi rata-rata berdasarkan kelompok grup.`
      }
    ]
  },
  {
    id: 3,
    title: 'Natural Language Processing (NLP): Pemrosesan Teks & LLM',
    slug: 'natural-language-processing',
    description: 'Jelajahi dasar pemrosesan bahasa alami dari tokenisasi, TF-IDF, embeddings vektor, hingga arsitektur modern Transformer yang mentenagai Large Language Models.',
    difficulty_level: 'Advanced',
    duration_minutes: 75,
    quizQuestion: 'Mengapa arsitektur Transformer (dengan mekanisme Self-Attention) lebih unggul dibandingkan arsitektur RNN (Recurrent Neural Network) tradisional dalam pengolahan deret kalimat teks panjang?',
    quizOptions: [
      'A. RNN membutuhkan daya listrik yang jauh lebih besar tanpa bisa dicolokkan ke server lokal.',
      'B. Transformer memproses seluruh token kalimat secara paralel sehingga mempercepat training GPU, serta mampu menangkap dependensi kata jarak jauh tanpa kehilangan memori konteks.',
      'C. RNN hanya bisa digunakan untuk bahasa Inggris sedangkan Transformer mendukung semua bahasa daerah di dunia secara otomatis.',
      'D. RNN tidak menggunakan operasi matriks matematika sama sekali.'
    ],
    correctQuizIndex: 1,
    lessons: [
      {
        id: 31,
        title: 'Pemrosesan Teks Mentah (Preprocessing)',
        content_markdown: `Sebelum mesin dapat memahami teks bahasa manusia, teks mentah harus melewati serangkaian tahapan preprocessing:
1. **Case Folding**: Mengubah seluruh huruf menjadi huruf kecil (lowercase).
2. **Tokenization**: Memecah paragraf atau kalimat panjang menjadi potongan kata-kata individual (tokens).
3. **Filtering / Stopwords Removal**: Menghapus kata hubung umum yang kurang memiliki nilai informasi (misal: "yang", "di", "dari", "dan").
4. **Stemming / Lemmatization**: Mengembalikan kata berimbuhan ke kata dasarnya. Misal: "menuliskan" menjadi "tulis".`
      },
      {
        id: 32,
        title: 'Arsitektur Transformer dan Era Large Language Model',
        content_markdown: `Arsitektur Transformer yang diperkenalkan dalam paper "Attention is All You Need" (2017) merevolusi dunia AI. Model ini menggantikan dependensi sekuensial RNN/LSTM dengan mekanisme **Self-Attention**.

Konsep Utama:
* **Self-Attention**: Mekanisme yang menghitung skor keterkaitan antar setiap kata dalam satu kalimat secara simultan, membantu model memahami makna kata berdasarkan konteks sekelilingnya (misalnya, perbedaan kata "apel" sebagai buah vs upacara).
* **Positional Encoding**: Menambahkan urutan kata ke dalam representasi vektor karena tidak adanya pemrosesan sekuensial dalam model paralel.`
      }
    ]
  }
];
