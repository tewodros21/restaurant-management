import { useRef } from "react";

export default function ReceiptModal({ order, items = [], onClose }) {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const win = window.open("", "", "width=380,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: monospace;
              padding: 12px;
            }
            h1 {
              text-align: center;
              margin: 4px 0;
            }
            p {
              text-align: center;
              margin: 2px 0;
              font-size: 12px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 2px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }
            .total {
              font-weight: bold;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  if (!order) return null;

  const total = items.reduce(
    (sum, i) => sum + Number(i.product_price) * i.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[320px] rounded-xl shadow-lg p-4">
        <div ref={receiptRef}>
          <h1>RestroETHIX</h1>
          <p>POS Receipt</p>

          <div className="divider" />

          <div className="row">
            <span>Order</span>
            <span>#{order.id}</span>
          </div>
          <div className="row">
            <span>Table</span>
            <span>{order.table}</span>
          </div>
          <div className="row">
            <span>Date</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="row">
            <span>Payment</span>
            <span>{order.payment_method}</span>
          </div>

          <div className="divider" />

          {items.map((item) => (
            <div key={item.id} className="row">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>
                {(item.quantity * Number(item.product_price)).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="divider" />

          <div className="row total">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>

          <p style={{ marginTop: 10 }}>
            Thank you for dining with us
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
