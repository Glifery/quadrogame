import {CircleBBox} from "../model/bbox/CircleBBox";
import {Representation} from "../model/Representation";
import {WeaponSlots} from "../game/WeaponSlots";
import {SimpleWeapon} from "../game/weapon/SimpleWeapon";
import {GrenadeWeapon} from "../game/weapon/GrenadeWeapon";
import {Unit} from "./Unit";
import {Armor} from "../game/Armor";
import {Tags} from "../game/Tags";
import {HeroOsd} from "../../application/graphics/osd/HeroOsd";
import {Projection} from "../model/Projection";
import {Shape} from "konva/types/Shape";
import {KonvaImage} from "../../application/graphics/util/KonvaImage";
import {Entity} from "../model/Entity";
import {ControllableBehavior} from "../../application/physics/behavior/ControllableBehavior";

const image = new KonvaImage('/assets/giga-wing.png');

export class Hero extends Unit {
    private heroOsd: HeroOsd;

    init(): void {
        this.getHandlerMetadata('main').set('radius', 20);
        this.getHandlerMetadata('main').set('mass', 10);

        this.getHandlerMetadata('simulator').set('entity_behaviors', ['controllable', 'dump', 'gravity']);

        this.getHandlerMetadata('ControllableBehavior').set('movement_aceleration', 400);
        this.getHandlerMetadata('ControllableBehavior').set('movement_max_speed', 1100);
        this.getHandlerMetadata('ControllableBehavior').set('rotation_aceleration', 200);
        this.getHandlerMetadata('ControllableBehavior').set('rotation_max_speed', 320);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));

        this.getHandlerMetadata('TeamBehavior').set('team', 1);

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => image
            .createSprite(
                this.getHandlerMetadata('main').get('radius'),
                this.getHandlerMetadata('main').get('radius'),
                175, 110, 67, 73
            )
        );
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: Shape) => {
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
            new SimpleWeapon(this),
            new GrenadeWeapon(this)
        ]);

        this.armor = new Armor(2350, Armor.TYPE_LIGHT, 1);

        this.heroOsd = new HeroOsd(
            null,
            300, 100, 20, 800
        ).resetEntity(this).startRendering(10);
    }

    getSafeRadius() {
        return this.getHandlerMetadata('main').get('radius') + 5;
    }
}