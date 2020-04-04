import * as React from 'react'
import wrapConnectorHooks from './wrapConnectorHooks'
import { Backend, Unsubscribe, Identifier } from '../../../dnd-core/src'
import { isRef } from '../utils/isRef'
import { DragSourceOptions, DragPreviewOptions } from '../interfaces'
import { shallowEqual } from '@react-dnd/shallowequal'

export interface Connector {
	hooks: any
	connectTarget: any
	receiveHandlerId(handlerId: Identifier | null): void
	reconnect(): void
}

export class SourceConnector implements Connector {
	public hooks = wrapConnectorHooks({
		dragSource: (
			node: Element | React.ReactElement | React.Ref<any>,
			options?: DragSourceOptions,
		) => {
			this.clearDragSource()
			this.dragSourceOptions = options || null
			if (isRef(node)) {
				this.dragSourceRef = node as React.RefObject<any>
			} else {
				this.dragSourceNode = node
			}
			this.reconnectDragSource()
		},
		dragPreview: (node: any, options?: DragPreviewOptions) => {
			this.clearDragPreview()
			this.dragPreviewOptions = options || null
			if (isRef(node)) {
				this.dragPreviewRef = node
			} else {
				this.dragPreviewNode = node
			}
			this.reconnectDragPreview()
		},
	})
	private handlerId: Identifier | null = null

	// The drop target may either be attached via ref or connect function
	private dragSourceRef: React.RefObject<any> | null = null
	private dragSourceNode: any
	private dragSourceOptionsInternal: DragSourceOptions | null = null
	private dragSourceUnsubscribe: Unsubscribe | undefined

	// The drag preview may either be attached via ref or connect function
	private dragPreviewRef: React.RefObject<any> | null = null
	private dragPreviewNode: any
	private dragPreviewOptionsInternal: DragPreviewOptions | null = null
	private dragPreviewUnsubscribe: Unsubscribe | undefined

	private lastConnectedHandlerId: Identifier | null = null
	private lastConnectedDragSource: any = null
	private lastConnectedDragSourceOptions: any = null
	private lastConnectedDragPreview: any = null
	private lastConnectedDragPreviewOptions: any = null

	private readonly backend: Backend

	public constructor(backend: Backend) {
		this.backend = backend
	}

	public receiveHandlerId(newHandlerId: Identifier | null) {
		if (this.handlerId === newHandlerId) {
			return
		}

		this.handlerId = newHandlerId
		this.reconnect()
	}

	public get connectTarget() {
		return this.dragSource
	}

	public get dragSourceOptions() {
		return this.dragSourceOptionsInternal
	}
	public set dragSourceOptions(options: DragSourceOptions | null) {
		this.dragSourceOptionsInternal = options
	}

	public get dragPreviewOptions() {
		return this.dragPreviewOptionsInternal
	}

	public set dragPreviewOptions(options: DragPreviewOptions | null) {
		this.dragPreviewOptionsInternal = options
	}

	public reconnect() {
		this.reconnectDragSource()
		this.reconnectDragPreview()
	}

	private reconnectDragSource() {
		const dragSource = this.dragSource
		// if nothing has changed then don't resubscribe
		const didChange =
			this.didHandlerIdChange() ||
			this.didConnectedDragSourceChange() ||
			this.didDragSourceOptionsChange()

		if (didChange) {
			this.disconnectDragSource()
		}

		if (!this.handlerId) {
			return
		}
		if (!dragSource) {
			this.lastConnectedDragSource = dragSource
			return
		}

		if (didChange) {
			this.lastConnectedHandlerId = this.handlerId
			this.lastConnectedDragSource = dragSource
			this.lastConnectedDragSourceOptions = this.dragSourceOptions
			this.dragSourceUnsubscribe = this.backend.connectDragSource(
				this.handlerId,
				dragSource,
				this.dragSourceOptions,
			)
		}
	}

	private reconnectDragPreview() {
		const dragPreview = this.dragPreview
		// if nothing has changed then don't resubscribe
		const didChange =
			this.didHandlerIdChange() ||
			this.didConnectedDragPreviewChange() ||
			this.didDragPreviewOptionsChange()

		if (!this.handlerId) {
			this.disconnectDragPreview()
		} else if (this.dragPreview && didChange) {
			this.lastConnectedHandlerId = this.handlerId
			this.lastConnectedDragPreview = dragPreview
			this.lastConnectedDragPreviewOptions = this.dragPreviewOptions
			this.disconnectDragPreview()
			this.dragPreviewUnsubscribe = this.backend.connectDragPreview(
				this.handlerId,
				dragPreview,
				this.dragPreviewOptions,
			)
		}
	}

	private didHandlerIdChange(): boolean {
		return this.lastConnectedHandlerId !== this.handlerId
	}

	private didConnectedDragSourceChange(): boolean {
		return this.lastConnectedDragSource !== this.dragSource
	}

	private didConnectedDragPreviewChange(): boolean {
		return this.lastConnectedDragPreview !== this.dragPreview
	}

	private didDragSourceOptionsChange(): boolean {
		return !shallowEqual(
			this.lastConnectedDragSourceOptions,
			this.dragSourceOptions,
		)
	}

	private didDragPreviewOptionsChange(): boolean {
		return !shallowEqual(
			this.lastConnectedDragPreviewOptions,
			this.dragPreviewOptions,
		)
	}

	private disconnectDragSource() {
		if (this.dragSourceUnsubscribe) {
			this.dragSourceUnsubscribe()
			this.dragSourceUnsubscribe = undefined
		}
	}

	private disconnectDragPreview() {
		if (this.dragPreviewUnsubscribe) {
			this.dragPreviewUnsubscribe()
			this.dragPreviewUnsubscribe = undefined
			this.dragPreviewNode = null
			this.dragPreviewRef = null
		}
	}

	private get dragSource() {
		return (
			this.dragSourceNode || (this.dragSourceRef && this.dragSourceRef.current)
		)
	}

	private get dragPreview() {
		return (
			this.dragPreviewNode ||
			(this.dragPreviewRef && this.dragPreviewRef.current)
		)
	}

	private clearDragSource() {
		this.dragSourceNode = null
		this.dragSourceRef = null
	}

	private clearDragPreview() {
		this.dragPreviewNode = null
		this.dragPreviewRef = null
	}
}
