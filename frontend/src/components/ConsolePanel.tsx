'use client'

import { useMemo, memo } from 'react'
import DOMPurify from 'isomorphic-dompurify'

export interface ConsoleMessage {
  type: 'info' | 'success' | 'error'
  message: string
  timestamp: number
}

interface ConsolePanelProps {
  messages: ConsoleMessage[]
  onClose?: () => void
}

function ConsolePanelComponent({ messages, onClose }: ConsolePanelProps) {
  // Sanitize all messages to prevent XSS attacks
  const sanitizedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        ...msg,
        message: DOMPurify.sanitize(msg.message),
      })),
    [messages]
  )

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const getMessageStyle = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      case 'success':
        return 'text-green-400 border-green-500/30 bg-green-500/10'
      case 'error':
        return 'text-red-400 border-red-500/30 bg-red-500/10'
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10'
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-900">
      {/* Console Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <h2 className="text-white text-sm font-semibold">Console</h2>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded hover:bg-gray-700 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Close console"
              aria-label="Close console"
            >
              <span className="text-base leading-none">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Console Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sanitizedMessages.length === 0 ? (
          <div className="text-gray-500 text-sm italic">
            Console output will appear here...
          </div>
        ) : (
          sanitizedMessages.map((msg, index) => (
            <div
              key={index}
              className={`rounded border px-3 py-2 text-sm transition-all duration-200 ${getMessageStyle(
                msg.type
              )}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-500 font-mono shrink-0">
                  {formatTimestamp(msg.timestamp)}
                </span>
                <div
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export const ConsolePanel = memo(ConsolePanelComponent)
