import {CircleBBox} from "../model/bbox/CircleBBox";
import * as konva from 'konva';
import {Representation} from "../model/Representation";
import {WeaponSlots} from "../game/WeaponSlots";
import {SimpleWeapon} from "../game/weapon/SimpleWeapon";
import {GrenadeWeapon} from "../game/weapon/GrenadeWeapon";
import {Unit} from "./Unit";
import {Armor} from "../game/Armor";
import {Tags} from "../game/Tags";

const Konva: any = konva;

export class Hero extends Unit {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 20);
        this.getHandlerMetadata('main').set('mass', 10);

        this.getHandlerMetadata('simulator').set('entity_behaviors', ['controllable', 'dump', 'gravity']);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));

        this.getHandlerMetadata('TeamBehavior').set('team', 1);

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

        this.tags = new Tags([
            Tags.TAG_LIGHT
        ]);

        this.weaponSlots = new WeaponSlots([
            new SimpleWeapon(this),
            new GrenadeWeapon(this)
        ]);

        this.armor = new Armor(2350, Armor.TYPE_LIGHT, 1);
    }

    getSafeRadius() {
        return this.getHandlerMetadata('main').get('radius') + 5;
    }
}