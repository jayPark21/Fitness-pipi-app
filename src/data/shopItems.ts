export interface ShopItem {
    id: string;
    name: string;
    category: 'hat' | 'glasses' | 'accessory' | 'background';
    price: number;
    icon: string;
    description: string;
    requiredLevel?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
    // HATS
    {
        id: 'cap-red',
        name: 'Blue Training Cap',
        category: 'hat',
        price: 200,
        icon: '🧢',
        description: 'Cool blue cap for comfortable training.',
        requiredLevel: 6 // Teen
    },
    {
        id: 'ninja-band',
        name: 'Shadow Bandana',
        category: 'hat',
        price: 500,
        icon: '🥷',
        description: 'Silence your excuses.',
        requiredLevel: 8 // Late Teen
    },
    {
        id: 'crown-gold',
        name: 'King of Cardio',
        category: 'hat',
        price: 2000,
        icon: '👑',
        description: 'Only for those who have conquered the peak.',
        requiredLevel: 10 // Adult
    },

    // GLASSES
    {
        id: 'sunglasses-cool',
        name: 'Elite Shades',
        category: 'glasses',
        price: 400,
        icon: '🕶️',
        description: 'Look cool while burning calories.',
        requiredLevel: 6 // Teen
    },
    {
        id: 'monocle-fancy',
        name: 'Scholar Monocle',
        category: 'glasses',
        price: 800,
        icon: '🧐',
        description: 'Analyze every muscle fiber.',
        requiredLevel: 10 // Adult
    },
    {
        id: 'vr-goggles',
        name: 'VR Trainer',
        category: 'glasses',
        price: 1000,
        icon: '🥽',
        description: 'Workout in the metaverse.',
        requiredLevel: 10 // Adult
    },

    // ACCESSORIES
    {
        id: 'dumbbell',
        name: 'Mini Dumbbell',
        category: 'accessory',
        price: 300,
        icon: '🏋️',
        description: 'Pipi also wants to lift.',
        requiredLevel: 6 // Teen
    },
    {
        id: 'medal-gold',
        name: 'Gold Medal',
        category: 'accessory',
        price: 1500,
        icon: '🥇',
        description: 'You are a champion.',
        requiredLevel: 8 // Late Teen
    },
    {
        id: 'water-bottle',
        name: 'Crystal Clear',
        category: 'accessory',
        price: 100,
        icon: '🧪',
        description: 'Stay hydrated with premium filtered water.',
    },
    {
        id: 'running-shoes',
        name: 'Aero Runners',
        category: 'accessory',
        price: 800,
        icon: '👟',
        description: 'Run faster, jump higher.',
        requiredLevel: 6 // Teen
    },
    {
        id: 'dumbbell-gold',
        name: 'Golden Weight',
        category: 'accessory',
        price: 5000,
        icon: '🏋️',
        description: 'Pure luxury for your training routine.',
        requiredLevel: 10 // Adult
    },

    // BACKGROUNDS
    {
        id: 'bg-gym',
        name: 'Hardcore Gym',
        category: 'background',
        price: 1500,
        icon: '🏟️',
        description: 'The home of real gainz.',
    },
    {
        id: 'bg-beach',
        name: 'Sunset Beach',
        category: 'background',
        price: 3000,
        icon: '🏖️',
        description: 'Relax after a legendary workout.',
    }
];
