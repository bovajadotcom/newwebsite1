import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, RefreshCw, DollarSign } from "lucide-react";

export default function Calculator() {
  const [vehiclePrice, setVehiclePrice] = useState(25000);
  const [shipping, setShipping] = useState(1500);
  const [customsRate, setCustomsRate] = useState(10);
  const [serviceFee, setServiceFee] = useState(599);
  const [insurance, setInsurance] = useState(true);
  const [inspection, setInspection] = useState(true);

  const customsFee = (vehiclePrice + shipping) * (customsRate / 100);
  const insuranceFee = insurance ? vehiclePrice * 0.015 : 0;
  const inspectionFee = inspection ? 250 : 0;
  
  const total = vehiclePrice + shipping + customsFee + serviceFee + insuranceFee + inspectionFee;

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <CalcIcon className="text-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Import Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground">Estimate your total landed cost instantly.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="p-6 rounded-xl bg-card border border-border/50 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">Vehicle Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Vehicle Purchase Price ($)</label>
                  <input 
                    type="number" 
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value) || 0)}
                    className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Origin</label>
                    <select className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary">
                      <option>Japan (USS/TAA)</option>
                      <option>USA (Copart/IAAI)</option>
                      <option>Europe (Mobile.de)</option>
                      <option>UAE (Dubai)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Destination</label>
                    <select className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">Logistics & Fees</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Est. Ocean Freight ($)</label>
                  <input 
                    type="number" 
                    value={shipping}
                    onChange={(e) => setShipping(Number(e.target.value) || 0)}
                    className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Import Duty Rate (%)</label>
                  <input 
                    type="number" 
                    value={customsRate}
                    onChange={(e) => setCustomsRate(Number(e.target.value) || 0)}
                    className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={insurance}
                    onChange={(e) => setInsurance(e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-input text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground group-hover:text-white transition-colors">Marine Insurance (1.5% of value)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={inspection}
                    onChange={(e) => setInspection(e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-input text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground group-hover:text-white transition-colors">Pre-purchase Inspection ($250)</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-28 p-8 rounded-xl bg-secondary/30 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <h3 className="text-xl font-bold text-white mb-6">Cost Breakdown</h3>
              
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle Value</span>
                  <span className="text-white font-medium">${vehiclePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ocean Freight</span>
                  <span className="text-white font-medium">${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Import Duty ({customsRate}%)</span>
                  <span className="text-white font-medium">${customsFee.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                {insurance && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-white font-medium">${insuranceFee.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                )}
                {inspection && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inspection</span>
                    <span className="text-white font-medium">${inspectionFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AutoImport Fee</span>
                  <span className="text-white font-medium">${serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg text-white font-bold">Estimated Total</span>
                  <span className="text-4xl font-bold text-primary">${total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">*Excludes local registration and taxes</p>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                Save Quote & Contact Us <DollarSign size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
