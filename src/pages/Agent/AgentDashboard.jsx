import React from 'react'
import { Users, ShoppingCart, Package, Activity, UserCheck, TrendingUp,  } from 'lucide-react'

function AgentDashBoard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">12,345</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">8,765</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$54,321</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+5% from last month</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">New user registered: john.doe@email.com</span>
            <span className="text-xs text-gray-500 ml-auto">2 mins ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">Order #12345 completed</span>
            <span className="text-xs text-gray-500 ml-auto">5 mins ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-700">Product "iPhone 15" added to inventory</span>
            <span className="text-xs text-gray-500 ml-auto">10 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentDashBoard
