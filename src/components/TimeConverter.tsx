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
import { CalendarIcon, Copy, Code, Earth, Clock } from "lucide-react";
import { format, parse } from "date-fns";
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
    const input = e.target.value;
    const cleanInput = input.replace(/[^\d-]/g, '');
    
    let formattedInput = '';
    const digits = cleanInput.replace(/-/g, '');
    
    if (digits.length > 0) {
      const year = digits.substring(0, 4);
      formattedInput = year;
      
      if (year.length === 4) {
        formattedInput += '-';
        
        if (digits.length > 4) {
          let month = digits.substring(4, 6);
          if (month.length === 1) {
            if (month > '1') {
              month = '0' + month;
            }
          } else if (month.length === 2) {
            if (month === '00') month = '01';
            if (parseInt(month) > 12) month = '12';
          }
          
          formattedInput += month;
          
          if (month.length === 2) {
            formattedInput += '-';
            
            if (digits.length > 6) {
              let day = digits.substring(6, 8);
              
              const yearNum = parseInt(year);
              const monthNum = parseInt(month);
              const daysInMonth = [
                31,
                (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) ? 29 : 28,
                31, 30, 31, 30, 31, 31, 30, 31, 30, 31
              ][monthNum - 1];
              
              if (day.length === 1) {
                if (day > '3' || (monthNum === 2 && day > '2')) {
                  day = '0' + day;
                }
              } else if (day.length === 2) {
                if (day === '00') day = '01';
                if (parseInt(day) > daysInMonth) day = daysInMonth.toString();
              }
              
              formattedInput += day;
            }
          }
        }
      }
    }
    
    setDateInput(formattedInput);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanInput = input.replace(/[^\d:]/g, '');
    
    let formattedInput = '';
    const digits = cleanInput.replace(/:/g, '');
    
    if (digits.length > 0) {
      let hours = digits.substring(0, 2);
      if (hours.length === 1) {
        if (hours > '2') {
          hours = '0' + hours;
        }
      } else if (hours.length === 2) {
        if (parseInt(hours) > 23) hours = '23';
      }
      
      formattedInput = hours;
      
      if (hours.length === 2) {
        formattedInput += ':';
        
        if (digits.length > 2) {
          let minutes = digits.substring(2, 4);
          if (minutes.length === 1) {
            if (minutes > '5') {
              minutes = '0' + minutes;
            }
          } else if (minutes.length === 2) {
            if (parseInt(minutes) > 59) minutes = '59';
          }
          
          formattedInput += minutes;
          
          if (minutes.length === 2) {
            formattedInput += ':';
            
            if (digits.length > 4) {
              let seconds = digits.substring(4, 6);
              if (seconds.length === 1) {
                if (seconds > '5') {
                  seconds = '0' + seconds;
                }
              } else if (seconds.length === 2) {
                if (parseInt(seconds) > 59) seconds = '59';
              }
              
              formattedInput += seconds;
            }
          }
        }
      }
    }
    
    setTimeInput(formattedInput);
  };

  const handleCurrentTime = () => {
    try {
      const now = new Date();
      const zonedTime = formatInTimeZone(now, sourceZone, "yyyy-MM-dd HH:mm:ss");
      const [date, time] = zonedTime.split(' ');
      setDateInput(date);
      setTimeInput(time);
    } catch (error) {
      console.error("Error setting current time:", error);
      toast({
        title: "Error",
        description: "Failed to get current time",
        duration: 3000,
      });
    }
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
        setPythonCode("");
        return;
      }

      const result = formatInTimeZone(
        new Date(fullDateTime.replace(/-/g, '/')),
        sourceZone,
        "yyyy-MM-dd HH:mm:ss",
        { timeZone: targetZone }
      );
      
      setConvertedResult(result);
      generatePythonCode(fullDateTime);
      
      console.log({
        input: fullDateTime,
        sourceZone,
        targetZone,
        result,
        method: "Direct timezone conversion"
      });
      
    } catch (error) {
      console.error("Conversion error:", error);
      setConvertedResult("Invalid time format");
      setPythonCode("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  // Add the missing copyPythonCode function
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

  const generatePythonCode = (dateTimeStr: string) => {
    const pythonCode = `
from datetime import datetime
import pytz

def convert_time(date_time_str="${dateTimeStr}",
                source_zone="${sourceZone}", target_zone="${targetZone}"):
    """
    Convert datetime between timezones
    
    Parameters:
        date_time_str: Date time string in format YYYY-MM-DD HH:MM:SS
        source_zone: Source timezone name
        target_zone: Target timezone name
        
    Returns:
        Converted datetime string
    """
    # Parse the datetime string
    dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
    
    # Set source timezone - this tells Python that dt should be interpreted as being in source_zone
    source_tz = pytz.timezone(source_zone)
    source_dt = source_tz.localize(dt)
    
    # Convert to target timezone - a simple timezone conversion
    target_tz = pytz.timezone(target_zone)
    target_dt = source_dt.astimezone(target_tz)
    
    return target_dt.strftime("%Y-%m-%d %H:%M:%S")

# Example usage
result = convert_time()
print(f"Converted time: {result}")
    `.trim();

    setPythonCode(pythonCode);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Earth className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Time Zone Converter</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date (yyyy-MM-dd)
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="yyyy-MM-dd"
                  value={dateInput}
                  onChange={(e) => handleDateChange(e)}
                  onKeyDown={(e) => {
                    if (!/[\d-]/.test(e.key) && 
                        e.key !== 'Backspace' && 
                        e.key !== 'Delete' && 
                        e.key !== 'ArrowLeft' && 
                        e.key !== 'ArrowRight' &&
                        e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCurrentTime}
                  className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                  title="Use current time"
                >
                  <Clock className="h-4 w-4 text-gray-300" />
                </Button>
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
                onChange={(e) => handleTimeChange(e)}
                onKeyDown={(e) => {
                  if (!/[\d:]/.test(e.key) && 
                      e.key !== 'Backspace' && 
                      e.key !== 'Delete' && 
                      e.key !== 'ArrowLeft' && 
                      e.key !== 'ArrowRight' &&
                      e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={convertedResult}
                readOnly
                className="w-full bg-black/20 border-purple-500/20 text-gray-100"
              />
              <Button
                onClick={() => copyToClipboard(convertedResult)}
                variant="outline"
                className="sm:shrink-0 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
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
              <pre className="bg-black/30 rounded-md p-4 overflow-auto max-h-[300px]">
                <code className="text-gray-200 text-xs" dangerouslySetInnerHTML={{ __html: highlightPythonCode(pythonCode) }} />
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
