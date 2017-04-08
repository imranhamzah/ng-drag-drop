import {Directive, ElementRef, HostListener, Input, Output, EventEmitter} from '@angular/core';
import {Ng2DragDropService} from "../services/ng2-drag-drop.service";
import {Utils} from "../shared/utils";

@Directive({
    selector: '[draggable]',
    host: {
        '[draggable]': 'true'
    }
})
/**
 * Makes an element draggable by adding the draggable html attribute
 */
export class Draggable {
    /**
     * The data that will be avaliable to the droppable directive on its `onDrop()` event.
     */
    @Input() dragData;

    /**
     * The selector that defines the drag Handle. If defined drag will only be allowed if dragged from the selector element.
     */
    @Input() dragHandle: string;

    /**
     * Currently not used
     */
    @Input() dragEffect = 'move';

    /**
     * Defines compatible drag drop pairs. Values must match both in draggable and droppable.dropScope.
     */
    @Input() dragScope: string | Array<string> = 'default';

    /**
     * CSS class applied on the draggable that is applied when the item is being dragged.
     */
    @Input() dragOverClass: string;

    /**
     * Event fired when Drag is started
     */
    @Output() onDragStart: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired while the element is being dragged
     */
    @Output() onDrag: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired when drag ends
     */
    @Output() onDragEnd: EventEmitter<any> = new EventEmitter();

    /**
     * Keeps track of mouse over element that is used to determine drag handles
     * @internal
     */
    mouseOverElement: any;


    constructor(protected el: ElementRef, private ng2DragDropService: Ng2DragDropService) {
    }

    @HostListener('dragstart', ['$event'])
    dragStart(e) {
        if (this.allowDrag()) {
            Utils.addClass(this.el, this.dragOverClass);
    
            this.ng2DragDropService.dragData = this.dragData;
            this.ng2DragDropService.scope = this.dragScope;

            e.stopPropagation();
            this.onDragStart.emit(e);
            this.ng2DragDropService.onDragStart.next();
        }
        else {
            e.preventDefault();
        }
    }

    @HostListener('drag', ['$event'])
    drag(e) {
        this.onDrag.emit(e)
    }

    @HostListener('dragend', ['$event'])
    dragEnd(e) {
        Utils.removeClass(this.el, this.dragOverClass);
        this.ng2DragDropService.onDragEnd.next();
        this.onDragEnd.emit(e);
        e.stopPropagation();
        e.preventDefault();
    }

    @HostListener('mouseover', ['$event'])
    mouseover(e) {
        this.mouseOverElement = e.target;
    }

    private allowDrag() {
        if (this.dragHandle)
            return Utils.matches(this.mouseOverElement, this.dragHandle);
        else
            return true;
    }
}
