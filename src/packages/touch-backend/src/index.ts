import { DragDropManager, BackendFactory } from '@/packages/dnd-core/src'
import { TouchBackendOptions } from './interfaces'
import TouchBackend from './TouchBackend'

const createBackend: BackendFactory = (
	manager: DragDropManager,
	context: any,
	options: TouchBackendOptions = {},
) => new TouchBackend(manager, context, options)

export default createBackend
