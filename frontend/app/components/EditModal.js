import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ isVisible, onClose, user }) => {
    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        phoneNumber: user ? user.phoneNumber : '',
        email: user ? user.email : '',
        hobbies: user ? user.hobbies : ''
    });
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailValid(emailRegex.test(value));
        }
        if (name === 'phoneNumber') {
            const phoneRegex = /^\d{10}$/;
            setPhoneValid(phoneRegex.test(value));
        }
    };

    const handleSubmit = async (e) => {
        console.log(user);
        console.log(formData);
        e.preventDefault();
        try {
            if (!emailValid || !phoneValid) return;
            if (user) {
                await axios.put(`http://localhost:5000/updateUser/${user._id}`, formData);
                console.log('User updated successfully');
            }
            onClose();
        } catch (error) {
            console.error('Error updating/adding user:', error);
        }
    };

    const handleClick1 = () => {
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{user ? 'Edit User' : 'Log New Entry'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your name" required />
                            </div>
                            <div className="w-full">
                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile</label>
                                <input type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${phoneValid ? '' : 'border-red-500'}`} placeholder="Mobile Number" required />
                                {!phoneValid && <p className="text-red-500 text-sm">Please enter a valid phone number (10 digits).</p>}
                            </div>
                            <div className="w-full">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${emailValid ? '' : 'border-red-500'}`} placeholder="email id" required />
                                {!emailValid && <p className="text-red-500 text-sm">Please enter a valid email address.</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="hobbies" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hobbies</label>
                                <input type="text" name="hobbies" id="hobbies" value={formData.hobbies} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="What are your hobbies?" required />
                            </div>
                        </div>
                        <button type="button" onClick={handleClick1} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Close
                        </button>
                        <button type="submit" disabled={!emailValid || !phoneValid} className={`mt-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${(!emailValid || !phoneValid) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {user ? 'Update User' : 'Add User'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Modal;
