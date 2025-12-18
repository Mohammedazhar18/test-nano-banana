
export interface ImageHistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface EditRequest {
  imageB64: string;
  prompt: string;
}
