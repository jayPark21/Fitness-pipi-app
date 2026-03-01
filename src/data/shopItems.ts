export interface ShopItem {
    id: string;
    name: string;
    category: 'hat' | 'glasses' | 'accessory' | 'background';
    price: number;
    icon: string;
    description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
    // HATS
    {
        id: 'cap-red',
        name: 'Red Training Cap',
        category: 'hat',
        price: 200,
        icon: '🔴🧢',
        description: 'Elite red cap for high-intensity training.'
    },
    {
        id: 'crown-gold',
        name: 'King of Cardio',
        category: 'hat',
        price: 2000,
        icon: '👑',
        description: 'Only for those who have conquered the peak.'
    },
    {
        id: 'ninja-band',
        name: 'Shadow Bandana',
        category: 'hat',
        price: 500,
        icon: '🥷',
        description: 'Silence your excuses.'
    },

    // GLASSES
    {
        id: 'sunglasses-cool',
        name: 'Elite Shades',
        category: 'glasses',
        price: 400,
        icon: '🕶️',
        description: 'Look cool while burning calories.'
    },
    {
        id: 'monocle-fancy',
        name: 'Scholar Monocle',
        category: 'glasses',
        price: 800,
        icon: '🧐',
        description: 'Analyze every muscle fiber.'
    },

    // ACCESSORIES
    {
        id: 'medal-gold',
        name: 'Gold Medal',
        category: 'accessory',
        price: 1500,
        icon: '🥇',
        description: 'You are a champion.'
    },
    {
        id: 'dumbbell',
        name: 'Mini Dumbbell',
        category: 'accessory',
        price: 300,
        icon: '🏋️',
        description: 'Pipi also wants to lift.'
    },

    // BACKGROUNDS
    {
        id: 'bg-gym',
        name: 'Iron Temple',
        category: 'background',
        price: 1000,
        icon: '🏢',
        description: 'The classic gym vibe.'
    },
    {
        id: 'bg-beach',
        name: 'Summer Shore',
        category: 'background',
        price: 1200,
        icon: '🏖️',
        description: 'Workout with a sea breeze.'
    }
];
