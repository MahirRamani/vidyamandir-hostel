// models/index.ts
import { Student } from './Student'
import { Department } from './Department'
import { Room } from './Room'
import { Building } from './Building'

// Export all models
export { Student, Department, Room, Building }

// This ensures all models are registered when any model is imported
export default { Student, Department, Room, Building }