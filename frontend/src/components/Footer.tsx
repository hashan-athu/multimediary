import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-white/5 pt-20 pb-10 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.3)]">
              <Film className="text-white" size={22} />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-white">
              MULTI<span className="text-brand-primary">MEDIARY</span>
            </span>
          </Link>
          <p className="text-text-dim leading-relaxed">
            Your ultimate physical media library companion. Organize, search, and discover your collection with a cinematic experience.
          </p>
          <div className="flex items-center gap-4">
            {/* {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
              <button key={i} className="btn-icon w-10 h-10 hover:text-brand-secondary transition-colors">
                <Icon size={18} />
              </button>
            ))} */}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">Explore</h3>
          <nav className="flex flex-col gap-4">
            {["Home", "All Movies", "Categories", "Latest Releases", "Trending"].map((link) => (
              <Link key={link} href="#" className="text-text-dim hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">Help</h3>
          <nav className="flex flex-col gap-4">
            {["Support Center", "API Documentation", "Terms of Use", "Privacy Policy"].map((link) => (
              <Link key={link} href="#" className="text-text-dim hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">Newsletter</h3>
          <p className="text-text-dim">Subscribe to get the latest updates on your library.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="input-cinematic flex-1 py-3"
            />
            <button className="btn-primary px-6">JOIN</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-text-muted">
        <p>© 2024 MULTIMEDIARY. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 uppercase tracking-widest">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
