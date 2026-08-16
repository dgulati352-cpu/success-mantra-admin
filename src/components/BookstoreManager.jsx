import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  ShoppingBag,
  Plus,
  PackageCheck,
  Truck,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

const BookstoreManager = () => {
  const {
    books,
    orders,
    searchQuery,
    openModal,
    deleteBook,
    updateOrderStatus
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'orders'
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All');

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedOrderStatus === 'All' || o.shippingStatus === selectedOrderStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingOrdersCount = orders.filter((o) => o.shippingStatus === 'Pending' || o.shippingStatus === 'Processing').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Official Commerce Bookstore & Logistics</span>
          </div>
          <h2 className="text-2xl font-black text-white">Book Catalog & Order Fulfillment</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch T.S. Grewal, Sandeep Garg & Poonam Gandhi reference books with BlueDart & Delhivery tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 font-extrabold rounded-xl transition ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Book Catalog ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-extrabold rounded-xl transition flex items-center space-x-1.5 ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Student Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full font-black">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => openModal('book')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition group"
            >
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg ${
                      book.status === 'In Stock'
                        ? 'bg-emerald-500/90 text-white'
                        : book.status === 'Low Stock'
                        ? 'bg-amber-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {book.status} ({book.stock})
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-blue-400">{book.subject}</span>
                    <span className="font-mono text-slate-500">{book.sku}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">{book.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Author: {book.author}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-white">₹{book.price}</span>
                    <span className="text-xs text-slate-500 line-through ml-2">₹{book.originalPrice}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{book.discount}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal('book', book)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition border border-slate-700"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Stock</span>
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition border border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Orders View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-black text-white">Student Book Orders & Shipping Queue</h3>

            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedOrderStatus(status)}
                  className={`px-3 py-1 font-bold rounded-lg transition ${
                    selectedOrderStatus === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order ID</th>
                  <th className="p-3.5">Student Details</th>
                  <th className="p-3.5">Books Purchased</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Shipping Status</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-950/50 transition">
                    <td className="p-3.5 font-bold font-mono text-white">{ord.id}</td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="font-bold text-white">{ord.studentName}</div>
                      <div className="text-[11px] text-slate-400">{ord.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate font-medium">
                      {ord.items.join(', ')}
                    </td>
                    <td className="p-3.5 font-black text-emerald-400">₹{ord.totalAmount}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${
                          ord.shippingStatus === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ord.shippingStatus === 'Shipped'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}
                      >
                        {ord.shippingStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openModal('orderDispatch', ord)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        Dispatch / Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookstoreManager;
