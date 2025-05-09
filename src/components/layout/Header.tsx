import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
    return (
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/chatx.png" alt="ChatX Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold">ChatX</span>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle displayThemeColor={false} />
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/login" className="text-sm hover:underline">Login</Link>
                    <Link to="/signup">
                        <Button size="sm" className="cursor-pointer">Register</Button>
                    </Link>
                </nav>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </Button>
            </div>
        </header>
    );
};

export default Header; 