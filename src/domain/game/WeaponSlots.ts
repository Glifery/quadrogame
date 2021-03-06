import {Weapon} from "./Weapon";

export class WeaponSlots {
    private weapons: Weapon[];

    constructor(weapons: Weapon[]) {
        this.weapons = weapons;
    }

    getPrimaryWeapon() {
        return this.weapons[0];
    }

    getSecondaryWeapon() {
        return this.weapons[1];
    }

    swapWeapons() {
        this.weapons = [
            this.weapons[1],
            this.weapons[0]
        ]
    }
}