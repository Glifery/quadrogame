import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Representation} from "../../../domain/model/Representation";
import {Entity} from "../../../domain/model/Entity";
import * as konva from 'konva';
import {Shape} from "konva/types/Shape";
import {KonvaAdapter} from "../adapter/KonvaAdapter";

const Konva: any = konva;

export class KonvaRendererStrategy implements RendererStrategyInterface {
    private konvaAdapter: KonvaAdapter;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.konvaAdapter = new KonvaAdapter(width, height, offsetX, offsetY);

        this.initCanvas(width, height);
    }

    initRenderer(entity: Entity): void {
        const rendererFn: () => Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get('init_fn');

        if (!rendererFn) {
            throw new Error('Entity is not added to KonvaTendererStrategy');
        }

        const shape: Shape = rendererFn();

        entity.getHandlerMetadata('KonvaRendererStrategy').set(`${this.konvaAdapter.getUnique()}_shape`, shape);
        this.konvaAdapter.getLayer().add(shape);
    }

    deleteRenderer(entity: Entity): void {
        const renderer: Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get(`${this.konvaAdapter.getUnique()}_shape`);

        if (renderer) {
            renderer.remove();
        }
    }

    rerenderEntity(representation: Representation): void {
        let rerenderFn: (Representation, Shape) => void = representation.getEntity().getHandlerMetadata('KonvaRendererStrategy').get('rerender_fn');

        if (rerenderFn) {
            rerenderFn(
                representation,
                representation.getEntity().getHandlerMetadata('KonvaRendererStrategy').get(`${this.konvaAdapter.getUnique()}_shape`)
            );
        }
    }

    finalizeRender(): void {
        this.konvaAdapter.getLayer().draw();
    }

    private initCanvas(width: number, height: number): void {
        this.konvaAdapter.getLayer().add(new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2
        }));
    }
}