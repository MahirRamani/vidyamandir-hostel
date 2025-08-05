import type { IStudent } from "@/types/student"
import type { IDepartment } from "@/types/department"
import type { IBuilding } from "@/types/building"
import type { IRoom } from "@/types/room"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> {
  students: T[]
  total: number
  page: number
  totalPages: number
}

interface StudentQueryParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

interface CreateStudentData {
  name: {
    firstName: string
    middleName: string
    lastName: string
  }
  profileImageUrl: string
  dateOfBirth: Date
  hobbies: string[]
  skills: string[]
  achievements: string[]
  studentId: string
  isPermanentId: boolean
  idConversionDate: Date
  roomId?: string
  bedNo?: number
  departmentId?: string | null
  admissionYear: string
  schoolRollNo: number
}

interface CreateDepartmentData {
  name: string
  HOD?: string
  subHOD?: string
  description: string
}

interface CreateBuildingData {
  name: string
  description?: string
  floors: number
  totalRooms: number
}

interface CreateRoomData {
  buildingId: string
  roomNumber: string
  floor: number
  capacity: number
  type: 'single' | 'double' | 'triple' | 'quad'
  amenities?: string[]
}

interface RoomAssignmentData {
  studentId: string
  bedNo?: number
}

interface StudentRoomRemovalData {
  studentId: string
}

interface StudentDepartmentAssignmentData {
  departmentId: string | null
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Student API methods
  async getStudents(params?: StudentQueryParams): Promise<ApiResponse<PaginatedResponse<IStudent>>> {
    const searchParams = new URLSearchParams()

    if (params?.search) searchParams.append("search", params.search)
    if (params?.status && params.status !== "all") searchParams.append("status", params.status)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString()
    const endpoint = `/students${queryString ? `?${queryString}` : ""}`

    return this.request<PaginatedResponse<IStudent>>(endpoint)
  }

  async getStudent(id: string): Promise<ApiResponse<IStudent>> {
    return this.request<IStudent>(`/students/${id}`)
  }

  async createStudent(data: CreateStudentData): Promise<ApiResponse<IStudent>> {
    return this.request<IStudent>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateStudent(id: string, data: Partial<CreateStudentData>): Promise<ApiResponse<IStudent>> {
    return this.request<IStudent>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteStudent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/students/${id}`, {
      method: "DELETE",
    })
  }

  // Department API methods
  async getDepartments(): Promise<ApiResponse<IDepartment[]>> {
    return this.request<IDepartment[]>("/departments")
  }

  async getDepartment(id: string): Promise<ApiResponse<IDepartment>> {
    return this.request<IDepartment>(`/departments/${id}`)
  }

  async createDepartment(data: CreateDepartmentData): Promise<ApiResponse<IDepartment>> {
    return this.request<IDepartment>("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateDepartment(id: string, data: Partial<CreateDepartmentData>): Promise<ApiResponse<IDepartment>> {
    return this.request<IDepartment>(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteDepartment(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/departments/${id}`, {
      method: "DELETE",
    })
  }

  async assignStudentToDepartment(studentId: string, departmentId: string | null): Promise<ApiResponse<IStudent>> {
    return this.request<IStudent>(`/students/${studentId}/department`, {
      method: "PUT",
      body: JSON.stringify({ departmentId } as StudentDepartmentAssignmentData),
    })
  }

  // Building API methods
  async getBuildings(): Promise<ApiResponse<IBuilding[]>> {
    return this.request<IBuilding[]>("/buildings")
  }

  async getBuilding(id: string): Promise<ApiResponse<IBuilding>> {
    return this.request<IBuilding>(`/buildings/${id}`)
  }

  async createBuilding(data: CreateBuildingData): Promise<ApiResponse<IBuilding>> {
    return this.request<IBuilding>("/buildings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateBuilding(id: string, data: Partial<CreateBuildingData>): Promise<ApiResponse<IBuilding>> {
    return this.request<IBuilding>(`/buildings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteBuilding(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/buildings/${id}`, {
      method: "DELETE",
    })
  }

  // Room API methods
  async getRooms(buildingId?: string): Promise<ApiResponse<IRoom[]>> {
    const endpoint = buildingId ? `/rooms?buildingId=${buildingId}` : "/rooms"
    return this.request<IRoom[]>(endpoint)
  }

  async getRoom(id: string): Promise<ApiResponse<IRoom>> {
    return this.request<IRoom>(`/rooms/${id}`)
  }

  async createRoom(data: CreateRoomData): Promise<ApiResponse<IRoom>> {
    return this.request<IRoom>("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateRoom(id: string, data: Partial<CreateRoomData>): Promise<ApiResponse<IRoom>> {
    return this.request<IRoom>(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteRoom(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/rooms/${id}`, {
      method: "DELETE",
    })
  }

  async assignStudentToRoom(roomId: string, studentId: string, bedNo?: number): Promise<ApiResponse<IRoom>> {
    return this.request<IRoom>(`/rooms/${roomId}/assign-student`, {
      method: "POST",
      body: JSON.stringify({ studentId, bedNo } as RoomAssignmentData),
    })
  }

  async removeStudentFromRoom(roomId: string, studentId: string): Promise<ApiResponse<IRoom>> {
    return this.request<IRoom>(`/rooms/${roomId}/remove-student`, {
      method: "POST",
      body: JSON.stringify({ studentId } as StudentRoomRemovalData),
    })
  }
}

export const apiClient = new ApiClient()