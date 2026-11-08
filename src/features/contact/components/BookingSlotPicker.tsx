import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getAvailableWeekdays, TIME_SLOTS } from '../schemas';

interface BookingSlotPickerProps {
  selectedDate: string;
  selectedSlot: string;
  onDateChange: (dateStr: string) => void;
  onSlotChange: (slot: string) => void;
  className?: string;
}

export const BookingSlotPicker: React.FC<BookingSlotPickerProps> = ({
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  className = ''
}) => {
  const availableDays = getAvailableWeekdays(5);

  return (
    <div className={`p-4 rounded-xl bg-slate-50 border craft-border ${className}`}>
      {/* Date Selection */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          <Calendar size={14} className="text-[#2A7B7E]" />
          Select Consultation Date (Mon–Fri)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {availableDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onDateChange(day.dateStr)}
                className={`py-2 px-2.5 rounded-lg text-center transition-all duration-[var(--duration-sheet,500ms)] ease-[var(--ease-sheet)] text-xs border ${
                  isSelected
                    ? 'bg-[#2A7B7E] text-white border-[#2A7B7E] shadow-sm font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#2A7B7E]/40 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="text-[10px] uppercase tracking-wide opacity-80">{day.weekday}</div>
                <div className="font-medium tabular-nums">{day.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          <Clock size={14} className="text-[#2A7B7E]" />
          Available Australian Window (AEST)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSlotChange(slot)}
                className={`py-2 px-3 rounded-lg text-center transition-all duration-[var(--duration-sheet,500ms)] ease-[var(--ease-sheet)] text-xs border tabular-nums ${
                  isSelected
                    ? 'bg-[#2A7B7E] text-white border-[#2A7B7E] shadow-sm font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#2A7B7E]/40 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
