import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X, CheckCircle2 } from "lucide-react";

export default function ReceiptModal({ order, items = [], onClose }) {
  const receiptRef = useRef(null);

  if (!order) return null;

  const total = items.reduce(
    (sum, i) => sum + Number(i.product_price) * i.quantity,
    0
  );

  const handlePrint = () => {
    const win = window.open("", "", "width=380,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Receipt_#${order.id}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; }
            .total { font-weight: bold; font-size: 18px; border-top: 1px solid #000; padding-top: 5px; }
            .header { font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-emerald-500 p-6 text-center text-white">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <CheckCircle2 size={28} />
          </motion.div>
          <h2 className="text-xl font-black">Payment Success</h2>
          <p className="text-emerald-100 text-sm">Order #{order.id} is now closed</p>
        </div>

        {/* Visual Receipt Preview */}
        <div className="p-8">
          <div 
            ref={receiptRef} 
            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-slate-700"
          >
            <div className="text-center mb-4">
              <h1 className="text-lg font-black tracking-tighter text-slate-900 header">RestroETHIX</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Digital POS Terminal</p>
            </div>

            <div className="divider border-t border-dashed border-slate-300 my-4" />

            <div className="space-y-1 text-xs">
              <div className="row flex justify-between"><span>ORDER ID</span> <span className="font-bold">#{order.id}</span></div>
              <div className="row flex justify-between"><span>TABLE</span> <span className="font-bold">{order.table}</span></div>
              <div className="row flex justify-between"><span>DATE</span> <span>{new Date().toLocaleDateString()}</span></div>
              <div className="row flex justify-between uppercase"><span>METHOD</span> <span>{order.payment_method}</span></div>
            </div>

            <div className="divider border-t border-dashed border-slate-300 my-4" />

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="truncate pr-4">{item.product_name} x{item.quantity}</span>
                  <span className="font-bold">${(item.quantity * Number(item.product_price)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-900 pt-3 mt-4 flex justify-between items-center total">
              <span className="text-sm font-bold">TOTAL PAID</span>
              <span className="text-xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest">
              --- Thank You ---
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} /> Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Printer size={18} /> Print
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}