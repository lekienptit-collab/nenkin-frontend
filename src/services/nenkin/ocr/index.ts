import { request } from '@umijs/max';

/** Tinh nang doc giay to bang AI da bat hay chua GET /ocr/status */
export async function ocrStatus(options?: Record<string, any>) {
  return request<API.OcrStatus>('/ocr/status', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Doc anh giay to bang AI POST /ocr/worker-documents */
export async function extractWorkerDocuments(
  documents: API.OcrDocumentInput[],
  options?: Record<string, any>,
) {
  return request<API.OcrExtractResult>('/ocr/worker-documents', {
    method: 'POST',
    data: { documents },
    ...(options || {}),
  });
}
