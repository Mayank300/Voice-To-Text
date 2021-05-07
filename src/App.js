import React, { useState, useEffect } from 'react';
import './App.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>▶🎙️</span> : <span>🛑</span> }
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
          {isListening ? <span>Listening</span> : <span>Say Something</span>}
          </button>
          <p>{note}</p>
        </div>

        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}

          <CopyToClipboard text={savedNotes}
            onCopy={() => setCopied(true)}>
            <span></span>
          </CopyToClipboard>

          <CopyToClipboard text={savedNotes}
            onCopy={() => setCopied(true)}>
            <button>Copy to clipboard with button</button>
          </CopyToClipboard>
        </div>
      </div>
    </>
  )
}

export default App
