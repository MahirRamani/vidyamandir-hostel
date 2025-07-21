interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
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
  async getStudents(params?: {
    search?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ students: any[]; total: number; page: number; totalPages: number }>> {
    const searchParams = new URLSearchParams()

    if (params?.search) searchParams.append("search", params.search)
    if (params?.status && params.status !== "all") searchParams.append("status", params.status)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString()
    const endpoint = `/students${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  async getStudent(id: string): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`)
  }

  async createStudent(data: any): Promise<ApiResponse<any>> {
    return this.request("/students", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateStudent(id: string, data: Partial<any>): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    return this.request(`/students/${id}`, {
      method: "DELETE",
    })
  }

  // Department API methods
  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.request("/departments")
  }

  async getDepartment(id: string): Promise<ApiResponse<any>> {
    return this.request(`/departments/${id}`)
  }

  async createDepartment(data: any): Promise<ApiResponse<any>> {
    return this.request("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateDepartment(id: string, data: Partial<any>): Promise<ApiResponse<any>> {
    return this.request(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteDepartment(id: string): Promise<ApiResponse<any>> {
    return this.request(`/departments/${id}`, {
      method: "DELETE",
    })
  }

  async assignStudentToDepartment(studentId: string, departmentId: string | null): Promise<ApiResponse<any>> {
    return this.request(`/students/${studentId}/department`, {
      method: "PUT",
      body: JSON.stringify({ departmentId }),
    })
  }
}

export const apiClient = new ApiClient()
