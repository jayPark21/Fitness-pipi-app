import { Lock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS, type ShopItem } from '../data/shopItems';
import { Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    pipiZoneRef: React.RefObject<HTMLDivElement | null>;
}

const GROWTH_STAGES = {
    EGG: { min: 1, max: 2, label: "Egg 🐣" },
    BABY: { min: 3, max: 9, label: "Baby Pipi 🐥" },
    ADULT: { min: 10, max: 999, label: "Adult Pipi 🐧" }
};

/**
 * 인벤토리 트레이
 * - 탭(짧게 누름): 2초간 아이템 확대 미리보기
 * - 드래그: 피피 위에 드롭하여 장착
 */
export default function InventoryTray({ pipiZoneRef }: Props) {
    const { penguin, equipItem } = useStore();
    const [draggingItem, setDraggingItem] = useState<ShopItem | null>(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [isOverPipi, setIsOverPipi] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);

    // 탭 vs 드래그 구분용
    const pointerDownTime = useRef<number>(0);
    const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    const level = penguin.friendshipLevel;
    const isEgg = level < 3;
    const isAdult = level >= 10;
    const isBaby = level >= 3 && level < 10;

    const canEquip = (item: ShopItem) => {
        const req = item.requiredLevel || 0;
        return level >= req;
    };

    const getCantEquipReason = (item: ShopItem) => {
        const req = item.requiredLevel || 0;
        if (level >= req) return null;
        if (isEgg) return "Eggs can't wear gear! 🐣";
        if (req >= 10) return "Needs Adult Pipi (Lv.10+)! ✨";
        if (req >= 3) return "Needs Baby Pipi (Lv.3+)! 🐥";
        return "Level too low!";
    };

    const ownedItems = (penguin.ownedItems ?? [])
        .map(id => SHOP_ITEMS.find(i => i.id === id))
        .filter((item): item is ShopItem => !!item);

    const checkOverPipi = useCallback((clientX: number, clientY: number) => {
        const rect = pipiZoneRef.current?.getBoundingClientRect();
        if (!rect) return false;
        return clientX >= rect.left && clientX <= rect.right &&
            clientY >= rect.top && clientY <= rect.bottom;
    }, [pipiZoneRef]);

    useEffect(() => {
        if (!draggingItem) return;

        const onMove = (e: PointerEvent) => {
            e.preventDefault();
            hasMoved.current = true;
            setDragPos({ x: e.clientX, y: e.clientY });
            setIsOverPipi(checkOverPipi(e.clientX, e.clientY));
        };

        const onUp = (e: PointerEvent) => {
            if (checkOverPipi(e.clientX, e.clientY) && draggingItem) {
                const reason = getCantEquipReason(draggingItem);
                if (reason) {
                    setErrorMsg(reason);
                    setTimeout(() => setErrorMsg(null), 2500);
                } else {
                    equipItem(draggingItem.category, draggingItem.id);
                }
            }
            setDraggingItem(null);
            setIsOverPipi(false);
        };

        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onUp);
        const preventScroll = (e: TouchEvent) => { if (draggingItem) e.preventDefault(); };
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [draggingItem, checkOverPipi, equipItem]);

    const handlePointerDown = (item: ShopItem, e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        pointerDownTime.current = Date.now();
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
        hasMoved.current = false;
        setDraggingItem(item);
        setDragPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (item: ShopItem, e: React.PointerEvent) => {
        const elapsed = Date.now() - pointerDownTime.current;
        const dx = Math.abs(e.clientX - pointerDownPos.current.x);
        const dy = Math.abs(e.clientY - pointerDownPos.current.y);
        const isTap = elapsed < 250 && dx < 8 && dy < 8;

        if (isTap) {
            // 탭 → 미리보기 2초
            setDraggingItem(null);
            setPreviewItem(item);
            setTimeout(() => setPreviewItem(null), 2000);
        }
    };

    if (ownedItems.length === 0) return null;

    return (
        <>
            {/* 아이템 확대 미리보기 오버레이 (탭 시 2초) */}
            <AnimatePresence>
                {previewItem && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-3xl px-10 py-8 flex flex-col items-center gap-3 shadow-2xl">
                            <span className="text-8xl">{previewItem.icon}</span>
                            <p className="text-white font-black text-xl">{previewItem.name}</p>
                            <p className="text-slate-400 text-xs uppercase tracking-widest">{previewItem.category}</p>
                            {canEquip(previewItem) ? (
                                <div className="flex items-center gap-1.5 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-teal-400" />
                                    <span className="text-teal-400 text-xs font-bold">
                                        {penguin.equippedItems?.[previewItem.category as keyof typeof penguin.equippedItems] === previewItem.id
                                            ? 'Equipped ✓'
                                            : 'Drag to Equip!'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span className="text-slate-400 text-xs font-bold">Lv.{previewItem.requiredLevel} Required</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 인벤토리 트레이 */}
            <div className="mt-4 w-full max-w-xs z-10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {errorMsg ? (
                                <span className="text-red-400 animate-pulse">{errorMsg}</span>
                            ) : (
                                isEgg ? GROWTH_STAGES.EGG.label :
                                    isBaby ? GROWTH_STAGES.BABY.label :
                                        GROWTH_STAGES.ADULT.label
                            )}
                        </span>
                    </div>
                    {(isEgg || isBaby) && !isAdult && <Lock className="w-3 h-3 text-slate-600" />}
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {ownedItems.map(item => {
                        const isEquipped = penguin.equippedItems?.[item.category as keyof typeof penguin.equippedItems] === item.id;
                        const isEquippable = canEquip(item);
                        return (
                            <div
                                key={item.id}
                                onPointerDown={(e) => handlePointerDown(item, e)}
                                onPointerUp={(e) => handlePointerUp(item, e)}
                                className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all select-none relative
                                    ${isEquipped
                                        ? 'bg-teal-500/20 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.2)]'
                                        : !isEquippable
                                            ? 'bg-slate-900/40 border-slate-800 opacity-60 grayscale'
                                            : 'bg-slate-800/60 border-dashed border-slate-600/50 hover:bg-slate-700/50 hover:border-teal-500/40'
                                    }`}
                                style={{ touchAction: 'none' }}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-[8px] text-slate-500 font-bold mt-0.5 truncate max-w-[50px] text-center">{item.name.split(' ')[0]}</span>
                                {isEquipped && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border border-slate-900 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                )}
                                {!isEquippable && !isEquipped && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 드래그 중 고스트 이미지 */}
            {draggingItem && (
                <div
                    className="fixed pointer-events-none z-[9999]"
                    style={{ left: dragPos.x - 30, top: dragPos.y - 30 }}
                >
                    <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-4xl shadow-2xl transition-all duration-150 ${isOverPipi
                        ? 'bg-teal-500/40 border-2 border-teal-400 scale-[1.3] shadow-[0_0_30px_rgba(20,184,166,0.6)]'
                        : 'bg-slate-800/90 border-2 border-white/20 scale-100'
                        }`}>
                        {draggingItem.icon}
                    </div>
                </div>
            )}
        </>
    );
}
