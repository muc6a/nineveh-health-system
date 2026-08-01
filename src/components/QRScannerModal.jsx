import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, QrCode } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScan = (decodedText, decodedResult) => {
      scanner.clear();
      onScanSuccess(decodedText);
    };

    const onScanError = (errorMessage) => {
      // Html5QrcodeScanner will often fail to scan repeatedly if a QR isn't perfectly framed,
      // we only want to log actual errors or display a persistent one if needed.
    };

    scanner.render(onScan, onScanError);

    // Cleanup when modal closes
    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className="bg-slate-900 dark:bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-800 dark:border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white/10 dark:bg-slate-50 p-4 flex justify-between items-center border-b border-slate-700 dark:border-slate-200">
          <h2 className="text-sm font-black text-white dark:text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-600" />
            <span>مسح كود المنشأة (QR)</span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-200 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Body */}
        <div className="p-6">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center">
            قم بتوجيه كاميرا الهاتف نحو كود الـ QR الخاص بالمنشأة ليتم فتح ملفها تلقائياً وبدء التقييم.
          </p>
          <div className="rounded-2xl overflow-hidden border-2 border-dashed border-teal-500/50 p-2 bg-white/10 dark:bg-slate-50">
            <div id="qr-reader" className="w-full"></div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 dark:bg-red-50 text-red-400 dark:text-red-600 text-xs font-bold rounded-xl border border-red-800 dark:border-red-100 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
