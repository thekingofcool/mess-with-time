
import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Copy, CheckCircle2, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TimeFormatter = () => {
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [formatString, setFormatString] = useState<string>("yyyy-MM-dd HH:mm:ss");
  const [formattedResult, setFormattedResult] = useState<string>("");
  const [weekInfo, setWeekInfo] = useState<{weekOfYear: string; weekOfMonth: string}>({weekOfYear: "", weekOfMonth: ""});
  const [pythonCode, setPythonCode] = useState<string>("");
  const { toast } = useToast();
  
  const formatTemplates = [
    { label: "Standard Date", format: "yyyy-MM-dd" },
    { label: "Full Date & Time", format: "yyyy-MM-dd HH:mm:ss" },
    { label: "US Format", format: "MM/dd/yyyy" },
    { label: "EU Format", format: "dd.MM.yyyy" },
    { label: "Month Name", format: "MMMM d, yyyy" },
    { label: "Day of Week", format: "EEEE, MMMM d, yyyy" },
    { label: "Time Only", format: "HH:mm:ss" },
    { label: "12-Hour Time", format: "hh:mm a" },
  ];

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

  const formatDate = () => {
    try {
      const formattedDate = formatDateInput(dateInput);
      const formattedTime = formatTimeInput(timeInput);
      
      if (formattedDate.length < 10 || !formattedTime) {
        setFormattedResult("Please enter valid date and time");
        setWeekInfo({weekOfYear: "", weekOfMonth: ""});
        setPythonCode("");
        return;
      }
      
      const dateTimeStr = `${formattedDate} ${formattedTime}`;
      const date = new Date(dateTimeStr.replace(/-/g, '/'));
      
      if (isNaN(date.getTime())) {
        setFormattedResult("Invalid date or time format");
        setWeekInfo({weekOfYear: "", weekOfMonth: ""});
        setPythonCode("");
        return;
      }
      
      const result = format(date, formatString);
      setFormattedResult(result);
      
      // Calculate week information
      const weekOfYear = format(date, "'Week' w 'of' yyyy");
      const weekOfMonth = getWeekOfMonth(date);
      setWeekInfo({
        weekOfYear,
        weekOfMonth: `Week ${weekOfMonth} of the month`,
      });
      
      generatePythonCode(date, formatString);
      
    } catch (error) {
      setFormattedResult("Error formatting date");
      setWeekInfo({weekOfYear: "", weekOfMonth: ""});
      setPythonCode("");
    }
  };

  // Function to get week of month
  const getWeekOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeekOnFirst = firstDayOfMonth.getDay();
    
    const day = date.getDate();
    const weekOfMonth = Math.ceil((day + dayOfWeekOnFirst) / 7);
    return weekOfMonth;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const useCurrentTime = () => {
    const now = new Date();
    setDateInput(format(now, "yyyy-MM-dd"));
    setTimeInput(format(now, "HH:mm:ss"));
  };

  const applyTemplate = (template: string) => {
    setFormatString(template);
  };
  
  const generatePythonCode = (date: Date, formatPattern: string) => {
    // Convert format pattern from date-fns to Python's strftime
    let pythonFormat = formatPattern
      .replace(/yyyy/g, '%Y')
      .replace(/yy/g, '%y')
      .replace(/MMMM/g, '%B')
      .replace(/MMM/g, '%b')
      .replace(/MM/g, '%m')
      .replace(/M/g, '%-m')
      .replace(/dd/g, '%d')
      .replace(/d/g, '%-d')
      .replace(/EEEE/g, '%A')
      .replace(/EEE/g, '%a')
      .replace(/HH/g, '%H')
      .replace(/H/g, '%-H')
      .replace(/hh/g, '%I')
      .replace(/h/g, '%-I')
      .replace(/mm/g, '%M')
      .replace(/m/g, '%-M')
      .replace(/ss/g, '%S')
      .replace(/s/g, '%-S')
      .replace(/a/g, '%p');
    
    const pythonCode = `
from datetime import datetime

def format_datetime(date_str="${formatDateInput(dateInput)}", 
                   time_str="${formatTimeInput(timeInput)}", 
                   format_pattern="${pythonFormat}"):
    # Combine date and time
    dt_str = f"{date_str} {time_str}"
    
    # Create datetime object
    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    
    # Format according to the pattern
    formatted = dt.strftime(format_pattern)
    
    # Calculate week of year
    week_of_year = f"Week {dt.strftime('%U')} of {dt.strftime('%Y')}"
    
    # Calculate week of month
    day_of_month = int(dt.strftime('%d'))
    first_day = datetime(dt.year, dt.month, 1)
    day_of_week_on_first = int(first_day.strftime('%w'))
    week_of_month = (day_of_month + day_of_week_on_first - 1) // 7 + 1
    
    return {
        "formatted_result": formatted,
        "week_of_year": week_of_year,
        "week_of_month": f"Week {week_of_month} of the month"
    }

# Example usage
result = format_datetime()
print(f"Formatted result: {result['formatted_result']}")
print(f"Week of year: {result['week_of_year']}")
print(f"Week of month: {result['week_of_month']}")
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
      <div className="flex items-center justify-center space-x-2">
        <FileText className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Time Formatter</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (YYYY-MM-DD)
            </label>
            <Input
              type="text"
              placeholder="YYYY-MM-DD"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              onBlur={() => setDateInput(formatDateInput(dateInput))}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time (HH:MM:SS)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="HH:MM:SS"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                onBlur={() => setTimeInput(formatTimeInput(timeInput))}
                className="flex-1 bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
              <Button variant="outline" onClick={useCurrentTime} className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100">
                <RefreshCw className="h-4 w-4 mr-1" />
                Now
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Format Pattern
          </label>
          <Input
            value={formatString}
            onChange={(e) => setFormatString(e.target.value)}
            className="w-full font-mono text-sm bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            placeholder="yyyy-MM-dd HH:mm:ss"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {formatTemplates.slice(0, 6).map((template, idx) => (
            <Button 
              key={idx} 
              variant="outline" 
              size="sm"
              onClick={() => applyTemplate(template.format)}
              className="justify-start text-xs bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
            >
              {template.label}
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={formatDate} 
          className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
        >
          Format Date
        </Button>
        
        {formattedResult && (
          <div className="mt-4 p-4 bg-black/20 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300 mb-1">Formatted Result</div>
                <div className="text-lg font-medium text-gray-100">{formattedResult}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(formattedResult)}
                className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </Button>
            </div>
          </div>
        )}
        
        {weekInfo.weekOfYear && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/20 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <div className="text-sm text-gray-100">{weekInfo.weekOfYear}</div>
            </div>
            <div className="p-3 bg-black/20 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <div className="text-sm text-gray-100">{weekInfo.weekOfMonth}</div>
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
        
        <Alert variant="default" className="bg-black/20 border-purple-500/20">
          <CheckCircle2 className="h-4 w-4 text-purple-400" />
          <AlertDescription className="text-xs text-gray-300">
            Formatting options: yyyy (year), MM (month), dd (day), HH (hour 24h), 
            mm (minute), ss (second), h (hour 12h), a (am/pm), EEEE (day name), 
            MMMM (month name), w (week of year)
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default TimeFormatter;
