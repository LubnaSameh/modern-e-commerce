'use client';

import { useState, useEffect } from 'react';
import { useServerStatus, ServerStatus } from '@/components/ServerStatusProvider';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServerStatusBar() {
    const { status, checkConnection } = useServerStatus();
    const [visible, setVisible] = useState(false);
    const [checking, setChecking] = useState(false);
    const [showInitialWarning, setShowInitialWarning] = useState(false);

    // إظهار تنبيه في المرة الأولى للتحذير عن استخدام قاعدة بيانات مجانية
    useEffect(() => {
        // Set to localStorage even though we're disabling it initially
        // This ensures the warning won't appear on other pages if enabled later
        localStorage.setItem('db_warning_shown', 'true');
    }, []);

    // نقوم بإظهار الشريط فقط عندما تكون حالة السيرفر offline أو reconnecting
    useEffect(() => {
        if (status === ServerStatus.OFFLINE || status === ServerStatus.RECONNECTING) {
            setVisible(true);
        } else if (status === ServerStatus.ONLINE) {
            // نخفي الشريط بعد ثانيتين من اتصال السيرفر
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [status]);

    // إذا لم تكن الحالة تتطلب عرض الشريط، نرجع null
    if (!visible && status !== ServerStatus.RECONNECTING) {
        return null;
    }

    // دالة لإعادة التحقق من الاتصال
    const handleCheckConnection = async () => {
        if (checking) return;

        setChecking(true);
        try {
            await checkConnection();
        } finally {
            setChecking(false);
        }
    };

    // تحديد اللون والرسالة بناءً على الحالة
    let bgColor = 'bg-amber-500';
    let message = 'Checking server connection...';
    let icon = <RefreshCw className="w-4 h-4 mr-2 animate-spin" />;

    if (status === ServerStatus.OFFLINE) {
        bgColor = 'bg-red-500';
        message = 'Lost connection to server. Trying to reconnect automatically...';
        icon = <WifiOff className="w-4 h-4 mr-2" />;
    } else if (status === ServerStatus.ONLINE) {
        bgColor = 'bg-green-500';
        message = 'Successfully reconnected to the server!';
        icon = <Wifi className="w-4 h-4 mr-2" />;
    }

    // رسالة التنبيه الأولية عن استخدام قاعدة بيانات مجانية
    if (showInitialWarning) {
        bgColor = 'bg-blue-500';
        message = 'This site uses a free PostgreSQL database for demonstration purposes. There may be occasional service interruptions.';
        icon = <AlertTriangle className="w-4 h-4 mr-2" />;
    }

    return (
        <AnimatePresence>
            {(visible || showInitialWarning) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${bgColor} text-white p-2 text-center text-sm sticky top-0 z-50 flex items-center justify-center`}
                >
                    {icon}
                    <span>{message}</span>

                    {status === ServerStatus.OFFLINE && (
                        <button
                            onClick={handleCheckConnection}
                            disabled={checking}
                            className="ml-3 px-2 py-0.5 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors flex items-center text-xs"
                        >
                            {checking ? (
                                <>
                                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                    Trying...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Retry
                                </>
                            )}
                        </button>
                    )}

                    {showInitialWarning && (
                        <button
                            onClick={() => setShowInitialWarning(false)}
                            className="ml-3 px-2 py-0.5 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors flex items-center text-xs"
                        >
                            <span>Close</span>
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
} 