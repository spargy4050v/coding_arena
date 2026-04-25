package middleware

import (
	"io"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

// setupTestRouter creates a Gin router in test mode with no middleware.
// This allows tests to add only the middleware they want to test.
func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	return gin.New()
}

// makeRequest is a helper to create and execute HTTP test requests with optional headers.
// It returns the response recorder so tests can inspect status, headers, and body.
func makeRequest(router *gin.Engine, method, path string, headers map[string]string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, nil)
	
	// Add custom headers if provided
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	
	router.ServeHTTP(w, req)
	return w
}

// makeRequestWithBody is a helper to create and execute HTTP test requests with a body.
// It returns the response recorder so tests can inspect status, headers, and body.
func makeRequestWithBody(router *gin.Engine, method, path string, body string, headers map[string]string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	
	// Create request with body
	var bodyReader io.Reader
	if body != "" {
		bodyReader = strings.NewReader(body)
	}
	req := httptest.NewRequest(method, path, bodyReader)
	
	// Add custom headers if provided
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	
	router.ServeHTTP(w, req)
	return w
}

// assertHeader checks if a response header has the expected value.
// It uses t.Helper() so test failures point to the calling line, not this function.
func assertHeader(t *testing.T, w *httptest.ResponseRecorder, key, expected string) {
	t.Helper()
	actual := w.Header().Get(key)
	if actual != expected {
		t.Errorf("header %s: expected %q, got %q", key, expected, actual)
	}
}

// assertStatus checks if the response status code matches the expected value.
func assertStatus(t *testing.T, w *httptest.ResponseRecorder, expected int) {
	t.Helper()
	if w.Code != expected {
		t.Errorf("status code: expected %d, got %d", expected, w.Code)
	}
}

// assertHeaderExists checks if a response header is present (non-empty).
func assertHeaderExists(t *testing.T, w *httptest.ResponseRecorder, key string) {
	t.Helper()
	actual := w.Header().Get(key)
	if actual == "" {
		t.Errorf("header %s: expected to be present, but was empty", key)
	}
}

// assertHeaderNotExists checks if a response header is absent or empty.
func assertHeaderNotExists(t *testing.T, w *httptest.ResponseRecorder, key string) {
	t.Helper()
	actual := w.Header().Get(key)
	if actual != "" {
		t.Errorf("header %s: expected to be absent, but got %q", key, actual)
	}
}
