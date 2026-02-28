import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

/**
 * 대시보드 상단에 표시되는 알림 권한 요청 배너
 * 사용자가 이미 허용했거나 거부했으면 표시되지 않습니다.
 */
export default function NotificationBanner() {
    const { permissionStatus, requestPermission } = useNotifications();
    const [dismissed, setDismissed] = useState(false);

    // 이미 결정됐거나 닫았으면 숨김
    if (permissionStatus !== 'default' || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="mx-4 mt-4 bg-gradient-to-r from-teal-500/10 to-primary-500/10 border border-teal-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
                {/* Pipi 아이콘 + 벨 */}
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-teal-400" />
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">🐧 Pipi가 알려드릴게요!</p>
                    <p className="text-slate-400 text-xs mt-0.5">운동 안 하면 Pipi가 보고 싶어합니다. 알림을 켜두세요!</p>
                </div>

                {/* 버튼들 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                        onClick={requestPermission}
                        whileTap={{ scale: 0.95 }}
                        className="bg-teal-500 text-slate-900 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wide"
                    >
                        허용
                    </motion.button>
                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
