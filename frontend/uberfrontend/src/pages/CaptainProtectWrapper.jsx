import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const context = useContext(CaptainDataContext) || {}
    const selectedCaptain = context.selectedCaptain
    const setSelectedCaptain = context.setSelectedCaptain
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captainlogin')
            return
        }

        // If we already have captain data, skip fetching
        if (selectedCaptain?.email) {
            setIsLoading(false)
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            if (response.status === 200) {
                setSelectedCaptain?.(response.data.captain)
            }
        }).catch(err => {
            console.error('Error fetching captain profile:', err)
            localStorage.removeItem('token')
            navigate('/captainlogin')
        }).finally(() => {
            setIsLoading(false)
        })
    }, [token, selectedCaptain, navigate, setSelectedCaptain])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!token || !selectedCaptain?.email) {
        return null
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default CaptainProtectWrapper