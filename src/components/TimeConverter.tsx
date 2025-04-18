
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
import { formatDateInput, formatTimeInput, highlightPythonCode } from "@/utils/dateTimeUtils";

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
      
      // Try to parse the date in format "yyyy-MM-dd HH:mm:ss"
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
      <div className="flex items-center justify-center space-x-2 mb-4">
        <CalendarIcon className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Time Zone Converter</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (yyyy-MM-dd)
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="yyyy-MM-dd"
                value={dateInput}
                onChange={handleDateChange}
                onBlur={() => setDateInput(formatDateInput(dateInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:mm:ss)
            </label>
            <Input
              type="text"
              placeholder="HH:mm:ss"
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
              <pre className="bg-black/30 rounded-md p-4 overflow-auto">
                <div className="text-gray-200 text-xs" dangerouslySetInnerHTML={{ __html: highlightPythonCode(pythonCode) }} />
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
