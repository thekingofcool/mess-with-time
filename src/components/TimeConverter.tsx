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
import { CalendarIcon, Copy, Code } from "lucide-react";
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
    
    let year = '', month = '', day = '';
    
    if (numbers.length >= 4) {
      year = numbers.slice(0, 4);
    } else {
      return numbers;
    }
    
    if (numbers.length > 4) {
      month = numbers.slice(4, 6);
      const monthNum = parseInt(month);
      if (monthNum > 12) month = '12';
      else if (monthNum === 0) month = '01';
      else month = monthNum.toString().padStart(2, '0');
    }
    
    if (numbers.length > 6) {
      day = numbers.slice(6, 8);
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      
      if (dayNum > daysInMonth) day = daysInMonth.toString();
      else if (dayNum === 0) day = '01';
      else day = dayNum.toString().padStart(2, '0');
    }
    
    let result = year;
    if (month) result += '-' + month;
    if (day) result += '-' + day;
    
    return result;
  };

  const formatTimeInput = (input: string) => {
    const cleanInput = input.replace(/[^\d:]/g, '');
    const parts = cleanInput.split(':');
    let hours = parts[0] || '00';
    let minutes = parts[1] || '00';
    let seconds = parts[2] || '00';
    
    const hoursNum = parseInt(hours);
    hours = (hoursNum >= 0 && hoursNum < 24) ? hoursNum.toString().padStart(2, '0') : '00';
    
    const minutesNum = parseInt(minutes);
    minutes = (minutesNum >= 0 && minutesNum < 60) ? minutesNum.toString().padStart(2, '0') : '00';
    
    const secondsNum = parseInt(seconds);
    seconds = (secondsNum >= 0 && secondsNum < 60) ? secondsNum.toString().padStart(2, '0') : '00';
    
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

  const generatePythonCode = () => {
    const pythonCode = `
from datetime import datetime
import pytz

def convert_time(date_str="${dateInput}", time_str="${timeInput}", 
                source_zone="${sourceZone}", target_zone="${targetZone}"):
    # Combine date and time
    dt_str = f"{date_str} {time_str}"
    
    # Create datetime object
    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    
    # Localize the datetime to source timezone
    source_tz = pytz.timezone(source_zone)
    localized_dt = source_tz.localize(dt)
    
    # Convert to target timezone
    target_tz = pytz.timezone(target_zone)
    converted_dt = localized_dt.astimezone(target_tz)
    
    # Format the result
    return converted_dt.strftime("%Y-%m-%d %H:%M:%S")

# Example usage
result = convert_time()
print(f"Converted time: {result}")
    `.trim();

    navigator.clipboard.writeText(pythonCode);
    toast({
      title: "Python code copied to clipboard",
      description: "The code has been copied and can be used in your Python environment.",
      duration: 3000,
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
                onChange={(e) => setDateInput(formatDateInput(e.target.value))}
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
              onChange={(e) => setTimeInput(formatTimeInput(e.target.value))}
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

        <div className="flex justify-between items-center">
          <Button
            onClick={generatePythonCode}
            variant="outline"
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            <Code className="h-4 w-4 mr-2" />
            Generate Python Code
          </Button>
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
