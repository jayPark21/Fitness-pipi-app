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
        requiredLevel: 10
    },
    {
        id: 'crown-gold',
        name: 'King of Cardio',
        category: 'hat',
        price: 2000,
        icon: '👑',
        description: 'Only for those who have conquered the peak.',
        requiredLevel: 10
    },
    {
        id: 'ninja-band',
        name: 'Shadow Bandana',
        category: 'hat',
        price: 500,
        icon: '🥷',
        description: 'Silence your excuses.',
        requiredLevel: 10
    },

    // GLASSES
    {
        id: 'sunglasses-cool',
        name: 'Elite Shades',
        category: 'glasses',
        price: 400,
        icon: '🕶️',
        description: 'Look cool while burning calories.',
        requiredLevel: 10
    },
    {
        id: 'monocle-fancy',
        name: 'Scholar Monocle',
        category: 'glasses',
        price: 800,
        icon: '🧐',
        description: 'Analyze every muscle fiber.',
        requiredLevel: 10
    },

    // ACCESSORIES
    {
        id: 'medal-gold',
        name: 'Gold Medal',
        category: 'accessory',
        price: 1500,
        icon: '🥇',
        description: 'You are a champion.',
        requiredLevel: 3
    },
    {
        id: 'dumbbell',
        name: 'Mini Dumbbell',
        category: 'accessory',
        price: 300,
        icon: '🏋️',
        description: 'Pipi also wants to lift.',
        requiredLevel: 3
    },

    // BACKGROUNDS
    {
        id: 'bg-gym',
        name: 'Iron Temple',
        category: 'background',
        price: 1000,
        icon: '🏢',
        description: 'The classic gym vibe.',
        requiredLevel: 10
    },
    {
        id: 'bg-beach',
        name: 'Summer Shore',
        category: 'background',
        price: 1200,
        icon: '🏖️',
        description: 'Workout with a sea breeze.',
        requiredLevel: 10
    }
];
