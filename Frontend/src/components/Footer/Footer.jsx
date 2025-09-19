const Footer = () => {
    return (
        <footer className="relative z-30 border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} Personal Data Vault - Vijay Kumar.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
