import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import TaskList from '../TaskList/TaskList';
import TaskDetail from '../TaskDetails/TaskDetail'
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId')
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentFilter, setCurrentFilter] = useState({
        type: 'all',
        value: null,
        sortBy: 'creationDate',
        sortOrder: 'desc'
    });

    return (
        <div className='h-screeen flex flex-col'>
            {/* Header */}
            <Header userId={userId} onSearch={setSearchQuery}/>

            <div className='flex flex-1 overflow-hidden'>
                {/* Sidebar */}
                <Sidebar setCurrentFilter={setCurrentFilter}/>

                {/* Lista de tareas */}
                <main className='flex-1 bg-gray-100 px-6 py-3 overflow-auto'>
                <Routes>
                    <Route index element={<TaskList currentFilter={currentFilter} searchQuery={searchQuery}/>}></Route>
                    <Route path="tasks/:taskId" element={<TaskDetail />}></Route>
                </Routes>
                </main>
            </div>
        </div>
    )
}

export default Dashboard;