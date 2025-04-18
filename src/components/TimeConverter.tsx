
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
import { CalendarIcon, Copy, Code } from "lucide-react";
import { format } from "date-fns";

const TimeConverter = () => {
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("Asia/Shanghai");
  const [convertedResult, setConvertedResult] = useState("");
  const [pythonCode, setPythonCode] = useState("");
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

  const formatDateInput = (input: string) => {
    // Remove non-numeric characters except hyphens
    let formattedInput = input.replace(/[^\d-]/g, '');
    
    // Split by hyphens to get year, month, day
    const parts = formattedInput.split('-');
    let year = parts[0] || '';
    let month = parts.length > 1 ? parts[1] : '';
    let day = parts.length > 2 ? parts[2] : '';
    
    // Ensure year, month and day don't exceed their limits
    if (year.length > 4) year = year.slice(0, 4);
    if (month.length > 2) month = month.slice(0, 2);
    if (day.length > 2) day = day.slice(0, 2);
    
    // Format month
    if (month) {
      const monthNum = parseInt(month);
      if (monthNum > 12) month = '12';
      else if (monthNum === 0) month = '01';
      else if (month.length === 1 && monthNum > 0) month = monthNum.toString().padStart(2, '0');
    }
    
    // Format day based on month
    if (day) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month) || 0;
      let maxDays = 31;
      
      // Determine max days for the month
      if (monthNum === 2) {
        // February (simple leap year check)
        const yearNum = parseInt(year) || new Date().getFullYear();
        maxDays = ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) ? 29 : 28;
      } else if ([4, 6, 9, 11].includes(monthNum)) {
        // April, June, September, November have 30 days
        maxDays = 30;
      }
      
      if (dayNum > maxDays) day = maxDays.toString();
      else if (dayNum === 0) day = '01';
      else if (day.length === 1 && dayNum > 0) day = dayNum.toString().padStart(2, '0');
    }
    
    // Reconstruct the formatted date
    let result = year;
    if (month) result += result ? '-' + month : month;
    if (day) result += result && month ? '-' + day : day;
    
    return result;
  };

  const formatTimeInput = (input: string) => {
    // Remove non-numeric characters except colons
    let formattedInput = input.replace(/[^\d:]/g, '');
    
    // Split by colons to get hours, minutes, seconds
    const parts = formattedInput.split(':');
    let hours = parts[0] || '';
    let minutes = parts.length > 1 ? parts[1] : '';
    let seconds = parts.length > 2 ? parts[2] : '';
    
    // Ensure hours, minutes, seconds don't exceed their limits
    if (hours.length > 2) hours = hours.slice(0, 2);
    if (minutes.length > 2) minutes = minutes.slice(0, 2);
    if (seconds.length > 2) seconds = seconds.slice(0, 2);
    
    // Format hours
    if (hours) {
      const hoursNum = parseInt(hours);
      if (hoursNum > 23) hours = '23';
      else if (hours.length === 1 && hoursNum >= 0) hours = hoursNum.toString().padStart(2, '0');
    }
    
    // Format minutes
    if (minutes) {
      const minutesNum = parseInt(minutes);
      if (minutesNum > 59) minutes = '59';
      else if (minutes.length === 1 && minutesNum >= 0) minutes = minutesNum.toString().padStart(2, '0');
    }
    
    // Format seconds
    if (seconds) {
      const secondsNum = parseInt(seconds);
      if (secondsNum > 59) seconds = '59';
      else if (seconds.length === 1 && secondsNum >= 0) seconds = secondsNum.toString().padStart(2, '0');
    }
    
    // Reconstruct the formatted time
    let result = hours;
    if (minutes) result += result ? ':' + minutes : minutes;
    if (seconds) result += result && minutes ? ':' + seconds : seconds;
    
    return result;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const getFullDateTime = () => {
    const formattedDate = formatDateInput(dateInput);
    const formattedTime = formatTimeInput(timeInput);
    
    if (formattedDate.length < 10 || !formattedTime) return "";
    
    return `${formattedDate} ${formattedTime}`;
  };

  const convertTime = () => {
    try {
      const fullDateTime = getFullDateTime();
      if (!fullDateTime) {
        setConvertedResult("Please enter valid date and time");
        generatePythonCode(false);
        return;
      }
      
      // Try to parse the date in format "YYYY-MM-DD HH:MM:SS"
      const dateTimeParts = fullDateTime.split(' ');
      const dateParts = dateTimeParts[0].split('-');
      const timeParts = dateTimeParts[1].split(':');
      
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript
      const day = parseInt(dateParts[2]);
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]) || 0;
      const second = parseInt(timeParts[2]) || 0;
      
      const date = new Date(year, month, day, hour, minute, second);
      
      if (isNaN(date.getTime())) {
        setConvertedResult("Invalid date or time format");
        generatePythonCode(false);
        return;
      }
      
      const result = formatInTimeZone(date, targetZone, "yyyy-MM-dd HH:mm:ss");
      setConvertedResult(result);
      generatePythonCode(true, fullDateTime);
    } catch (error) {
      setConvertedResult("Invalid time format");
      generatePythonCode(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const generatePythonCode = (isValid: boolean, dateTimeStr?: string) => {
    if (!isValid) {
      setPythonCode("");
      return;
    }
    
    const pythonCode = `
from datetime import datetime
import pytz

def convert_time(date_time_str="${dateTimeStr || ""}",
                source_zone="${sourceZone}", target_zone="${targetZone}"):
    # Parse datetime string
    dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
    
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

    setPythonCode(pythonCode);
  };

  const copyPythonCode = () => {
    if (pythonCode) {
      navigator.clipboard.writeText(pythonCode);
      toast({
        title: "Python code copied to clipboard",
        description: "The code has been copied and can be used in your Python environment.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (YYYY-MM-DD)
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                value={dateInput}
                onChange={handleDateChange}
                onBlur={() => setDateInput(formatDateInput(dateInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:MM:SS)
            </label>
            <Input
              type="text"
              placeholder="HH:MM:SS"
              value={timeInput}
              onChange={handleTimeChange}
              onBlur={() => setTimeInput(formatTimeInput(timeInput))}
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

        <Button 
          onClick={convertTime} 
          className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
        >
          Convert Time
        </Button>

        {convertedResult && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Converted Result
            </label>
            <div className="flex gap-2">
              <Input
                value={convertedResult}
                readOnly
                className="bg-black/20 border-purple-500/20 text-gray-100"
              />
              <Button
                onClick={() => copyToClipboard(convertedResult)}
                variant="outline"
                className="shrink-0 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {pythonCode && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Python Code
            </label>
            <div className="relative">
              <pre className="bg-black/30 rounded-md p-4 text-gray-200 text-xs overflow-auto">
                {pythonCode}
              </pre>
              <Button
                onClick={copyPythonCode}
                variant="outline"
                className="absolute top-2 right-2 h-8 py-1 px-2 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeConverter;
