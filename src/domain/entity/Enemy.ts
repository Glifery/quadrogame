import {CircleBBox} from "../model/bbox/CircleBBox";
import {Representation} from "../model/Representation";
import {Armor} from "../game/Armor";
import {Unit} from "./Unit";
import {WeaponSlots} from "../game/WeaponSlots";
import {SimpleWeapon} from "../game/weapon/SimpleWeapon";
import {Tags} from "../game/Tags";
import {KonvaImage} from "../../application/graphics/util/KonvaImage";
import {Entity} from "../model/Entity";
import {Projection} from "../model/Projection";

const image = new KonvaImage('/assets/giga-wing.png');

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

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => image
            .createSprite(
                this.getHandlerMetadata('main').get('radius'),
                this.getHandlerMetadata('main').get('radius'),
                1, 1, 93, 93
            )
        );
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection: Projection = representation.getProjection();
            const entity: Entity = representation.getEntity();
            const rotation: number = entity.getAxis().getOrientation() + projection.getRotation();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());

            graphicElement.rotation(-(rotation - 90));
        });

        this.tags = new Tags([
            Tags.TAG_LIGHT
        ]);

        this.weaponSlots = new WeaponSlots([
            new SimpleWeapon(this)
        ]);

        this.armor = new Armor(150, Armor.TYPE_LIGHT, 1);
    }

    getSafeRadius() {
        return this.getHandlerMetadata('main').get('radius') + 5;
    }
}