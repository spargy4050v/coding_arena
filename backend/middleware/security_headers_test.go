package middleware

import (
	"testing"

	"github.com/gin-gonic/gin"
)

// TestSecurityHeaders_AllPresent tests that all security headers are present in response.
func TestSecurityHeaders_AllPresent(t *testing.T) {
	// Setup: Create router with SecurityHeaders middleware
	router := setupTestRouter()
	router.Use(SecurityHeaders())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Make a GET request
	w := makeRequest(router, "GET", "/test", nil)

	// Assert: All 8 security headers should be present
	assertHeaderExists(t, w, "X-Content-Type-Options")
	assertHeaderExists(t, w, "X-Frame-Options")
	assertHeaderExists(t, w, "X-XSS-Protection")
	assertHeaderExists(t, w, "Referrer-Policy")
	assertHeaderExists(t, w, "Content-Security-Policy")
	assertHeaderExists(t, w, "Permissions-Policy")
	assertHeaderExists(t, w, "Strict-Transport-Security")
	assertHeaderExists(t, w, "Cache-Control")
}

// TestSecurityHeaders_CorrectValues tests that each header has the correct value.
func TestSecurityHeaders_CorrectValues(t *testing.T) {
	// Setup: Create router with SecurityHeaders middleware
	router := setupTestRouter()
	router.Use(SecurityHeaders())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// Execute: Make a GET request
	w := makeRequest(router, "GET", "/test", nil)

	// Assert: Each header should have the exact correct value
	assertHeader(t, w, "X-Content-Type-Options", "nosniff")
	assertHeader(t, w, "X-Frame-Options", "DENY")
	assertHeader(t, w, "X-XSS-Protection", "1; mode=block")
	assertHeader(t, w, "Referrer-Policy", "strict-origin-when-cross-origin")
	assertHeader(t, w, "Content-Security-Policy", "default-src 'self'")
	assertHeader(t, w, "Permissions-Policy", "interest-cohort=()")
	assertHeader(t, w, "Strict-Transport-Security", "max-age=31536000; includeSubDomains")
	assertHeader(t, w, "Cache-Control", "no-store")
}

// TestSecurityHeaders_OnErrorResponse tests that headers are present even on error responses.
func TestSecurityHeaders_OnErrorResponse(t *testing.T) {
	// Setup: Create router with SecurityHeaders middleware
	router := setupTestRouter()
	router.Use(SecurityHeaders())
	// No routes defined - will trigger 404

	// Execute: Make request to non-existent route
	w := makeRequest(router, "GET", "/nonexistent", nil)

	// Assert: Status should be 404
	assertStatus(t, w, 404)

	// Assert: Security headers should still be present on error response
	assertHeaderExists(t, w, "X-Content-Type-Options")
	assertHeaderExists(t, w, "X-Frame-Options")
	assertHeaderExists(t, w, "X-XSS-Protection")
	assertHeaderExists(t, w, "Referrer-Policy")
	assertHeaderExists(t, w, "Content-Security-Policy")
	assertHeaderExists(t, w, "Permissions-Policy")
	assertHeaderExists(t, w, "Strict-Transport-Security")
	assertHeaderExists(t, w, "Cache-Control")
}
