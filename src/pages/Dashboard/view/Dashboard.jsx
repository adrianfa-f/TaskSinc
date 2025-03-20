import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import TaskList from '../TaskList/TaskList';
import TaskDetail from '../TaskDetails/TaskDetail'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId')
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState({
        type: 'all',
        value: null,
        sortBy: 'creationDate',
        sortOrder: 'desc'
    });

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className='h-screeen flex flex-col'>
            {/* Header */}
            <Header userId={userId} onSearch={setSearchQuery} toggleMobileMenu={toggleMobileMenu}/>

            <div className='flex flex-1 md:flex-row overflow-hidden'>
                {/* Sidebar */}
                <Sidebar setCurrentFilter={setCurrentFilter} isMobileOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}/>

                {/* Lista de tareas */}
                <main className='flex-1 bg-gray-100 px-4  md:px-6 py-3 overflow-auto md:ml-64 relative z-40'>
                <Routes>
                    <Route index element={<TaskList currentFilter={currentFilter} searchQuery={searchQuery}/>}/>
                    <Route path="tasks/:taskId" element={<TaskDetail/>}/>
                </Routes>
                </main>
            </div>
        </div>
    )
}

export default Dashboard;