import React, { ReactNode } from 'react';
import './Center.css'


interface BlankProps {
    children: ReactNode;
}

const Center: React.FC<BlankProps> = ({ children }) => {
    return (
        <div className="center">
            {children}
        </div>
    );
}

export default Center