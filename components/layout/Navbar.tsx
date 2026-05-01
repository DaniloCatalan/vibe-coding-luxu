"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/TranslationContext";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (pathname.startsWith('/admin')) {
      router.push('/');
    } else {
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1">{t('nav.buy')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('nav.rent')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('nav.sell')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('nav.saved')}</Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-nordic-dark/10 ml-2">
              <LanguageSelector />
              
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent relative flex-shrink-0">
                      <Image 
                        src={user.user_metadata.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"} 
                        alt="Profile" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-sm font-medium text-nordic-dark/70 hover:text-mosque transition-colors flex items-center gap-1"
                      title={t('nav.logout')}
                    >
                      <span className="material-icons text-[18px]">logout</span>
                      <span className="hidden sm:inline">{t('nav.logout')}</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="ml-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-mosque rounded-lg hover:bg-mosque/90 transition-colors shadow-soft"
                  >
                    {t('nav.login')}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
