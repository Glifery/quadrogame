import {LifetimeBehavior} from "./LifetimeBehavior";
import {Simulator} from "../Simulator";
import {TemporaryEntity} from "../../../domain/entity/TemporaryEntity";
import {Explosion} from "../../../domain/entity/Explosion";
import {inject, injectable} from "inversify";
import {ExplosionBehavior} from "./ExplosionBehavior";

@injectable()
export class ExplodeOnLifetimeBehavior extends LifetimeBehavior {
    private lifetimeBehavior: LifetimeBehavior;
    private explosionBehavior: ExplosionBehavior;

    constructor(
        @inject(LifetimeBehavior) lifetimeBehavior: LifetimeBehavior,
        @inject(ExplosionBehavior) explosionBehavior: ExplosionBehavior
    ) {
        super();

        this.lifetimeBehavior = lifetimeBehavior;
        this.explosionBehavior = explosionBehavior;
    }

    protected deleteEntity(entity: TemporaryEntity, multiplier: number, simulator: Simulator): void {
        let explosion: Explosion = new Explosion(entity.getPosition().getX(), entity.getPosition().getY());

        explosion.setMaxLifetime(0.4);
        explosion.setMaxDistance(200);
        explosion.setMaxBlastWave(1000);
        explosion.addBehavior(this.lifetimeBehavior);
        explosion.addBehavior(this.explosionBehavior);

        entity.getSpace().addEntity(explosion);

        super.deleteEntity(entity, multiplier, simulator);
    }
}