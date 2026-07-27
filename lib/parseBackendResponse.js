/**
 * Safely parse a fetch Response body as JSON.
 * Avoids "Unexpected end of JSON input" when the backend returns an empty body
 * (common during deploys, proxy errors, or API crashes).
 */
export async function parseBackendResponse(response) {
  const text = await response.text();

  if (!text.trim()) {
    return {
      success: false,
      installed: false,
      error: 'Empty response from API server',
      message: `The backend returned HTTP ${response.status} with no body. Verify NEXT_PUBLIC_BACKEND_URL and that the API is running.`,
      _emptyBody: true,
      _status: response.status,
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      installed: false,
      error: 'Invalid JSON from API server',
      message: text.length > 300 ? `${text.slice(0, 300)}…` : text,
      _invalidJson: true,
      _status: response.status,
    };
  }
}
