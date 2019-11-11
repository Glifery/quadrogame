import {Weapon} from "../Weapon";
import {Bullet} from "../../entity/Bullet";
import {Vector} from "../../model/Vector";
import {LifetimeBehavior} from "../../../application/physics/behavior/LifetimeBehavior";
import {Entity} from "../../model/Entity";
import {Armor} from "../Armor";
import {Simulator} from "../../../application/physics/Simulator";

export class SimpleWeapon extends Weapon {
    private lifetime: number;
    private kickback: number;

    constructor(entity: Entity) {
        super(entity);

        this.lifetime = 0.3;
        this.kickback = 5;
        this.reloadSpeed = 400;
        this.damage = 40;
        this.speed = 600;
        this.bonusArmorType = Armor.TYPE_HEAVY;
        this.bonusPercent = 0.3;
    }

    fire(entity: Entity, multiplier: number, simulator: Simulator): void {
        if (!this.isWeaponReady()) {
            return;
        }

        this.resetReadiness();

        let bulletPosition = Vector
            .createFromXY(entity.getPosition().getX(), entity.getPosition().getY())
            .addVector(Vector.createFromDirDis(entity.getAxis().getOrientation(), 22));
        let bullet: Bullet = new Bullet(this, bulletPosition.getX(), bulletPosition.getY(), entity.getAxis().getOrientation());

        bullet.setMaxLifetime(this.lifetime);
        bullet.getPosition().setSpeed(Vector.createFromDirDis(bullet.getAxis().getOrientation(), this.speed).addVector(entity.getPosition().getSpeed()));

        entity.getSpace().addEntity(bullet);

        entity.getPosition().addVector(
            Vector.createFromVector(bullet.getPosition().getSpeed()).invert().multiply(this.kickback)
        );
    }
}