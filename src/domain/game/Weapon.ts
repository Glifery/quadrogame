import {Entity} from "../model/Entity";
import {Simulator} from "../../application/physics/Simulator";

export abstract class Weapon {
    protected entity: Entity;
    protected reloadSpeed: number;
    protected damage: number;
    protected speed: number;
    protected bonusArmorType: string;
    protected bonusPercent: number;

    private lastFireTime: number;

    constructor(entity: Entity) {
        this.entity = entity;

        this.lastFireTime = new Date().getTime();
    }

    getEntity(): Entity {
        return this.entity;
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

    abstract fire(entity: Entity, multiplier: number, simulator: Simulator): void;
}
