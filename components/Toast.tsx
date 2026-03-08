import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-0 left-1/2 z-[100] bg-white border-l-4 border-yellow-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-6 py-4 rounded-sm flex items-center gap-4 min-w-[320px] max-w-[90vw] overflow-hidden"
        >
          <div className="bg-yellow-100 p-2.5 rounded-full text-yellow-600 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">新称号解锁</p>
            <p className="text-[#2e1065] font-black text-lg leading-tight">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="关闭提示"
          >
            <X className="w-4 h-4" />
          </button>
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
            className="absolute left-0 bottom-0 h-1 w-full bg-yellow-300 origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
