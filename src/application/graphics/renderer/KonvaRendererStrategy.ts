import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Representation} from "../../../domain/model/Representation";
import {Entity} from "../../../domain/model/Entity";
import * as konva from 'konva';
import {Layer} from "konva/types/Layer";
import {Stage} from "konva/types/Stage";
import {Shape} from "konva/types/Shape";

const Konva: any = konva;

export class KonvaRendererStrategy implements RendererStrategyInterface {
    private unique: number;
    private stage: Stage;
    private layer: Layer;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.unique = Math.round(Math.random() * 1000);

        const element = document.createElement('div');

        element.setAttribute("id", `container_${this.unique}`);
        element.setAttribute("class", 'canvas_container');
        element.setAttribute("style", `left: ${offsetX}px; top: ${offsetY}px;`);
        document.getElementById('canvas_containers').appendChild(element);

        this.stage = new Konva.Stage({
            container: `container_${this.unique}`,
            width: width,
            height: height
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.initCanvas(width, height);

        this.layer.draw();
    }

    initRenderer(entity: Entity): void {
        const rendererFn: () => Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get('init_fn');

        if (!rendererFn) {
            throw new Error('Entity is not added to KonvaTendererStrategy');
        }

        const shape: Shape = rendererFn();

        entity.getHandlerMetadata('KonvaRendererStrategy').set(`${this.unique}_shape`, shape);
        this.layer.add(shape);
    }

    deleteRenderer(entity: Entity): void {
        const renderer: Shape = entity.getHandlerMetadata('KonvaRendererStrategy').get(`${this.unique}_shape`);

        if (renderer) {
            renderer.remove();
        }
    }

    rerenderEntity(representation: Representation): void {
        let rerenderFn: (Representation, Shape) => void = representation.getEntity().getHandlerMetadata('KonvaRendererStrategy').get('rerender_fn');

        if (rerenderFn) {
            rerenderFn(
                representation,
                representation.getEntity().getHandlerMetadata('KonvaRendererStrategy').get(`${this.unique}_shape`)
            );
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