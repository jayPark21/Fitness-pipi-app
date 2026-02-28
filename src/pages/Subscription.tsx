import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Crown, Check } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';

export default function Subscription() {
    const navigate = useNavigate();
    const { setUserState } = useStore();

    const handleApprove = (_data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
            alert("Transaction completed by " + details.payer.name.given_name);
            setUserState({ hasPremium: true });
            navigate('/dashboard');
        });
    };

    const createOrder = (_data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "4.99",
                    },
                },
            ],
        });
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-slate-900 border-x border-slate-800 relative">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 border border-slate-700/50 rounded-full hover:bg-slate-800"
                >
                    <span className="text-xl leading-none text-slate-400">←</span>
                </button>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                    Get Premium
                </h1>
            </header>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-b from-amber-500/20 to-slate-800/50 rounded-3xl p-8 shadow-2xl shadow-amber-500/10 border border-amber-500/20 mb-8"
                >
                    <div className="flex justify-center mb-6">
                        <Crown className="w-16 h-16 text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-white mb-2">Penguin Fit Pro</h2>
                    <p className="text-slate-300 text-center mb-6 text-sm">Unlock the ultimate fitness journey</p>

                    <ul className="space-y-4 mb-8 text-slate-200 text-sm">
                        <li className="flex items-center gap-3"><Check className="w-5 h-5 text-teal-400" /> Exclusive Penguin Ninja Skin</li>
                        <li className="flex items-center gap-3"><Check className="w-5 h-5 text-teal-400" /> 100+ Advanced HIIT Workouts</li>
                        <li className="flex items-center gap-3"><Check className="w-5 h-5 text-teal-400" /> Pro Analytics Dashboard</li>
                    </ul>

                    <div className="text-center font-bold text-3xl mb-8 font-sans drop-shadow-md">
                        $4.99<span className="text-lg text-slate-400 font-normal">/mo</span>
                    </div>

                    <div className="relative z-10 w-full rounded-2xl overflow-hidden bg-white/5 p-2">
                        <PayPalButtons
                            createOrder={createOrder}
                            onApprove={handleApprove}
                            style={{ layout: "vertical", shape: "pill" }}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
