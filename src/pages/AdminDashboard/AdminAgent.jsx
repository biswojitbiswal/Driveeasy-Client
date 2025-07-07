import { Plus, UserCheck } from 'lucide-react'
import React from 'react'

function AdminAgent() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Agents Management</h1>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Agent</span>
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { name: 'Sarah Wilson', specialty: 'Sales', performance: '98%', deals: 45 },
                { name: 'David Brown', specialty: 'Support', performance: '95%', deals: 32 },
                { name: 'Emily Davis', specialty: 'Marketing', performance: '92%', deals: 28 },
            ].map((agent, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.specialty}</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Performance</span>
                            <span className="text-sm font-medium text-green-600">{agent.performance}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Deals Closed</span>
                            <span className="text-sm font-medium text-gray-900">{agent.deals}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors text-sm">
                            View Details
                        </button>
                        <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                            Edit
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AdminAgent
