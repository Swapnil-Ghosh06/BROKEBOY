"use client";

import { Badge } from "./badge";
import { Card } from "./card";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  TrendingUp,
  Wallet,
} from "lucide-react";

const defaultWallet = {
  balance: "0.00",
  currency: "INR",
  address: "Primary Acc",
  trend: "0%",
  trendUp: true,
  cardHolder: "Student",
  expiry: "12/28",
};

export function GlassWalletCard({
  balance = defaultWallet.balance,
  currency = defaultWallet.currency,
  address = defaultWallet.address,
  trend = defaultWallet.trend,
  trendUp = defaultWallet.trendUp,
  cardHolder = defaultWallet.cardHolder,
  expiry = defaultWallet.expiry,
  onSend,
  onReceive,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      drag
      dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
      dragElastic={0.1}
      dragMomentum={false}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      className={cn("w-full max-w-[400px] cursor-grab active:cursor-grabbing", className)}
    >
      <Card className="group relative h-56 overflow-hidden rounded-2xl border-white/5 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5">
        {/* Abstract Background Shapes */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />

        <div className="relative flex h-full flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Total Balance
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-white/40">
                    {currency === 'INR' ? '₹' : currency}
                  </span>
                  <h3 className="text-3xl font-display font-extrabold tracking-tighter text-white">
                    {balance}
                  </h3>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border-white/5 bg-white/5 backdrop-blur-sm px-2 py-0.5",
                trendUp ? "text-emerald-400" : "text-rose-400"
              )}
            >
              <TrendingUp className={`mr-1 h-3 w-3 ${!trendUp && 'rotate-180'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{trend}</span>
            </Badge>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 text-white/20">
                <CreditCard className="h-4 w-4" />
                <span>•••• 1337</span>
              </div>
              <span className="text-white/20">
                {expiry}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                {cardHolder}
              </span>
              <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 font-mono text-[10px] text-white/40 backdrop-blur-sm uppercase">
                {address}
              </span>
            </div>
          </div>

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20 rounded-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSend}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-white/10">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Set Limit</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReceive}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg border border-white/10 hover:bg-white/20 transition-colors">
                <ArrowDownLeft className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Add Funds</span>
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
