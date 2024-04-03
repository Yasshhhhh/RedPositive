import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from './EditModal';
import Modal from './Modal';

const Table = () => {
    const [users, setUsers] = useState([]);
    const [checkedRows, setCheckedRows] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };
    useEffect(() => {
        fetchData();
    }, [users]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCheckboxChange = (userID) => {
        if (checkedRows.includes(userID)) {
            setCheckedRows(checkedRows.filter(id => id !== userID));
        } else {
            setCheckedRows([...checkedRows, userID]);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    const handleDeleteClick = async (userID) => {
        try {
            await axios.delete(`http://localhost:5000/users/${userID}`);
            setUsers(users.filter(user => user._id !== userID));
            console.log('User deleted successfully:', userID);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSendEmail = async () => {
        try {
            const selectedUsers = users.filter((user, index) => checkedRows.includes(index));
            await axios.post('http://localhost:5000/sendEmail', { users: selectedUsers });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleSaveEdit = async (updatedUserData) => {
        try {
            await axios.put(`http://localhost:5000/users/${updatedUserData._id}`, updatedUserData);
            fetchData();
            console.log('User updated successfully:', updatedUserData._id);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setEditModalVisible(false);
        }
    };

    const handleCloseModal = () => {
        setEditModalVisible(false);
    };

    const handleAddUser = async (newUserData) => 
    {
        try {
            await axios.post('http://localhost:5000/addUser', newUserData);
            console.log('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setVisible(false); 
        }
        fetchData();
    };
    
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hobbies
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Edit
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={index} 
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            style={{ backgroundColor: checkedRows.includes(index) ? '#374151' : 'inherit' }}
                        >
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input
                                        id={`checkbox-table-search-${index}`} 
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        onChange={() => handleCheckboxChange(index)} 
                                        checked={checkedRows.includes(index)}
                                    />
                                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">checkbox</label>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td> {}
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.phoneNumber}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.hobbies}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleEditClick(user)}>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#47de63" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
</svg>

                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleDeleteClick(user._id)}>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z" clip-rule="evenodd"/>
</svg>

                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSendEmail} type="button" className="text-white bg-gradient-to-r mt-4 from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Send Email
            </button>
            {editModalVisible && (
                <EditModal user={selectedUser} isVisible={setEditModalVisible} onClose={handleCloseModal} onSave={handleSaveEdit} />
            )}
            <button
        type="button"
        onClick={handleClick}
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Add New Entry
      </button>
            <Modal isVisible={visible}onClose={() => setVisible(false)} onAddUser={handleAddUser} />
        </div>
    );
};

export default Table;
