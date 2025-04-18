import React, { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";

const TimeConverter = () => {
  const [date, setDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState("00:00:00");
  const [dateInput, setDateInput] = useState("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("Asia/Shanghai");
  const { toast } = useToast();

  const timeZones = [
    "Africa/Cairo",
    "America/Chicago",
    "America/Los_Angeles",
    "America/New_York",
    "America/Sao_Paulo",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Europe/Berlin",
    "Europe/London",
    "Europe/Moscow",
    "Europe/Paris",
    "Pacific/Auckland",
    "UTC",
  ].sort();
  
  const formatTimeZoneDisplay = (zone: string) => {
    return zone.replace(/_/g, ' ');
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const formatDateInput = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      let month = numbers.slice(4, 6);
      const firstDigit = month[0];
      
      if (parseInt(firstDigit) > 1) {
        month = `0${firstDigit}`;
      } else if (month.length === 2) {
        const monthNum = parseInt(month);
        if (monthNum > 12) {
          month = '12';
        } else if (monthNum === 0) {
          month = '01';
        }
      }
      
      return `${numbers.slice(0, 4)}-${month}`;
    } else {
      const year = parseInt(numbers.slice(0, 4));
      const month = parseInt(numbers.slice(4, 6));
      const maxDays = getDaysInMonth(year, month);
      
      let day = numbers.slice(6, 8);
      const firstDayDigit = day[0];
      
      if (parseInt(firstDayDigit) > 3) {
        day = `0${firstDayDigit}`;
      } else if (day.length === 2) {
        const dayNum = parseInt(day);
        if (dayNum > maxDays) {
          day = maxDays.toString().padStart(2, '0');
        } else if (dayNum === 0) {
          day = '01';
        }
      } else if (day.length === 1) {
        day = day.padStart(2, '0');
      }
      
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6).padStart(2, '0')}-${day}`;
    }
  };

  const formatTimeInput = (input: string) => {
    const parts = input.split(':');
    let hours = parts[0] || '00';
    let minutes = parts[1] || '00';
    let seconds = parts[2] || '00';
    
    const hoursNum = parseInt(hours);
    if (isNaN(hoursNum) || hoursNum < 0) {
      hours = '00';
    } else if (hoursNum > 23) {
      hours = '23';
    } else {
      hours = hoursNum.toString().padStart(2, '0');
    }
    
    const minutesNum = parseInt(minutes);
    if (isNaN(minutesNum) || minutesNum < 0) {
      minutes = '00';
    } else if (minutesNum > 59) {
      minutes = '59';
    } else {
      minutes = minutesNum.toString().padStart(2, '0');
    }
    
    const secondsNum = parseInt(seconds);
    if (isNaN(secondsNum) || secondsNum < 0) {
      seconds = '00';
    } else if (secondsNum > 59) {
      seconds = '59';
    } else {
      seconds = secondsNum.toString().padStart(2, '0');
    }
    
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setDateInput(formatted);

    if (formatted.length === 10) {
      const parsedDate = parse(formatted, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value);
    setTimeInput(formatted);
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setDateInput(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const getFullDateTime = () => {
    if (!date) return "";
    const [hours, minutes, seconds] = timeInput.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    newDate.setSeconds(seconds || 0);
    return newDate.toISOString();
  };

  const convertTime = () => {
    try {
      const fullDateTime = getFullDateTime();
      if (!fullDateTime) return "Please select date and time";
      const date = new Date(fullDateTime);
      if (isNaN(date.getTime())) {
        return "Invalid time format";
      }
      const result = formatInTimeZone(date, targetZone, "yyyy-MM-dd HH:mm:ss");
      return result;
    } catch (error) {
      return "Invalid time format";
    }
  };

  const copyToClipboard = () => {
    const result = convertTime();
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                value={dateInput}
                onChange={handleDateChange}
                maxLength={10}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                  >
                    <CalendarIcon className="h-4 w-4 text-gray-300" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <Input
              type="text"
              placeholder="HH:MM:SS"
              value={timeInput}
              onChange={handleTimeChange}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Source Time Zone
            </label>
            <Select value={sourceZone} onValueChange={setSourceZone}>
              <SelectTrigger className="bg-black/20 border-purple-500/20 text-gray-100">
                <SelectValue placeholder="Select source zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {formatTimeZoneDisplay(zone)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Target Time Zone
            </label>
            <Select value={targetZone} onValueChange={setTargetZone}>
              <SelectTrigger className="bg-black/20 border-purple-500/20 text-gray-100">
                <SelectValue placeholder="Select target zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {formatTimeZoneDisplay(zone)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Converted Result
          </label>
          <div className="flex gap-2">
            <Input
              value={convertTime()}
              readOnly
              className="bg-black/20 border-purple-500/20 text-gray-100"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="shrink-0 border-purple-500/20 hover:bg-purple-500/20"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
