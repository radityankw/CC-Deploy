export interface CodeSnippet {
  title: string;
  filename: string;
  language: string;
  code: string;
  description: string;
}

export const DATABASE_BLUEPRINT = `
-- =====================================================================
-- LANGKAH 1: DATABASE SCHEMA (DRAFT UNTUK DEPLOYMENT DI SUPABASE / MYSQL)
-- =====================================================================

-- 1. Tabel Users (Menyimpan informasi kredensial dan data dasar siswa)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Materials (Informasi umum modul pembelajaran)
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INT DEFAULT 60,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Lessons (Detail materi/sub-materi untuk setiap modul)
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content_markdown TEXT NOT NULL,
    order_position INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- 4. Tabel User_Progress (Relasi N:M untuk mencatat progres pengerjaan modul)
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    material_id INT NOT NULL,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    quiz_score INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY user_material_unique (user_id, material_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);
`;

export const LARAVEL_ROUTES = `
<?php
// =====================================================================
// LANGKAH 2: BACKEND (LARAVEL API ROUTES - routes/api.php)
// =====================================================================

use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\MaterialController;
use Illuminate\\Support\\Facades\\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes (Tamu / Guest)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Harus Autentikasi lewat Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth Actions
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Materials Actions
    Route::get('/materials', [MaterialController::class, 'index']); // Get all materials
    Route::get('/materials/{slug}', [MaterialController::class, 'show']); // Get single material with lessons
    Route::post('/materials/{id}/complete', [MaterialController::class, 'completeProgress']); // Mark as done & save score
});
`;

export const LARAVEL_AUTH_CONTROLLER = `
<?php
// =====================================================================
// LANGKAH 2: BACKEND (LARAVEL AUTH CONTROLLER - App/Http/Controllers/Api/AuthController.php)
// =====================================================================

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\Validator;

class AuthController extends Controller
{
    /**
     * Registrasi Akun Siswa Baru
     */
    public function register(Request $request)
    {
        // 1. Validasi Input Klien
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:8|confirmed' // password_confirmation wajib dikirim di req
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Simpan User Baru ke Database MySQL/Supabase
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // 3. Buat Access Token Klien menggunakan Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi berhasil',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 201);
    }

    /**
     * Otentikasi / Login Siswa
     */
    public function login(Request $request)
    {
        // 1. Validasi Input Kredensial
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau Password wajib diisi',
                'errors' => $validator->errors()
            ], 400);
        }

        // 2. Cari User & Verifikasi Password
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kombinasi email dan password salah.'
            ], 401);
        }

        // 3. Buat Sanctum Token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 200);
    }

    /**
     * Keluar dari Aplikasi / Revoke Token
     */
    public function logout(Request $request)
    {
        // Sanctum menghapus token aktif saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil keluar, token dicabut.'
        ], 200);
    }

    /**
     * Mendapatkan Profil Siswa Saat Ini
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    }
}
`;

export const LARAVEL_MATERIAL_CONTROLLER = `
<?php
// =====================================================================
// LANGKAH 2: BACKEND (LARAVEL MATERIAL CONTROLLER - App/Http/Controllers/Api/MaterialController.php)
// =====================================================================

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Material;
use App\\Models\\UserProgress;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class MaterialController extends Controller
{
    /**
     * Mengambil Semua Daftar Materi / Modul Pembelajaran
     */
    public function index()
    {
        // Menampilkan list material beserta data progress siswa saat ini
        $userId = Auth::id();
        $materials = Material::all()->map(function($material) use ($userId) {
            $progress = UserProgress::where('user_id', $userId)
                                    ->where('material_id', $material->id)
                                    ->first();
                                    
            $material->is_completed = $progress ? !is_null($progress->completed_at) : false;
            $material->quiz_score = $progress ? $progress->quiz_score : null;
            return $material;
        });

        return response()->json([
            'status' => 'success',
            'data' => $materials
        ], 200);
    }

    /**
     * Mengambil Detail Materi beserta Sub-Materi (Lessons) berdasarkan slug
     */
    public function show($slug)
    {
        $material = Material::where('slug', $slug)->with(['lessons' => function($query) {
            $query->orderBy('order_position', 'asc');
        }])->first();

        if (!$material) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi pembelajaran tidak ditemukan.'
            ], 404);
        }

        // Cek status progres user saat ini
        $progress = UserProgress::where('user_id', Auth::id())
                                ->where('material_id', $material->id)
                                ->first();

        return response()->json([
            'status' => 'success',
            'data' => [
                'material' => $material,
                'progress' => [
                    'is_completed' => $progress ? !is_null($progress->completed_at) : false,
                    'quiz_score' => $progress ? $progress->quiz_score : null
                ]
            ]
        ], 200);
    }

    /**
     * Menyelesaikan Modul & Menyimpan Nilai Kuis Siswa
     */
    public function completeProgress(Request $request, $id)
    {
        $request->validate([
            'quiz_score' => 'nullable|integer|between:0,100'
        ]);

        $userId = Auth::id();

        // Update atau sisipkan data progress (Upsert)
        $progress = UserProgress::updateOrCreate(
            ['user_id' => $userId, 'material_id' => $id],
            [
                'completed_at' => now(),
                'quiz_score' => $request->quiz_score
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Progres modul berhasil disimpan!',
            'data' => $progress
        ], 200);
    }
}
`;

export const VUE_LOGIN = `
<!-- =====================================================================
     LANGKAH 3: FRONTEND (VUEJS - views/LoginView.vue atau Login.vue)
     ===================================================================== -->
<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
        Masuk ke Portal Belajar
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Belum punya akun? 
        <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Daftar sekarang gratis
          </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-xl sm:px-10">
        <!-- Notifikasi Error -->
        <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">Alamat Email</label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="nama@email.com"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="form.password" 
                type="password" 
                required 
                placeholder="••••••••"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

// Reactive Form Object
const form = reactive({
  email: '',
  password: ''
});

// Penanganan submit login
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: form.email,
      password: form.password
    });

    // Simpan token ke LocalStorage untuk Autentikasi State
    const { access_token, user } = response.data.data;
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('user_profile', JSON.stringify(user));

    // Atur header axios default agar request berikutnya menyertakan JWT Token
    axios.defaults.headers.common['Authorization'] = \`Bearer \${access_token}\`;

    // Alihkan siswa ke Dashboard modul
    router.push('/dashboard');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Kombinasi kredensial salah.';
    } else {
      errorMessage.value = 'Tidak dapat terhubung ke server backend.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
`;

export const VUE_REGISTER = `
<!-- =====================================================================
     LANGKAH 3: FRONTEND (VUEJS - views/RegisterView.vue atau Register.vue)
     ===================================================================== -->
<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
        Daftar Akun Baru
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Sudah memiliki akun? 
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Masuk di sini
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-xl sm:px-10">
        <!-- Notifikasi Error/Gagal Validasi -->
        <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <div class="mt-1">
              <input 
                id="name" 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Budi Santoso"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">Alamat Email</label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="nama@email.com"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="form.password" 
                type="password" 
                required 
                placeholder="Minimal 8 karakter"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
            <div class="mt-1">
              <input 
                id="password_confirmation" 
                v-model="form.password_confirmation" 
                type="password" 
                required 
                placeholder="Ulangi password"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition"
            >
              {{ loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Password dan Konfirmasi Password tidak cocok!';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:8000/api/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    });

    const { access_token, user } = response.data.data;
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('user_profile', JSON.stringify(user));
    
    // Set Auth header setup default
    axios.defaults.headers.common['Authorization'] = \`Bearer \${access_token}\`;

    // Alihkan
    router.push('/dashboard');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Gagal mendaftar. Email mungkin sudah didaftarkan.';
    } else {
      errorMessage.value = 'Koneksi API bermasalah. Coba lagi.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
`;

export const VUE_DASHBOARD = `
<!-- =====================================================================
     LANGKAH 3: FRONTEND (VUEJS - views/DashboardView.vue atau Dashboard.vue)
     ===================================================================== -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navbar Header -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="p-1.5 bg-indigo-600 text-white rounded-md text-sm font-mono">B</span>
          Portal EduOnline
        </h1>
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-slate-700">Dosen/Siswa: {{ user?.name || 'Siswa' }}</span>
          <button 
            @click="handleLogout"
            class="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition"
          >
            Keluar (Logout)
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Banner -->
      <div class="bg-indigo-900 rounded-2xl p-8 mb-10 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 max-w-lg">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang di Hub Pembelajaran!</h2>
          <p class="mt-2 text-indigo-200 text-sm sm:text-base">
            Silakan pilih modul di bawah untuk memulai pembelajaran interaktif. Selesaikan kuis di akhir setiap materi untuk menguji pemahaman Anda.
          </p>
        </div>
        <div class="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-radial-gradient from-white"></div>
      </div>

      <!-- Section Title -->
      <div class="mb-6 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900">Modul Pembelajaran Mandiri</h3>
        <span class="text-xs text-slate-500 font-mono">{{ materials.length }} Modul Tersedia</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-slate-500 text-sm">Mengunduh data materi dari database Laravel API...</p>
      </div>

      <!-- Materials Grid Mapping -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="material in materials" 
          :key="material.id" 
          class="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
        >
          <div class="p-6 flex-1">
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-1 text-[10px] font-bold tracking-wide uppercase rounded bg-indigo-50 text-indigo-700">
                {{ material.difficulty_level }}
              </span>
              <span class="text-xs text-slate-500 flex items-center gap-1 font-mono">
                ⏱️ {{ material.duration_minutes }} Mins
              </span>
            </div>

            <h4 class="text-lg font-bold text-slate-900 mb-2">{{ material.title }}</h4>
            <p class="text-slate-600 text-sm line-clamp-3 mb-4">{{ material.description }}</p>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <!-- Progress Info -->
            <div class="flex items-center gap-1.5">
              <span 
                v-if="material.is_completed" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800"
              >
                ✓ Selesai 
                <span class="font-mono ml-1" v-if="material.quiz_score !== null">({{ material.quiz_score }}/100)</span>
              </span>
              <span 
                v-else 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800"
              >
                Belum Mulai
              </span>
            </div>

            <!-- Route Button detail -->
            <router-link 
              :to="'/materials/' + material.slug" 
              class="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-500"
            >
              Mulai Belajar →
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(true);
const materials = ref([]);
const user = ref(null);

onMounted(async () => {
  // Ambil data profil dari localStorage
  const savedUser = localStorage.getItem('user_profile');
  if (savedUser) user.value = JSON.parse(savedUser);

  // Ambil daftar materi pembelajaran dari API Laravel
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set header instance jika belum ter-set global
    axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;

    const response = await axios.get('http://localhost:8000/api/materials');
    materials.value = response.data.data;
  } catch (error) {
    console.error('Gagal memproses data materi:', error);
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
});

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: { Authorization: \`Bearer \${token}\` }
    });
  } catch (err) {
    console.warn('Backend Logout Fail:', err);
  } finally {
    // Bersihkan sesi di frontend
    localStorage.clear();
    router.push('/login');
  }
};
</script>
`;

export const VUE_MATERIAL_DETAIL = `
<!-- =====================================================================
     LANGKAH 3: FRONTEND (VUEJS - views/MaterialDetailView.vue atau MaterialDetail.vue)
     ===================================================================== -->
<template>
  <div class="min-h-screen bg-slate-50" v-if="!loading">
    <!-- Back Header -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/dashboard" class="flex items-center text-sm text-slate-600 hover:text-slate-900 font-semibold gap-1.5">
          ← Kembali ke Dashboard
        </router-link>
        <span class="text-xs bg-indigo-50 px-2 py-1 text-indigo-700 font-bold rounded">
          Status: {{ progress.is_completed ? 'Selesai' : 'Sedang Dipelajari' }}
        </span>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-4xl mx-auto py-10 px-4">
      <article class="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <!-- Title & Overhead -->
        <div class="border-b border-slate-100 pb-6 mb-6">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {{ material.title }}
          </h1>
          <p class="text-slate-500 text-sm">{{ material.description }}</p>
        </div>

        <!-- Lessons / Sub-Chapters -->
        <section class="space-y-8 mb-10">
          <div v-for="(lesson, idx) in material.lessons" :key="lesson.id" class="prose max-w-none">
            <h3 class="text-xl font-bold text-indigo-950 flex items-center gap-3">
              <span class="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                {{ idx + 1 }}
              </span>
              {{ lesson.title }}
            </h3>
            
            <!-- Body Content -->
            <div class="mt-3 text-slate-700 leading-relaxed text-sm bg-slate-50 p-5 rounded-lg border-l-4 border-indigo-500 whitespace-pre-wrap">
              {{ lesson.content_markdown }}
            </div>
          </div>
        </section>

        <!-- Kuis Mini untuk Menyelesaikan Modul -->
        <section class="mt-12 pt-8 border-t border-slate-200 bg-indigo-50/50 p-6 rounded-xl">
          <h3 class="text-lg font-bold text-indigo-900 mb-2">Kuis Akhir Modul</h3>
          <p class="text-slate-600 text-xs mb-4">Selesaikan kuis untuk secara resmi menandai modul ini telah selesai.</p>

          <div v-if="!progress.is_completed" class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-slate-800 mb-2">Pertanyaan: Menurut pembelajaran di atas, apa fungsi utamanya?</p>
              <div class="space-y-2 text-sm">
                <label v-for="(opt, idx) in quizOptions" :key="idx" class="flex items-center gap-2 p-2 bg-white rounded-md border border-slate-200 cursor-pointer hover:bg-indigo-50 transition">
                  <input type="radio" :value="idx" v-model="quizAnswer" name="quiz_option" class="text-indigo-600 focus:ring-indigo-500" />
                  <span class="text-slate-700 text-xs">{{ opt }}</span>
                </label>
              </div>
            </div>

            <button 
              @click="submitQuiz"
              :disabled="quizAnswer === null"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Submit Jawaban Kuis
            </button>
          </div>

          <div v-else class="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center justify-between text-emerald-800 text-sm">
            <span>
              Selamat! Anda telah menyelesaikan materi ini dengan nilai kuis 
              <strong class="font-mono text-base">{{ progress.quiz_score }} / 100</strong>.
            </span>
            <span class="text-xs bg-emerald-150 px-2 py-1 rounded text-emerald-900 font-bold">LULUS</span>
          </div>
        </section>
      </article>
    </main>
  </div>

  <div v-else class="text-center py-20">
    <p class="text-slate-500 text-sm">Memuat modul pembelajaran...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const loading = ref(true);

const material = ref(null);
const progress = ref({ is_completed: false, quiz_score: null });

const quizAnswer = ref(null);
const quizOptions = [
  'A. Mempercepat skalabilitas infrastruktur komputasi secara cloud',
  'B. Membantu pemrosesan data bervolume besar secara cerdas',
  'C. Memungkinkan mesin berinteraksi secara linguistik lewat teks/suara'
];

onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    
    // Tarik data materi dari API Laravel berdasarkan Router Parameter (slug)
    const slug = route.params.slug;
    const response = await axios.get(\`http://localhost:8000/api/materials/\${slug}\`);
    
    material.value = response.data.data.material;
    progress.value = response.data.data.progress;
  } catch (error) {
    console.error('Materi tidak ditemukan:', error);
    router.push('/dashboard');
  } finally {
    loading.value = false;
  }
});

const submitQuiz = async () => {
  if (quizAnswer.value === null) return;

  // Skor kuis dummy (misal jika siswa menjawab benar, yaitu opsi 0 untuk cloud, 1 untuk DS, atau 2 untuk NLP)
  // Di sini kita langsung memberikan status complete dengan skor 100
  loading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(\`http://localhost:8000/api/materials/\${material.value.id}/complete\`, {
      quiz_score: 100
    }, {
      headers: { Authorization: \`Bearer \${token}\` }
    });

    progress.value.is_completed = true;
    progress.value.quiz_score = 100;
  } catch (err) {
    console.error('Kuis gagal di-submit ke Laravel backend:', err);
  } finally {
    loading.value = false;
  }
};
</script>
`;
