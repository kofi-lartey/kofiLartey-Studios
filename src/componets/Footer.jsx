import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiHeart, HiArrowUp, HiMail } from 'react-icons/hi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { Icon: FaGithub, href: 'https://github.com/kofi-lartey?tab=repositories', label: 'GitHub' },
        { Icon: FaLinkedin, href: 'https://www.linkedin.com/in/alpheaus-gberbie-b6b141326/', label: 'LinkedIn' },
        { Icon: FaTwitter, href: 'https://x.com/GberbieAlpheaus', label: 'Twitter' },
        { Icon: FaInstagram, href: 'https://www.instagram.com/kofi_lart/', label: 'Instagram' },
    ];

    const footerLinks = [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Press Kit', href: '/press' },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="mt-12 md:mt-20 px-4 md:px-8 py-8 md:py-12 border-t border-white/5 text-gray-500 text-xs tracking-wide">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content - 3 Column Layout on Desktop, Stacked on Mobile */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 mb-6 md:mb-8">
                    {/* Left - Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <img 
                                src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                                alt="kofiLartey Studios Logo"
                                className="h-6 w-auto"
                            />
                        </div>
                        <p className="text-xs md:text-sm">© {currentYear} kofiLartey Studio. Engineered for Professionals.</p>
                    </div>

                    {/* Center - Quick Links */}
                    <div className="flex gap-3 md:gap-6 uppercase font-medium flex-wrap justify-center text-[10px] md:text-xs">
                        {footerLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="hover:text-indigo-400 transition-colors duration-200 touch-target"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Right - Contact/Email */}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 hover:text-indigo-400 transition-colors">
                        <HiMail size={14} />
                        <a href="mailto:kofilartey12@gmail.com" className="hover:text-indigo-400 text-xs md:text-sm">
                            kofilartey12@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar - Social & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/5">
                    {/* Social Icons */}
                    <div className="flex gap-4 md:gap-5">
                        {socialLinks.map(({ Icon, href, label }) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-gray-500 hover:text-indigo-400 transition-all duration-200 touch-target"
                                aria-label={label}
                            >
                                <Icon size={14} />
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-gray-600 text-[9px] md:text-[10px]">
                        <span>🔒 Secure SSL</span>
                        <span>✓ GDPR Compliant</span>
                        <span>⚡ 24/7 Support</span>
                    </div>

                    {/* Back to Top Button */}
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-400 transition-colors group touch-target"
                    >
                        <HiArrowUp className="group-hover:-translate-y-1 transition-transform" size={12} />
                        <span className="hidden md:inline text-xs">Back to Top</span>
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;