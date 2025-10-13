import React,{useContext, useEffect} from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const UserProtectWrapper = ({children}) => {
    const {user} = useContext(UserDataContext)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
    useEffect(() => {
        if(!token){
            navigate('/login')
            return null
        }
        if(!user.email){
            navigate('/login')
            return
        }
    }, [token, user.email, navigate])

    // Don't render children if not authenticated
    if(!token || !user.email) {
        return null
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default UserProtectWrapper