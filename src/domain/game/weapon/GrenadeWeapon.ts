import {Weapon} from "../Weapon";
import {Vector} from "../../model/Vector";
import {Entity} from "../../model/Entity";
import {Armor} from "../Armor";
import {Simulator} from "../../../application/physics/Simulator";
import {Grenade} from "../../entity/Grenade";

export class GrenadeWeapon extends Weapon {
    private lifetime: number;
    private kickback: number;

    constructor(entity: Entity) {
        super(entity);

        this.lifetime = 0.3;
        this.kickback = 5;
        this.reloadSpeed = 800;
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
        let grenade: Grenade = new Grenade(bulletPosition.getX(), bulletPosition.getY(), entity.getAxis().getOrientation());

        grenade.setMaxLifetime(this.lifetime);
        grenade.getPosition().setSpeed(Vector.createFromDirDis(grenade.getAxis().getOrientation(), this.speed).addVector(entity.getPosition().getSpeed()));
        entity.getSpace().addEntity(grenade);

        entity.getPosition().addVector(
            Vector.createFromVector(grenade.getPosition().getSpeed()).invert().multiply(this.kickback)
        );
    }
}