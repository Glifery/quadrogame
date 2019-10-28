import {TemporaryEntity} from "./TemporaryEntity";
import * as konva from "konva";
import {Representation} from "../model/Representation";

const Konva: any = konva;

export class Explosion extends TemporaryEntity {
    private maxDistance: number;
    private maxBlastWave: number;

    init(): void {
        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            stroke: 'red',
            strokeWidth: 2
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection = representation.getProjection();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(this.getMaxDistance() * (this.getLifetime() / this.getMaxLifetime()) * projection.getScale());
            graphicElement.fill(`rgba(255,0,0,${0.2 * (1 - (this.getLifetime() / this.getMaxLifetime()))})`);
            graphicElement.stroke(`rgba(255,0,0,${1 - (this.getLifetime() / this.getMaxLifetime())})`);
        });
    }

    setMaxDistance(maxDistance: number): Explosion {
        this.maxDistance = maxDistance;

        return this;
    }

    getMaxDistance(): number {
        return this.maxDistance;
    }

    setMaxBlastWave(maxBlastWave: number): Explosion {
        this.maxBlastWave = maxBlastWave;

        return this;
    }

    getMaxBlastWave(): number {
        return this.maxBlastWave;
    }
}