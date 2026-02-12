import { useState } from 'react'
import { Eye, EyeOff, Shield, Globe, LockKeyhole, Mail } from 'lucide-react'
import { useAuthStore } from "@renderer/viewmodels/useAuthStore";

interface LoginPageProps {
  onLoginSuccess: (role: string) => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // State for Form Data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Call secure backend authentication via IPC
      const user = await window.api.login(formData.email, formData.password)

      setIsLoading(false)
      login(user)
      onLoginSuccess(user.role.toLowerCase())
    } catch (error) {
      setIsLoading(false)
      setError(
        language === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
      )
    }
  }

  const texts = {
    ar: {
      title: 'نظام إدارة السكن الجامعي',
      subtitle: 'بوابة الدخول الموحدة',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل البريد الإلكتروني',
      password: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      login: 'تسجيل الدخول',
      loggingIn: 'جاري التحقق...',
      secure: 'نظام آمن ومحمي'
    },
    en: {
      title: 'University Housing System',
      subtitle: 'Unified Login Portal',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      login: 'Sign In',
      loggingIn: 'Verifying...',
      secure: 'Secure System'
    }
  }

  const t = texts[language]

  return (
    <div
      className="min-h-screen w-full bg-primary flex items-center justify-center overflow-hidden relative"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* خلفية جمالية (Patterns) */}
      <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500 blur-[120px]" />
      </div>

      {/* Language Switcher */}
      <button
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all text-sm font-medium"
      >
        <Globe size={16} />
        <span>{language === 'ar' ? 'English' : 'العربية'}</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md z-10 p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header Section */}
          <div className="bg-gradient-to-b from-primary to-[#00152e] p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Shield className="w-10 h-10 text-primary" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-blue-200 text-sm font-light tracking-wide">{t.subtitle}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  <Mail size={16} className="text-secondary" />
                  {t.email}
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none text-primary font-medium placeholder:text-gray-400"
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  <LockKeyhole size={16} className="text-secondary" />
                  {t.password}
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none text-primary font-medium placeholder:text-gray-400"
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-[#e0b836] text-primary font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>{t.loggingIn}</span>
                  </>
                ) : (
                  <>{t.login}</>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={12} />
              <span>{t.secure}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
