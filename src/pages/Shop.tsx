import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS, type ShopItem } from '../data/shopItems';
import { ChevronLeft, Sparkles, Check, Lock } from 'lucide-react';
import { useState } from 'react';

export default function Shop() {
    const navigate = useNavigate();
    const { penguin, buyItem, equipItem } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('hat');

    const categories = [
        { id: 'hat', label: 'Hats', icon: '🧢' },
        { id: 'glasses', label: 'Glasses', icon: '🕶️' },
        { id: 'accessory', label: 'Items', icon: '🎒' },
        { id: 'background', label: 'Scene', icon: '🏔️' }
    ];

    const filteredItems = SHOP_ITEMS.filter(item => item.category === selectedCategory);

    const handleAction = (item: ShopItem) => {
        const isOwned = (penguin.ownedItems ?? []).includes(item.id);
        if (isOwned) {
            const isEquipped = penguin.equippedItems?.[item.category as keyof typeof penguin.equippedItems] === item.id;
            if (isEquipped) {
                equipItem(item.category, undefined);
            } else {
                equipItem(item.category, item.id);
            }
        } else {
            if (penguin.xp >= item.price) {
                buyItem(item.id, item.price);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors group"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight uppercase italic flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                Pipi's Boutique
                            </h1>
                        </div>
                    </div>
                    <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-black text-lg">⚡ {penguin.xp}</span>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">XP</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full pt-28 pb-32 px-6">
                {/* Category Selector */}
                <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-tight transition-all whitespace-nowrap border-2
                                ${selectedCategory === cat.id
                                    ? 'bg-primary-500 border-primary-500 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'}
                            `}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {filteredItems.map((item, idx) => {
                        const isOwned = (penguin.ownedItems ?? []).includes(item.id);
                        const isEquipped = penguin.equippedItems?.[item.category as keyof typeof penguin.equippedItems] === item.id;
                        const canAfford = penguin.xp >= item.price;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleAction(item)}
                                className={`
                                    group relative aspect-[0.85] bg-slate-800/40 rounded-[2rem] p-6 border-2 flex flex-col items-center justify-between cursor-pointer transition-all duration-300
                                    ${isEquipped
                                        ? 'border-teal-500 bg-teal-500/5 shadow-[0_0_30px_rgba(20,184,166,0.1)] scale-[1.02]'
                                        : isOwned
                                            ? 'border-slate-700/50 hover:border-teal-500/50'
                                            : 'border-white/5 hover:border-white/10 hover:bg-white/5'}
                                `}
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>

                                <div className="text-center w-full">
                                    <h3 className="text-white font-black text-sm uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-tighter line-clamp-1">{item.description}</p>
                                </div>

                                <div className="mt-4 w-full">
                                    {isOwned ? (
                                        <div className={`
                                            w-full py-2 rounded-xl flex items-center justify-center gap-1 font-black text-[10px] uppercase tracking-widest transition-colors
                                            ${isEquipped ? 'bg-teal-500 text-slate-950' : 'bg-slate-900/50 text-teal-400 group-hover:bg-teal-500/20'}
                                        `}>
                                            {isEquipped ? 'Equipped' : 'Owned'}
                                        </div>
                                    ) : (
                                        <div className={`
                                            w-full py-2 rounded-xl flex items-center justify-center gap-1 font-black text-[10px] uppercase tracking-widest transition-all
                                            ${canAfford ? 'bg-slate-100 text-slate-900 group-hover:bg-primary-500 group-hover:text-slate-900' : 'bg-slate-800 text-slate-600 grayscale'}
                                        `}>
                                            {!canAfford && <Lock className="w-3 h-3 mr-1" />}
                                            ⚡ {item.price}
                                        </div>
                                    )}
                                </div>

                                {isEquipped && (
                                    <div className="absolute top-4 right-4 bg-teal-500 p-1.5 rounded-full shadow-lg">
                                        <Check className="w-3 h-3 text-slate-950 stroke-[4px]" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            {/* Float Bottom Navigation for PWA - Optional, we already have header */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Assets</span>
                    <span className="text-white font-black text-xl italic">{penguin.ownedItems.length} ITEMS</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-primary-500 text-slate-900 px-8 py-2 rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary-500/20"
                >
                    DONE
                </button>
            </div>
        </div>
    );
}
