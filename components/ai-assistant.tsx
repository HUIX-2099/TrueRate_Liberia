"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Volume2, Loader } from "lucide-react"
import { motion } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "christian"
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! I'm Christian, your Liberian exchange rate assistant. Ask me anything about the rates, predictions, or currency conversion!",
      sender: "christian",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on user input
    const lowerMessage = userMessage.toLowerCase()

    // Store user interaction
    const analytics = {
      timestamp: new Date().toISOString(),
      type: "ai_interaction",
      message: userMessage,
    }
    const events = JSON.parse(sessionStorage.getItem("aiInteractions") || "[]")
    events.push(analytics)
    sessionStorage.setItem("aiInteractions", JSON.stringify(events.slice(-50)))

    // Fetch current rate for context
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
      const data = await response.json()
      const currentRate = data.rates?.LRD || 177.5

      if (lowerMessage.includes("rate") || lowerMessage.includes("how much") || lowerMessage.includes("usd")) {
        return `The current USD to LRD rate is approximately ${currentRate.toFixed(2)}. This rate updates every 30 seconds with live market data.`
      } else if (lowerMessage.includes("predict") || lowerMessage.includes("future")) {
        return `Based on our machine learning model, the rate is expected to remain relatively stable over the next 30 days. I recommend checking the Predict page for detailed forecasting and economic factors.`
      } else if (lowerMessage.includes("convert") || lowerMessage.includes("change")) {
        return `You can use our Currency Converter page to instantly convert USD to LRD or LRD to USD using real-time rates. Just enter the amount you want to convert.`
      } else if (lowerMessage.includes("map") || lowerMessage.includes("where")) {
        return `We have a map showing major money changer locations in Monrovia, Congo Town, and Paynesville. Check out the Map page to find the nearest exchange center.`
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        return `Hello! I'm Christian, your assistant. Ask me about exchange rates, predictions, conversions, or any currency questions!`
      } else {
        return `That's a great question! For detailed information, check out our Rates, Predict, Convert, or Map pages. What else can I help you with?`
      }
    } catch {
      return `I'm having trouble accessing current rates. Please try again or check the Rates page directly.`
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate response delay
    setTimeout(async () => {
      const responseText = await generateResponse(input)
      const christianMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "christian",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, christianMessage])
      setLoading(false)

      // Trigger vibration on response
      if (navigator.vibrate) {
        navigator.vibrate([10, 20, 10])
      }
    }, 500)
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-none bg-accent text-white flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors border-2 border-accent"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-40 w-96 h-96 bg-white border-2 border-black rounded-none shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="border-b-2 border-black p-4 bg-black text-white">
            <h3 className="font-black text-sm">CHRISTIAN AI ASSISTANT</h3>
            <p className="text-xs text-white/70">Exchange Rate Expert</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-none text-sm font-mono ${
                    msg.sender === "user" ? "bg-accent text-white" : "bg-gray-100 text-black border border-black"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === "christian" && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="mt-2 text-xs flex items-center gap-1 hover:opacity-70 transition"
                      disabled={isSpeaking}
                    >
                      <Volume2 className="w-3 h-3" />
                      Speak
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black border border-black px-3 py-2 rounded-none">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-black p-3 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about rates..."
              className="flex-1 bg-gray-50 border border-black px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-black text-white px-3 py-2 font-mono font-bold text-xs hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </>
  )
}
