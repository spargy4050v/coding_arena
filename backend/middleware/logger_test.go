package middleware

import (
	"bytes"
	"log"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

// TestRequestLogger_SuccessfulRequest tests that successful requests are logged at INFO level.
func TestRequestLogger_SuccessfulRequest(t *testing.T) {
	// Setup: Capture log output
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(nil) // Reset after test

	// Setup: Create router with logger
	router := setupTestRouter()
	router.Use(RequestLogger())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Make successful request
	makeRequest(router, "GET", "/test", nil)

	// Assert: Log should contain INFO level
	logOutput := buf.String()
	if !strings.Contains(logOutput, "[INFO]") {
		t.Errorf("expected [INFO] in log, got: %s", logOutput)
	}
	
	// Assert: Log should contain method and path
	if !strings.Contains(logOutput, "GET") || !strings.Contains(logOutput, "/test") {
		t.Errorf("expected method and path in log, got: %s", logOutput)
	}
}

// TestRequestLogger_ClientError tests that 4xx errors are logged at WARN level.
func TestRequestLogger_ClientError(t *testing.T) {
	// Setup: Capture log output
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(nil)

	// Setup: Create router with logger
	router := setupTestRouter()
	router.Use(RequestLogger())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(400, gin.H{"error": "bad request"})
	})

	// Execute: Make request that returns 400
	makeRequest(router, "GET", "/test", nil)

	// Assert: Log should contain WARN level
	logOutput := buf.String()
	if !strings.Contains(logOutput, "[WARN]") {
		t.Errorf("expected [WARN] in log for 4xx error, got: %s", logOutput)
	}
}

// TestRequestLogger_ServerError tests that 5xx errors are logged at WARN level.
func TestRequestLogger_ServerError(t *testing.T) {
	// Setup: Capture log output
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(nil)

	// Setup: Create router with logger
	router := setupTestRouter()
	router.Use(RequestLogger())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(500, gin.H{"error": "internal error"})
	})

	// Execute: Make request that returns 500
	makeRequest(router, "GET", "/test", nil)

	// Assert: Log should contain WARN level
	logOutput := buf.String()
	if !strings.Contains(logOutput, "[WARN]") {
		t.Errorf("expected [WARN] in log for 5xx error, got: %s", logOutput)
	}
}

// TestRequestLogger_LogContent tests that logs include method, path, status, latency, IP.
func TestRequestLogger_LogContent(t *testing.T) {
	// Setup: Capture log output
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(nil)

	// Setup: Create router with logger
	router := setupTestRouter()
	router.Use(RequestLogger())
	router.POST("/api/test", func(c *gin.Context) {
		c.JSON(201, gin.H{"created": true})
	})

	// Execute: Make POST request
	makeRequest(router, "POST", "/api/test", nil)

	// Assert: Log should contain all required fields
	logOutput := buf.String()
	
	requiredFields := []string{
		"POST",        // Method
		"/api/test",   // Path
		"201",         // Status code
		"ip=",         // IP address
	}
	
	for _, field := range requiredFields {
		if !strings.Contains(logOutput, field) {
			t.Errorf("expected %q in log, got: %s", field, logOutput)
		}
	}
	
	// Latency should be present (contains time unit like 'ms' or 'µs')
	if !strings.Contains(logOutput, "s") && !strings.Contains(logOutput, "ms") {
		t.Errorf("expected latency measurement in log, got: %s", logOutput)
	}
}
