import React from 'react'

function AdminSetting() {
  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            defaultValue="Your Company"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue="admin@company.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>UTC</option>
                            <option>EST</option>
                            <option>PST</option>
                            <option>GMT</option>
                        </select>
                    </div>
                </div>
                <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Save Changes
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email Notifications</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS Notifications</span>
                        <input type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Push Notifications</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                    </div>
                </div>
                <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Update Preferences
                </button>
            </div>
        </div>
    </div>
  )
}

export default AdminSetting
