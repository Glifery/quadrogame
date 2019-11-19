import {Entity} from "../model/Entity";
import {Armor} from "../game/Armor";
import {WeaponSlots} from "../game/WeaponSlots";
import {Tags} from "../game/Tags";

export abstract class Unit extends Entity {
    protected weaponSlots: WeaponSlots;
    protected armor: Armor;
    protected tags: Tags;

    getWeaponSlots(): WeaponSlots {
        return this.weaponSlots;
    }

    getArmor(): Armor {
        return this.armor;
    }

    abstract getSafeRadius(): number;
}