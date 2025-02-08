import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { format, eachDayOfInterval, startOfWeek, addWeeks, isToday, isSameDay } from 'date-fns';
import { theme } from '@/constants/theme';

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
  const startDate = startOfWeek(new Date());
  const dates = eachDayOfInterval({
    start: startDate,
    end: addWeeks(startDate, 2)
  });

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      style={{
        maxHeight: 200,
      }}
    >
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isCurrentDay = isToday(date);
        
        return (
          <TouchableOpacity
            key={date.toISOString()}
            onPress={() => onSelectDate(date)}
            style={{ 
              backgroundColor: isSelected 
                ? theme.colors.primary 
                : isCurrentDay 
                ? theme.colors.primaryBg 
                : theme.colors.card
            }}
            className="mx-1 rounded-xl p-2 w-16 items-center"
          >
            <Text 
              style={{ 
                color: isSelected 
                  ? theme.colors.text.light 
                  : theme.colors.text.tertiary 
              }}
              className="text-xs mb-1"
            >
              {format(date, 'EEE')}
            </Text>
            <Text 
              style={{ 
                color: isSelected 
                  ? theme.colors.text.light 
                  : isCurrentDay 
                  ? theme.colors.primary 
                  : theme.colors.text.primary 
              }}
              className="text-lg font-bold"
            >
              {format(date, 'd')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
} 