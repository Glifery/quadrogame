import {Weapon} from "../Weapon";
import {Bullet} from "../../entity/Bullet";
import {Vector} from "../../model/Vector";
import {Armor} from "../Armor";
import {Unit} from "../../entity/Unit";

export class SimpleWeapon extends Weapon {
    private lifetime: number;
    private kickback: number;

    constructor(unit: Unit) {
        super(unit);

        this.lifetime = 0.4;
        this.kickback = 1;
        this.reloadSpeed = 400;
        this.damage = 40;
        this.speed = 1000;
        this.bonusArmorType = Armor.TYPE_HEAVY;
        this.bonusPercent = 0.3;
    }

    getDistance(): number {
        return this.getUnit().getSafeRadius() +  this.speed * this.lifetime;
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
        let bullet: Bullet = new Bullet(this, bulletPosition.getX(), bulletPosition.getY(), dir);

        bullet.setMaxLifetime(this.lifetime);
        bullet.getPosition().setSpeed(Vector.createFromDirDis(bullet.getAxis().getOrientation(), this.speed).addVector(unit.getPosition().getSpeed()));

        unit.getSpace().addEntity(bullet);

        unit.getPosition().addVector(
            Vector.createFromVector(bullet.getPosition().getSpeed()).invert().multiply(this.kickback)
        );
    }
}