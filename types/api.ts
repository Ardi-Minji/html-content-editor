export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export interface GenerateHtmlResponse {
  success: boolean
  message: string
}
