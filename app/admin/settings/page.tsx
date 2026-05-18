'use client'

import { useState } from 'react'
import { Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const [hours, setHours] = useState({
    monday: '10:00 - 14:00, 17:00 - 20:00',
    tuesday: '10:00 - 14:00, 17:00 - 20:00',
    wednesday: '10:00 - 14:00, 17:00 - 20:00',
    thursday: '10:00 - 14:00, 17:00 - 20:00',
    friday: '10:00 - 14:00, 17:00 - 20:00',
    saturday: '10:00 - 13:00',
    sunday: 'Closed',
  })

  const [prices, setPrices] = useState({
    videocall: 50,
    configurator: 29,
    course: 99,
  })

  const [slots, setSlots] = useState({
    advanceDays: 30,
    intervalMinutes: 30,
  })

  const [saved, setSaved] = useState(false)

  function handleSave() {
    // In a full implementation, this would POST to an API
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">Service Settings</h1>

      <div className="space-y-8">
        {/* Business Hours */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Settings size={18} className="text-[#C9A84C]" />
            Business Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(hours).map(([day, value]) => (
              <div key={day}>
                <label className="block text-sm text-gray-400 mb-2 capitalize">{day}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setHours({ ...hours, [day]: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Pricing (EUR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Videocall</label>
              <input
                type="number"
                value={prices.videocall}
                onChange={(e) => setPrices({ ...prices, videocall: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Configurator Access</label>
              <input
                type="number"
                value={prices.configurator}
                onChange={(e) => setPrices({ ...prices, configurator: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Course</label>
              <input
                type="number"
                value={prices.course}
                onChange={(e) => setPrices({ ...prices, course: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Booking Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">How far ahead can clients book (days)</label>
              <input
                type="number"
                value={slots.advanceDays}
                onChange={(e) => setSlots({ ...slots, advanceDays: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Slot interval (minutes)</label>
              <input
                type="number"
                value={slots.intervalMinutes}
                onChange={(e) => setSlots({ ...slots, intervalMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors"
          >
            <Save size={18} />
            Save Settings
          </button>
          {saved && (
            <span className="text-emerald-400 text-sm">Settings saved successfully</span>
          )}
        </div>
      </div>
    </div>
  )
}
