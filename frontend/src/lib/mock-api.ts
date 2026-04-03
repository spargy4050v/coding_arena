/**
 * Mock API interceptor for Vite
 * This simulates the behavior of Next.js API routes by intercepting fetch calls
 */

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    const [url, options] = args
    const urlString = typeof url === 'string' ? url : url instanceof URL ? url.toString() : ''

    if (urlString.startsWith('/api/submit') && (!options || options.method === 'POST')) {
      console.log('Mocking API call to /api/submit')
      
      try {
        const body = options?.body ? JSON.parse(options.body as string) : {}
        
        // Simulate processing delay (500ms)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Generate mock "Accepted" response matching the Next.js implementation
        const responseData = {
          submission_id: Date.now(),
          status: 'AC',
          message: 'Accepted',
          timestamp: Date.now()
        }
        
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    if (urlString.startsWith('/api/run') && (!options || options.method === 'POST')) {
      console.log('Mocking API call to /api/run')
      
      try {
        const body = options?.body ? JSON.parse(options.body as string) : {}
        
        // Simulate processing delay (300ms)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Generate mock response for running code
        const responseData = {
          run_id: Date.now(),
          status: 'Success',
          message: 'All test cases passed locally',
          timestamp: Date.now()
        }
        
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    return originalFetch(...args)
  }
}

export {}
