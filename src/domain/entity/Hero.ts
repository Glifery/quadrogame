import {Entity} from "../model/Entity";
import {CircleBBox} from "../model/bbox/CircleBBox";
import * as konva from 'konva';
import {Representation} from "../model/Representation";
import {WeaponSlots} from "../game/WeaponSlots";
import {SimpleWeapon} from "../game/weapon/SimpleWeapon";
import {GrenadeWeapon} from "../game/weapon/GrenadeWeapon";

const Konva: any = konva;

export class Hero extends Entity {
    private weaponSlots: WeaponSlots;

    init(): void {
        this.getHandlerMetadata('main').set('radius', 20);
        this.getHandlerMetadata('main').set('mass', 10);

        this.getHandlerMetadata('simulator').set('entity_behaviors', ['controllable', 'dump', 'gravity']);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 1
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection = representation.getProjection();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(this.getHandlerMetadata('main').get('radius') * projection.getScale());
        });

        this.weaponSlots = new WeaponSlots([
            new SimpleWeapon(this),
            new GrenadeWeapon(this)
        ]);
    }

    getWeaponSlots(): WeaponSlots {
        return this.weaponSlots;
    }
}