import { Lock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS, type ShopItem } from '../data/shopItems';
import { Package } from 'lucide-react';

interface Props {
    /** 피피 드롭존의 ref - 여기 위에 놓으면 장착 */
    pipiZoneRef: React.RefObject<HTMLDivElement | null>;
}

const GROWTH_STAGES = {
    EGG: { min: 1, max: 2, label: "Egg 🐣" },
    BABY: { min: 3, max: 9, label: "Baby Pipi 🐥" },
    ADULT: { min: 10, max: 999, label: "Adult Pipi 🐧" }
};

/**
 * 인벤토리 트레이: 소유한 아이템을 보여주고, 드래그해서 피피에 장착!
 * - 알: 장착 불가 / 아기: 기본템만 / 성인: 모두 가능
 */
export default function InventoryTray({ pipiZoneRef }: Props) {
    const { penguin, equipItem } = useStore();
    const [draggingItem, setDraggingItem] = useState<ShopItem | null>(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [isOverPipi, setIsOverPipi] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    // 소유한 모든 아이템을 트레이에 표시 (장착 여부와 상관없이)
    const ownedItems = (penguin.ownedItems ?? [])
        .map(id => SHOP_ITEMS.find(i => i.id === id))
        .filter((item): item is ShopItem => !!item);

    // 피피 위에 있는지 체크
    const checkOverPipi = useCallback((clientX: number, clientY: number) => {
        const rect = pipiZoneRef.current?.getBoundingClientRect();
        if (!rect) return false;
        return clientX >= rect.left && clientX <= rect.right &&
            clientY >= rect.top && clientY <= rect.bottom;
    }, [pipiZoneRef]);

    // 글로벌 포인터 이벤트 (드래그 중)
    useEffect(() => {
        if (!draggingItem) return;

        const onMove = (e: PointerEvent) => {
            e.preventDefault();
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
                    // 🎉 피피 위에 드로! → 장착!
                    equipItem(draggingItem.category, draggingItem.id);
                }
            }
            setDraggingItem(null);
            setIsOverPipi(false);
        };

        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onUp);
        // 터치 디바이스에서 스크롤 방지
        const preventScroll = (e: TouchEvent) => { if (draggingItem) e.preventDefault(); };
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [draggingItem, checkOverPipi, equipItem]);

    const handleDragStart = (item: ShopItem, e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingItem(item);
        setDragPos({ x: e.clientX, y: e.clientY });
    };

    if (ownedItems.length === 0) return null;

    return (
        <>
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
                                onPointerDown={(e) => handleDragStart(item, e)}
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

            {/* 드래그 중 고스트 이미지 (손가락/마우스 따라다니는 아이콘) */}
            {draggingItem && (
                <div
                    className="fixed pointer-events-none z-[9999]"
                    style={{
                        left: dragPos.x - 30,
                        top: dragPos.y - 30,
                    }}
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
