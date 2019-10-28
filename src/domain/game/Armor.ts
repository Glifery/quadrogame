export class Armor {
    public static TYPE_HEAVY = 'heavy';
    public static TYPE_LIGHT = 'light';

    private health: number;
    private maxHealth: number;
    private type: string;
    private armor: number;

    constructor(maxHealth: number, type: string, armor: number) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.type = type;
        this.armor = armor;
    }

    getHealth(): number {
        return this.health;
    }

    decreaseHealth(decrease: number): number {
        return this.health -= decrease;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    getType(): string {
        return this.type;
    }

    getArmor(): number {
        return this.armor;
    }
}