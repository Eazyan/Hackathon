import React, { ReactNode } from 'react'
import './MessageBox.css'

interface MessageBoxProps {
    mode: "Bot" | "User";
    children: ReactNode
}

const MessageBox: React.FC<MessageBoxProps> = ({ mode, children }) => {
    return (
        <div className={mode}>
            {children}
        </div>
    )
}

export default MessageBox