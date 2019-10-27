import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Representation} from "../../../domain/model/Representation";
import {Entity} from "../../../domain/model/Entity";
import * as konva from 'konva';
import {Layer} from "konva/types/Layer";
import {Stage} from "konva/types/Stage";
import {Shape} from "konva/types/Shape";

const Konva: any = konva;

export class KonvaRendererStrategy implements RendererStrategyInterface {
    private stage: Stage;
    private layer: Layer;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.stage = new Konva.Stage({
            container: 'container',
            width: width,
            height: height,
            offsetX: offsetX,
            offsetY: offsetY,
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.initCanvas(width, height);

        this.layer.draw();
    }

    initiateRenderer(entity: Entity): void {
        let renderer: Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get('init');

        if (!renderer) {
            throw new Error('Entity is not added to KonvaTendererStrategy');
        }

        this.layer.add(renderer);
    }

    deleteRenderer(entity: Entity): void {
        let renderer: Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get('init');

        if (renderer) {
            renderer.remove();
        }
    }

    rerenderEntity(representation: Representation): void {
        let rerenderFn: (Representation) => void = representation.getEntity().getHandlerMetadata('KonvaRendererStrategy').get('rerender_fn');

        if (rerenderFn) {
            rerenderFn(representation);
        }
    }

    finalizeRender(): void {
        this.layer.draw();
    }

    private initCanvas(width: number, height: number): void {
        this.layer.add(new Konva.Rect({
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