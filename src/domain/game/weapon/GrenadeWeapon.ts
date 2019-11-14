import {Weapon} from "../Weapon";
import {Vector} from "../../model/Vector";
import {Armor} from "../Armor";
import {Grenade} from "../../entity/Grenade";
import {Unit} from "../../entity/Unit";

export class GrenadeWeapon extends Weapon {
    private lifetime: number;
    private kickback: number;

    constructor(unit: Unit) {
        super(unit);

        this.lifetime = 0.3;
        this.kickback = 5;
        this.reloadSpeed = 800;
        this.damage = 40;
        this.speed = 600;
        this.bonusArmorType = Armor.TYPE_HEAVY;
        this.bonusPercent = 0.3;
    }

    getDistance(): number {
        return this.getUnit().getSafeRadius() + (this.speed * this.lifetime) + 200;
    }

    fire(dir: number): void {
        const unit: Unit = this.getUnit();

        if (!this.isWeaponReady()) {
            return;
        }

        this.resetReadiness();

        let bulletPosition = Vector
            .createFromXY(unit.getPosition().getX(), unit.getPosition().getY())
            .addVector(Vector.createFromDirDis(dir, unit.getSafeRadius()));
        let grenade: Grenade = new Grenade(bulletPosition.getX(), bulletPosition.getY(), dir);

        grenade.setMaxLifetime(this.lifetime);
        grenade.getPosition().setSpeed(Vector.createFromDirDis(grenade.getAxis().getOrientation(), this.speed).addVector(unit.getPosition().getSpeed()));
        unit.getSpace().addEntity(grenade);

        unit.getPosition().addVector(
            Vector.createFromVector(grenade.getPosition().getSpeed()).invert().multiply(this.kickback)
        );
    }
}