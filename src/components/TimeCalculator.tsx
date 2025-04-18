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
import { formatDateInput, formatTimeInput, parseDateTime, highlightPythonCode } from "@/utils/dateTimeUtils";

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
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Calculator className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Time Calculator</h2>
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
                Start Date (yyyy-MM-dd)
              </label>
              <Input
                type="text"
                placeholder="yyyy-MM-dd"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                onBlur={() => setStartDateInput(formatDateInput(startDateInput))}
                onKeyDown={(e) => {
                  // Allow only digits, hyphens, and control keys
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time (HH:mm:ss)
              </label>
              <Input
                type="text"
                placeholder="HH:mm:ss"
                value={startTimeInput}
                onChange={(e) => setStartTimeInput(e.target.value)}
                onBlur={() => setStartTimeInput(formatTimeInput(startTimeInput))}
                onKeyDown={(e) => {
                  // Allow only digits, colons, and control keys
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date (yyyy-MM-dd)
              </label>
              <Input
                type="text"
                placeholder="yyyy-MM-dd"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                onBlur={() => setEndDateInput(formatDateInput(endDateInput))}
                onKeyDown={(e) => {
                  // Allow only digits, hyphens, and control keys
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time (HH:mm:ss)
              </label>
              <Input
                type="text"
                placeholder="HH:mm:ss"
                value={endTimeInput}
                onChange={(e) => setEndTimeInput(e.target.value)}
                onBlur={() => setEndTimeInput(formatTimeInput(endTimeInput))}
                onKeyDown={(e) => {
                  // Allow only digits, colons, and control keys
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
                <pre className="bg-black/30 rounded-md p-4 overflow-auto">
                  <div className="text-gray-200 text-xs" dangerouslySetInnerHTML={{ __html: highlightPythonCode(diffPythonCode) }} />
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
                Base Date (yyyy-MM-dd)
              </label>
              <Input
                type="text"
                placeholder="yyyy-MM-dd"
                value={baseDateInput}
                onChange={(e) => setBaseDateInput(e.target.value)}
                onBlur={() => setBaseDateInput(formatDateInput(baseDateInput))}
                onKeyDown={(e) => {
                  // Allow only digits, hyphens, and control keys
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Base Time (HH:mm:ss)
              </label>
              <Input
                type="text"
                placeholder="HH:mm:ss"
                value={baseTimeInput}
                onChange={(e) => setBaseTimeInput(e.target.value)}
                onBlur={() => setBaseTimeInput(formatTimeInput(baseTimeInput))}
                onKeyDown={(e) => {
                  // Allow only digits, colons, and control keys
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
                <pre className="bg-black/30 rounded-md p-4 overflow-auto">
                  <div className="text-gray-200 text-xs" dangerouslySetInnerHTML={{ __html: highlightPythonCode(addPythonCode) }} />
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
