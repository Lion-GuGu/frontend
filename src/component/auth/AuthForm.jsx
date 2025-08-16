import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- SVG 아이콘 ---
const EyeIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOffIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 A 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);


// --- 메인 인증 폼 컴포넌트 ---
export default function AuthForm({ title, fields, options, submitText, bottomLink, onSubmit }) {
    const initialFormState = fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {});
    const [formData, setFormData] = useState(initialFormState);
    const [isPasswordVisible, setIsPasswordVisible] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const togglePasswordVisibility = (id) => {
        setIsPasswordVisible(prev => ({...prev, [id]: !prev[id]}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 sm:p-10">
            <h1 className="text-md font-bold text-center mb-8">{title}</h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                    {fields.map(({id, label, type}) => (
                        <div key={id}>
                            <label htmlFor={id} className="sr-only">{label}</label>
                            <div className="relative">
                                <input 
                                    id={id} 
                                    name={id} 
                                    type={type === 'password' && isPasswordVisible[id] ? 'text' : type} 
                                    value={formData[id]} 
                                    onChange={handleChange} 
                                    placeholder={label} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                                    style={{'--tw-placeholder-opacity': '1', color: '#999999'}}
                                />
                                {type === 'password' && (
                                    <button 
                                        type="button" 
                                        onClick={() => togglePasswordVisibility(id)} 
                                        className="absolute inset-y-0 right-4 flex items-center !bg-transparent !border-none !p-0 text-gray-500 hover:text-orange-500 !outline-none"
                                    >
                                        {isPasswordVisible[id] ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <div className="text-[#666666] [&_a]:!text-[#666666] hover:[&_a]:!text-orange-500">
                        {options}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg !font-bold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEAA45]"
                            style={{ backgroundColor: "#FEAA45" }}
                        >
                            {submitText}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span style={{color: '#666666'}}>{bottomLink.text}</span>
                        <Link 
                            to={bottomLink.href} 
                            className="!font-bold hover:underline ml-1"
                            style={{color: '#1A1A1A'}}
                        >
                            {bottomLink.linkText}
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};
