import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    nationalId: '',
    email: '',
    allocationTime: '',
    date: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Convert date format from DD-MM-YYYY to YYYY-MM-DD
    const formattedDate = formData.date.split('-').reverse().join('-')

    const formattedData = {
      ...formData,
      phoneNumber: formData.phone, // Ensure field name matches backend
      date: formattedDate, // Use YYYY-MM-DD format
    }

    console.log('Sending Data:', formattedData) // Debugging log

    try {
      const response = await axios.post('http://localhost:3001/visitors', formattedData, {
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('Response:', response.data)
      setMessage('Visitor data successfully submitted!')

      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        nationalId: '',
        email: '',
        allocationTime: '',
        date: '',
      })
    } catch (error) {
      console.error('Error:', error.response?.data || error.message)
      setMessage(`Error: ${error.response?.data?.message || 'Internal server error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '1rem' }}>
          Personal Information
        </h1>
        {message && (
          <p
            style={{
              textAlign: 'center',
              color: message.includes('error') ? 'red' : 'green',
              fontWeight: 'bold',
            }}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}
          >
            {[
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
              { label: 'Phone Number', name: 'phone' },
              { label: 'National ID', name: 'nationalId' },
              { label: 'Email ID', name: 'email' },
              { label: 'Allocation Time', name: 'allocationTime', type: 'time' },
              { label: 'Date', name: 'date', type: 'date' },
            ].map(({ label, name, type = 'text' }) => (
              <div
                key={name}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <label
                  style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', width: '40%' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    border: '2px solid #eee',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            {loading ? 'Sending...' : 'Send to Email'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
