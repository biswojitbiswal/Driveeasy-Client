import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Settings,
    User,
    UserCog,

} from 'lucide-react';
import AgentDashBoard from './AgentDashboard';
import AgentOrder from './AgentOrder'
import AgentSetting from './AgentSetting'
import { useSelector } from 'react-redux';


const AgentDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const user = useSelector((state) => state.auth.user);

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: AgentDashBoard },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, component: AgentOrder },
        { id: 'settings', label: 'Settings', icon: Settings, component: AgentSetting },
    ];

    const getCurrentUrl = () => {
        return `/agent/${activeTab}`;
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        window.history.pushState({}, '', `/agent/${tabId}`);
    };

    useEffect(() => {
        window.history.replaceState({}, '', getCurrentUrl());
    }, []);

    const getCurrentComponent = () => {
        const currentItem = sidebarItems.find(item => item.id === activeTab);
        return currentItem ? currentItem.component : DashBoard;
    };

    const CurrentComponent = getCurrentComponent();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="bg-white shadow-lg transition-all duration-300 flex flex-col w-16 lg:w-64">
                {/* Logo/Brand */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-center lg:justify-start">
                        <div className="bg-orange-600 rounded-lg flex items-center justify-center">
                            <UserCog className="w-8 h-8 mx-2 my-2 text-white" />
                        </div>
                        <span className="hidden lg:block ml-3 text-xl font-bold text-gray-900">Agent</span>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                        {sidebarItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center px-6 py-3 rounded-lg transition-colors
                                        ${activeTab === item.id
                                            ? 'bg-orange-50 text-orange-600 lg:border-r-2 lg:border-orange-600'
                                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}
                                        justify-center lg:justify-start space-x-0 lg:space-x-3`
                                    }
                                >
                                    <item.icon className="w-6 h-6 shrink-0" />
                                    <span className="hidden lg:inline font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>


            <main className="flex-1 overflow-y-auto p-6">
                <CurrentComponent />
            </main>
        </div>
    );
};

export default AgentDashboard;