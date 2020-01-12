import {BehaviorInterface} from "./BehaviorInterface";
import {injectable} from "inversify";
import {Entity} from "../../../domain/model/Entity";
import {Simulator} from "../Simulator";
import {Vector} from "../../../domain/model/Vector";
import {Weapon} from "../../../domain/game/Weapon";
import {Unit} from "../../../domain/entity/Unit";

type EnemyData = {unit: Unit, distance: number};

@injectable()
export class TeamBehavior implements BehaviorInterface{
    static getName() {
        return 'null';
    }

    supports(entity: Entity): boolean {
        return (entity instanceof Unit) && this.getTeam(entity) >= 1;
    }

    handle(entity: Unit, multiplier: number, simulator: Simulator): void {
        if (this.getTeam(entity) == 1) {
            return;
        }

        const team = this.getTeam(entity);
        let enemiesData: EnemyData[] = [];

        for (let anotherEntity of simulator.getEntities()) {
            if (entity === anotherEntity) {
                continue;
            }
            if (!(anotherEntity instanceof Unit) || (!this.supports(anotherEntity))) {
                continue;
            }
            if (this.getTeam(anotherEntity) == team) {
                continue;
            }

            enemiesData.push({
                unit: anotherEntity,
                distance: Vector.createFromXY(
                    anotherEntity.getPosition().getX() - entity.getPosition().getX(),
                    anotherEntity.getPosition().getY() - entity.getPosition().getY()
                ).getDis()
            });
        }

        if (enemiesData.length == 0) {
            return;
        }

        this.sortEntitiesByDistance(enemiesData);

        this.tryKill(entity, enemiesData[0].unit);
    }

    private getTeam(entity: Entity) {
        return entity.getHandlerMetadata('TeamBehavior').get('team');
    }

    private sortEntitiesByDistance(enemiesData: EnemyData[]): void {
        enemiesData.sort((a: EnemyData, b: EnemyData) => a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0);
    }

    private tryKill(unit: Unit, targetEntity: Unit): void {
        const weapon: Weapon = unit.getWeaponSlots().getPrimaryWeapon();
        const targetVector: Vector = Vector.createFromXY(
            targetEntity.getPosition().getX() - unit.getPosition().getX(),
            targetEntity.getPosition().getY() - unit.getPosition().getY()
        );

        if (weapon.getDistance() <= targetVector.getDis()) {
            return;
        }

        unit.getAxis().setOrientation(targetVector.getDir());
        weapon.fire(targetVector.getDir());
    }
}