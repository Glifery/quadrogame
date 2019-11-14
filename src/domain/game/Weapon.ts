import {Unit} from "../entity/Unit";

export abstract class Weapon {
    protected unit: Unit;
    protected reloadSpeed: number;
    protected damage: number;
    protected speed: number;
    protected bonusArmorType: string;
    protected bonusPercent: number;

    private lastFireTime: number;

    constructor(unit: Unit) {
        this.unit = unit;

        this.lastFireTime = new Date().getTime();
    }

    getUnit(): Unit {
        return this.unit;
    }

    getDamage(): number {
        return this.damage;
    }

    getSpeed(): number {
        return this.speed;
    }

    getBonusArmorType(): string {
        return this.bonusArmorType;
    }

    getBonusPercent(): number {
        return this.bonusPercent;
    }

    protected isWeaponReady(): boolean {
        let currentTime: number = new Date().getTime();

        if ((currentTime - this.lastFireTime) >= this.reloadSpeed) {
            return true;
        }

        return false;
    }

    protected resetReadiness(): void {
        this.lastFireTime = new Date().getTime();
    }

    abstract getDistance(): number;

    abstract fire(dir: number): void;
}
