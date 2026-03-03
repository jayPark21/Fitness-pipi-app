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
    EGG: { min: 1, max: 2, label: "알 🐣" },
    BABY: { min: 3, max: 5, label: "아기 피피 🐥" },
    TEEN: { min: 6, max: 9, label: "청소년 피피 🐧" },
    ADULT: { min: 10, max: 999, label: "성인 피피 👑" }
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
    const isEgg = level <= GROWTH_STAGES.EGG.max;
    const isBaby = level >= GROWTH_STAGES.BABY.min && level <= GROWTH_STAGES.BABY.max;
    const isTeen = level >= GROWTH_STAGES.TEEN.min && level <= GROWTH_STAGES.TEEN.max;

    const canEquip = (item: ShopItem) => {
        const req = item.requiredLevel || 0;
        return level >= req;
    };

    const getCantEquipReason = (item: ShopItem) => {
        const req = item.requiredLevel || 0;
        if (level >= req) return null;

        if (isEgg) return "알 상태에서 장착이라니.. 너 T야? 🐣";

        // 피피 성장 단계별 피드백 (Lv.6 청소년, Lv.10 성인)
        if (req >= 10 && level < 10) return `성인 피피(Lv.10)는 돼야 이 폼 소화 가능! 👑`;
        if (req >= 6 && level < 6) return `아직 너무 애기애기해! 청소년(Lv.6) 되면 힙해지자구! 🐧`;

        return `최상의 핏을 위해 Lv.${req} 찍고 갓생 템 장착 가보자고! 🚀`;
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
                    setTimeout(() => setErrorMsg(null), 3000);
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
                                            ? '이미 장착 중! ✓'
                                            : '드래그해서 장착!'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span className="text-slate-400 text-xs font-bold">{previewItem.requiredLevel}레벨부터 갓생 템 장착 가능!</span>
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
                            {isEgg ? GROWTH_STAGES.EGG.label :
                                isBaby ? GROWTH_STAGES.BABY.label :
                                    isTeen ? GROWTH_STAGES.TEEN.label :
                                        GROWTH_STAGES.ADULT.label}
                        </span>
                    </div>
                    {(isEgg || isBaby) && <Lock className="w-3 h-3 text-slate-600" />}
                </div>

                {/* MZ 스타일 절제된 중앙 경고 레이어 */}
                <AnimatePresence>
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md pointer-events-none"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    x: [0, -10, 10, -10, 10, 0] // Shake animation
                                }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <div className="text-6xl mb-2">🔒</div>
                                <h3 className="text-white font-black text-3xl tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    {errorMsg}
                                </h3>
                                <p className="text-teal-400 font-bold text-sm uppercase tracking-[0.3em] animate-pulse">
                                    Level Up Required 🐧
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
