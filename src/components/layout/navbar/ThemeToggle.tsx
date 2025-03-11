"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
    isMobile?: boolean;
}

export default function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    
    // Wait for component to be mounted to access theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
    
    // Desktop version
    if (!mounted) {
        return isMobile ? <div className="w-full p-2 h-10"></div> : <div className="w-5 h-5"></div>;
    }
    
    if (isMobile) {
        return (
            <button
                onClick={toggleTheme}
                className="flex items-center w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                {theme === "dark" ? (
                    <>
                        <Sun size={18} className="mr-2" />
                        <span>Light Mode</span>
                    </>
                ) : (
                    <>
                        <Moon size={18} className="mr-2" />
                        <span>Dark Mode</span>
                    </>
                )}
            </button>
        );
    }
    
    // Desktop version
    return (
        <button
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
} 