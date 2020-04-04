import { NativeItemConfig } from './nativeTypesConfig'
import { DragDropMonitor } from '@/packages/dnd-core/src'

export class NativeDragSource {
	public item: any
	private config: NativeItemConfig

	public constructor(config: NativeItemConfig) {
		this.config = config
		this.item = {}
		this.initializeExposedProperties()
	}

	private initializeExposedProperties() {
		Object.keys(this.config.exposeProperties).forEach(property => {
			Object.defineProperty(this.item, property, {
				configurable: true, // This is needed to allow redefining it later
				enumerable: true,
				get() {
					// eslint-disable-next-line no-console
					console.warn(
						`Browser doesn't allow reading "${property}" until the drop event.`,
					)
					return null
				},
			})
		})
	}

	public loadDataTransfer(dataTransfer: DataTransfer | null | undefined) {
		if (dataTransfer) {
			const newProperties: PropertyDescriptorMap = {}
			Object.keys(this.config.exposeProperties).forEach(property => {
				newProperties[property] = {
					value: this.config.exposeProperties[property](
						dataTransfer,
						this.config.matchesTypes,
					),
					configurable: true,
					enumerable: true,
				}
			})
			Object.defineProperties(this.item, newProperties)
		}
	}

	public canDrag() {
		return true
	}

	public beginDrag() {
		return this.item
	}

	public isDragging(monitor: DragDropMonitor, handle: string) {
		return handle === monitor.getSourceId()
	}

	public endDrag() {
		// empty
	}
}
