import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Plus,
  Edit,
  Users,
  ShieldCheck,
  Tag,
  Zap
} from 'lucide-react';

const VipMembershipManager = () => {
  const { vipPlans, saveVipPlan, students, showToast } = useAdmin();

  const [promoCode, setPromoCode] = useState('CBSE2026');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [coupons, setCoupons] = useState([
    { code: 'CBSE2026', discount: '20% OFF', usage: '1,420 Uses', status: 'Active' },
    { code: 'VIPFIRST', discount: '50% OFF', usage: '890 Uses', status: 'Active' },
  ]);

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!promoCode) return;
    setCoupons([{ code: promoCode.toUpperCase(), discount: `${discountPercent}% OFF`, usage: '0 Uses', status: 'Active' }, ...coupons]);
    showToast(`Created Coupon ${promoCode.toUpperCase()} (${discountPercent}% OFF)`, 'success');
    setPromoCode('');
  };

  const vipStudents = students.filter((s) => s.vipStatus === 'VIP Active');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold mb-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIP Subscription & Revenue Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">VIP Membership Tier Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure VIP Pass pricing, unlock rules for live streams, NTA CBT tests, and generate promotional discount codes.
          </p>
        </div>
      </div>

      {/* Subscription Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between transition border ${
              plan.popular
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/20'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[10px] uppercase rounded-full shadow-lg">
                Most Popular Commerce Batch
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-lg">{plan.name}</h3>
                <Crown className={`w-5 h-5 ${plan.popular ? 'text-amber-400' : 'text-slate-500'}`} />
              </div>

              <div>
                <span className="text-3xl font-black text-white">₹{plan.price}</span>
                <span className="text-xs text-slate-400 font-medium ml-1">/ {plan.duration}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Active: <strong className="text-amber-400">{plan.activeSubscribers.toLocaleString()} Students</strong>
              </div>
              <button
                onClick={() => {
                  const newPrice = prompt(`Enter new price for ${plan.name}:`, plan.price);
                  if (newPrice && !isNaN(newPrice)) {
                    saveVipPlan({ ...plan, price: Number(newPrice) });
                  }
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition border border-slate-700"
              >
                Edit Price
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Generator & Active VIP Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coupon Generator */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-black text-white">Coupon & Promo Code Generator</h3>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. CBSE2026"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs uppercase font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Discount %</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Generate Discount Coupon
            </button>
          </form>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Promo Coupons</span>
            {coupons.map((c, i) => (
              <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-300">{c.code}</span>
                <span className="text-emerald-400 font-bold">{c.discount}</span>
                <span className="text-slate-500 text-[10px]">{c.usage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active VIP Subscribers Directory Preview */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">Active VIP Subscribers ({vipStudents.length})</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">100% Verified Members</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {vipStudents.map((stu) => (
              <div key={stu.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30" />
                  <div>
                    <strong className="text-white block">{stu.name}</strong>
                    <span className="text-slate-400 text-[11px]">{stu.email} • {stu.classLevel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-md border border-amber-500/30">
                    VIP Active
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Since {stu.joinDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipMembershipManager;
