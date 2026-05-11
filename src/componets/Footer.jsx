import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiHeart, HiArrowUp, HiMail } from 'react-icons/hi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { Icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
        { Icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { Icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
        { Icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
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
        <footer className="mt-20 px-8 py-12 border-t border-white/5 text-gray-500 text-xs tracking-wide">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content - 3 Column Layout on Desktop */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    {/* Left - Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <img 
                                src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                                alt="kofiLartey Studios Logo"
                                className="h-8 w-auto"
                            />
                        </div>
                        <p>© {currentYear} kofiLartey Studio. Engineered for Professionals.</p>
                    </div>

                    {/* Center - Quick Links */}
                    <div className="flex gap-6 uppercase font-medium flex-wrap justify-center">
                        {footerLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="hover:text-indigo-400 transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Right - Contact/Email (Optional) */}
                    <div className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors">
                        <HiMail size={14} />
                        <a href="mailto:kofilartey12@gmail.com" className="hover:text-indigo-400">
                            kofilartey12@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar - Social & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
                    {/* Social Icons */}
                    <div className="flex gap-5">
                        {socialLinks.map(({ Icon, href, label }) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-gray-500 hover:text-indigo-400 transition-all duration-200"
                                aria-label={label}
                            >
                                <Icon size={14} />
                            </motion.a>
                        ))}
                    </div>


                    <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-[10px]">
                        <span>🔒 Secure SSL Encryption</span>
                        <span>✓ GDPR Compliant</span>
                        <span>⚡ 24/7 Support</span>
                    </div>


                    {/* Back to Top Button */}
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-400 transition-colors group"
                    >
                        <HiArrowUp className="group-hover:-translate-y-1 transition-transform" size={12} />
                        <span className="text-xs">Back to Top</span>
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;