import { useState, useEffect } from 'react'
import './App.css'

function HackerTerminal() {
  const [setup, setSetup] = useState('')
  const [punchline, setPunchline] = useState('')
  const [displayedPunchline, setDisplayedPunchline] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchJoke = async () => {
    setLoading(true)
    setSetup('')
    setPunchline('')
    setDisplayedPunchline('')
    setIsTyping(false)

    try {
      const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random')
      const data = await response.json()
      const joke = data[0]

      setSetup(joke.setup)
      setPunchline(joke.punchline)
      setLoading(false)
    } catch (error) {
      setSetup('Error: Failed to fetch joke')
      setPunchline('Please check your connection and try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJoke()
  }, [])

  useEffect(() => {
    if (!loading && setup && punchline && !isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loading, setup, punchline, isTyping])

  useEffect(() => {
    if (isTyping && displayedPunchline.length < punchline.length) {
      const timer = setTimeout(() => {
        setDisplayedPunchline(punchline.slice(0, displayedPunchline.length + 1))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isTyping, displayedPunchline, punchline])

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-title">HACKER_TERMINAL v1.0.0</span>
      </div>
      <div className="terminal-body">
        <div className="terminal-line">
          <span className="prompt">root@localhost:~$</span> ./fetch_joke.sh
        </div>

        {loading && (
          <div className="terminal-line">
            <span className="loading">Loading...</span>
            <span className="cursor blink"></span>
          </div>
        )}

        {!loading && setup && (
          <>
            <div className="terminal-line">
              <span className="output">&gt; {setup}</span>
            </div>

            {displayedPunchline && (
              <div className="terminal-line">
                <span className="output punchline">&gt; {displayedPunchline}</span>
                {displayedPunchline.length < punchline.length && (
                  <span className="cursor blink"></span>
                )}
              </div>
            )}

            {displayedPunchline.length === punchline.length && (
              <div className="terminal-line">
                <span className="cursor blink"></span>
              </div>
            )}
          </>
        )}

        <div className="button-container">
          <button
            className="terminal-button"
            onClick={fetchJoke}
            disabled={loading}
          >
            [ RERUN SCRIPT ]
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return <HackerTerminal />
}

export default App
