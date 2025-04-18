
import { useState } from "react";
import { addDays, addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Plus, Minus, Copy } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const TimeCalculator = () => {
  // For time difference calculation
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [startTimeInput, setStartTimeInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [endTimeInput, setEndTimeInput] = useState<string>("");
  const [diffResult, setDiffResult] = useState<string>("");
  const [diffPythonCode, setDiffPythonCode] = useState<string>("");
  
  // For date addition/subtraction
  const [baseDateInput, setBaseDateInput] = useState<string>("");
  const [baseTimeInput, setBaseTimeInput] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [value, setValue] = useState<string>("1");
  const [unit, setUnit] = useState<string>("days");
  const [addResult, setAddResult] = useState<string>("");
  const [addPythonCode, setAddPythonCode] = useState<string>("");
  
  const { toast } = useToast();

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

  const parseDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return null;
    
    const formattedDate = formatDateInput(dateStr);
    const formattedTime = formatTimeInput(timeStr);
    
    if (formattedDate.length < 10 || !formattedTime) return null;
    
    const [year, month, day] = formattedDate.split('-').map(Number);
    const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
    
    // Month is 0-indexed in JavaScript Date
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const calculateDifference = () => {
    try {
      const start = parseDateTime(startDateInput, startTimeInput);
      const end = parseDateTime(endDateInput, endTimeInput);
      
      if (!start || !end) {
        setDiffResult("Please enter valid dates and times");
        setDiffPythonCode("");
        return;
      }
      
      const days = differenceInDays(end, start);
      const hours = differenceInHours(end, start) % 24;
      const minutes = differenceInMinutes(end, start) % 60;
      const seconds = differenceInSeconds(end, start) % 60;
      
      const result = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      setDiffResult(result);
      
      // Generate Python code for the difference calculation
      const pythonCode = `
from datetime import datetime

def calculate_time_difference(
    start_date="${formatDateInput(startDateInput)}", 
    start_time="${formatTimeInput(startTimeInput)}",
    end_date="${formatDateInput(endDateInput)}", 
    end_time="${formatTimeInput(endTimeInput)}"
):
    # Parse the datetime strings
    start_str = f"{start_date} {start_time}"
    end_str = f"{end_date} {end_time}"
    
    start_dt = datetime.strptime(start_str, "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(end_str, "%Y-%m-%d %H:%M:%S")
    
    # Calculate the difference
    diff = end_dt - start_dt
    
    # Extract days
    days = diff.days
    
    # Extract hours, minutes, seconds
    seconds = diff.seconds
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
    
    return f"{days} days, {hours} hours, {minutes} minutes, {seconds} seconds"

# Example usage
result = calculate_time_difference()
print(f"Time difference: {result}")
`.trim();
      
      setDiffPythonCode(pythonCode);
      
    } catch (error) {
      setDiffResult("Error calculating difference");
      setDiffPythonCode("");
    }
  };

  const calculateDateAddition = () => {
    try {
      const baseDate = parseDateTime(baseDateInput, baseTimeInput);
      const numValue = parseInt(value);
      
      if (!baseDate || isNaN(numValue)) {
        setAddResult("Please enter valid inputs");
        setAddPythonCode("");
        return;
      }
      
      let resultDate: Date;
      
      if (operation === "add") {
        if (unit === "days") {
          resultDate = addDays(baseDate, numValue);
        } else if (unit === "hours") {
          resultDate = addHours(baseDate, numValue);
        } else {
          resultDate = addMinutes(baseDate, numValue);
        }
      } else {
        if (unit === "days") {
          resultDate = addDays(baseDate, -numValue);
        } else if (unit === "hours") {
          resultDate = addHours(baseDate, -numValue);
        } else {
          resultDate = addMinutes(baseDate, -numValue);
        }
      }
      
      const resultDateStr = format(resultDate, "yyyy-MM-dd");
      const resultTimeStr = format(resultDate, "HH:mm:ss");
      const result = `${resultDateStr} ${resultTimeStr}`;
      
      setAddResult(result);
      
      // Generate Python code for the date addition/subtraction
      const pythonCode = `
from datetime import datetime, timedelta

def calculate_date_${operation}(
    base_date="${formatDateInput(baseDateInput)}", 
    base_time="${formatTimeInput(baseTimeInput)}",
    value=${numValue},
    unit="${unit}"
):
    # Parse the base datetime
    base_str = f"{base_date} {base_time}"
    base_dt = datetime.strptime(base_str, "%Y-%m-%d %H:%M:%S")
    
    # Calculate the result based on operation and unit
    if unit == "days":
        delta = timedelta(days=${operation === "add" ? "" : "-"}value)
    elif unit == "hours":
        delta = timedelta(hours=${operation === "add" ? "" : "-"}value)
    else:  # minutes
        delta = timedelta(minutes=${operation === "add" ? "" : "-"}value)
    
    result_dt = base_dt + delta
    
    # Format the result
    return result_dt.strftime("%Y-%m-%d %H:%M:%S")

# Example usage
result = calculate_date_${operation}()
print(f"Result: {result}")
`.trim();
      
      setAddPythonCode(pythonCode);
      
    } catch (error) {
      setAddResult("Error calculating new date");
      setAddPythonCode("");
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };
  
  const copyPythonCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Python code copied to clipboard",
      description: "The code has been copied and can be used in your Python environment.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Calculator className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Time Calculator</h2>
      </div>

      <Tabs defaultValue="difference">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="difference">Time Difference</TabsTrigger>
          <TabsTrigger value="addition">Date Add/Subtract</TabsTrigger>
        </TabsList>
        
        <TabsContent value="difference" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date (YYYY-MM-DD)
              </label>
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                onBlur={() => setStartDateInput(formatDateInput(startDateInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time (HH:MM:SS)
              </label>
              <Input
                type="text"
                placeholder="HH:MM:SS"
                value={startTimeInput}
                onChange={(e) => setStartTimeInput(e.target.value)}
                onBlur={() => setStartTimeInput(formatTimeInput(startTimeInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date (YYYY-MM-DD)
              </label>
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                onBlur={() => setEndDateInput(formatDateInput(endDateInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time (HH:MM:SS)
              </label>
              <Input
                type="text"
                placeholder="HH:MM:SS"
                value={endTimeInput}
                onChange={(e) => setEndTimeInput(e.target.value)}
                onBlur={() => setEndTimeInput(formatTimeInput(endTimeInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>
          
          <Button 
            onClick={calculateDifference} 
            className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Calculate Difference
          </Button>
          
          {diffResult && (
            <div className="mt-4 p-4 bg-black/20 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Result</div>
                  <div className="text-lg font-medium text-gray-100">{diffResult}</div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(diffResult)}
                  className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4 text-gray-300" />
                </Button>
              </div>
            </div>
          )}
          
          {diffPythonCode && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Python Code
              </label>
              <div className="relative">
                <pre className="bg-black/30 rounded-md p-4 text-gray-200 text-xs overflow-auto">
                  {diffPythonCode}
                </pre>
                <Button
                  onClick={() => copyPythonCode(diffPythonCode)}
                  variant="outline"
                  className="absolute top-2 right-2 h-8 py-1 px-2 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="addition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Base Date (YYYY-MM-DD)
              </label>
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                value={baseDateInput}
                onChange={(e) => setBaseDateInput(e.target.value)}
                onBlur={() => setBaseDateInput(formatDateInput(baseDateInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Base Time (HH:MM:SS)
              </label>
              <Input
                type="text"
                placeholder="HH:MM:SS"
                value={baseTimeInput}
                onChange={(e) => setBaseTimeInput(e.target.value)}
                onBlur={() => setBaseTimeInput(formatTimeInput(baseTimeInput))}
                className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={operation} 
              onValueChange={(v) => setOperation(v as "add" | "subtract")}
            >
              <SelectTrigger className="w-24 bg-black/20 border-purple-500/20 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center">
                    <Minus className="w-4 h-4 mr-2" />
                    Subtract
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-black/20 border-purple-500/20 text-gray-100"
              min="1"
            />
            
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-32 bg-black/20 border-purple-500/20 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={calculateDateAddition} 
            className="w-full bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Calculate New Date
          </Button>
          
          {addResult && (
            <div className="mt-4 p-4 bg-black/20 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Result</div>
                  <div className="text-lg font-medium text-gray-100">{addResult}</div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(addResult)}
                  className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4 text-gray-300" />
                </Button>
              </div>
            </div>
          )}
          
          {addPythonCode && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Python Code
              </label>
              <div className="relative">
                <pre className="bg-black/30 rounded-md p-4 text-gray-200 text-xs overflow-auto">
                  {addPythonCode}
                </pre>
                <Button
                  onClick={() => copyPythonCode(addPythonCode)}
                  variant="outline"
                  className="absolute top-2 right-2 h-8 py-1 px-2 border-purple-500/20 hover:bg-purple-500/20"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeCalculator;
