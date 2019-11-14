import {CircleBBox} from "../model/bbox/CircleBBox";
import * as konva from "konva";
import {Representation} from "../model/Representation";
import {Armor} from "../game/Armor";
import {Unit} from "./Unit";
import {WeaponSlots} from "../game/WeaponSlots";
import {SimpleWeapon} from "../game/weapon/SimpleWeapon";

const Konva: any = konva;

export class Enemy extends Unit {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 30);
        this.getHandlerMetadata('main').set('mass', 10);

        this.getHandlerMetadata('simulator').set('entity_behaviors', ['null', 'dump', 'gravity']);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));

        this.getHandlerMetadata('TeamBehavior').set('team', 2);

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            fill: 'yellow',
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
            new SimpleWeapon(this)
        ]);

        this.armor = new Armor(150, Armor.TYPE_LIGHT, 1);
    }

    getSafeRadius() {
        return this.getHandlerMetadata('main').get('radius') + 10;
    }
}