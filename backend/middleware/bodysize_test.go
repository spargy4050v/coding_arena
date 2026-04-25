package middleware

import (
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

// TestMaxBodySize_UnderLimit tests that requests under size limit succeed.
func TestMaxBodySize_UnderLimit(t *testing.T) {
	// Setup: Create router with 1KB body size limit
	router := setupTestRouter()
	router.Use(MaxBodySize(1024)) // 1KB limit
	router.POST("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Send 512 bytes (under limit)
	body := strings.Repeat("a", 512)
	w := makeRequestWithBody(router, "POST", "/test", body, map[string]string{
		"Content-Type": "text/plain",
	})

	// Assert: Should succeed
	assertStatus(t, w, 200)
}

// TestMaxBodySize_AtLimit tests that requests exactly at size limit succeed.
func TestMaxBodySize_AtLimit(t *testing.T) {
	// Setup: Create router with 1KB body size limit
	router := setupTestRouter()
	router.Use(MaxBodySize(1024)) // 1KB limit
	router.POST("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Send exactly 1024 bytes (at limit)
	body := strings.Repeat("a", 1024)
	w := makeRequestWithBody(router, "POST", "/test", body, map[string]string{
		"Content-Type": "text/plain",
	})

	// Assert: Should succeed
	assertStatus(t, w, 200)
}

// TestMaxBodySize_OverLimit tests that requests over size limit are rejected.
func TestMaxBodySize_OverLimit(t *testing.T) {
	// Setup: Create router with 1KB body size limit
	router := setupTestRouter()
	router.Use(MaxBodySize(1024)) // 1KB limit
	router.POST("/test", func(c *gin.Context) {
		// Handler tries to read the body - this is when MaxBytesReader triggers
		body, err := c.GetRawData()
		if err != nil {
			c.JSON(400, gin.H{"error": "request body too large"})
			return
		}
		c.JSON(200, gin.H{"ok": true, "size": len(body)})
	})

	// Execute: Send 2KB (over limit)
	body := strings.Repeat("a", 2048)
	w := makeRequestWithBody(router, "POST", "/test", body, map[string]string{
		"Content-Type": "text/plain",
	})

	// Assert: Should fail with 400 Bad Request (handler detects the error)
	assertStatus(t, w, 400)
}

// TestMaxBodySize_NoBody tests that GET requests without body work fine.
func TestMaxBodySize_NoBody(t *testing.T) {
	// Setup: Create router with body size limit
	router := setupTestRouter()
	router.Use(MaxBodySize(1024))
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Make GET request (no body)
	w := makeRequest(router, "GET", "/test", nil)

	// Assert: Should succeed
	assertStatus(t, w, 200)
}
