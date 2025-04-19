import { useState } from "react";
import { format, fromUnixTime } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Copy, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { formatDateInput, formatTimeInput, highlightPythonCode } from "@/utils/dateTimeUtils";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [timestampType, setTimestampType] = useState<string>("seconds");
  const [convertedResult, setConvertedResult] = useState<string>("");
  const [pythonCode, setPythonCode] = useState<string>("");
  const { toast } = useToast();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits and hyphens
    const cleanInput = input.replace(/[^\d-]/g, '');
    
    // Process date format: YYYY-MM-DD
    let formattedInput = '';
    const digits = cleanInput.replace(/-/g, '');
    
    if (digits.length > 0) {
      // Process year part (max 4 digits)
      const year = digits.substring(0, 4);
      formattedInput = year;
      
      if (year.length === 4) {
        formattedInput += '-';
        
        // Process month part (max 2 digits)
        if (digits.length > 4) {
          let month = digits.substring(4, 6);
          // Validate month (01-12)
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
            
            // Process day part (max 2 digits)
            if (digits.length > 6) {
              let day = digits.substring(6, 8);
              
              // Calculate days in month
              const yearNum = parseInt(year);
              const monthNum = parseInt(month);
              const daysInMonth = [
                31,
                // February has 29 days in leap years
                (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) ? 29 : 28,
                31, 30, 31, 30, 31, 31, 30, 31, 30, 31
              ][monthNum - 1];
              
              // Validate day
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
    // Only allow digits and colons
    const cleanInput = input.replace(/[^\d:]/g, '');
    
    // Process time format: HH:MM:SS
    let formattedInput = '';
    const digits = cleanInput.replace(/:/g, '');
    
    if (digits.length > 0) {
      // Process hours part (max 2 digits)
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
        
        // Process minutes part (max 2 digits)
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
            
            // Process seconds part (max 2 digits)
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

  const convertToTimestamp = () => {
    try {
      const formattedDate = formatDateInput(dateInput);
      const formattedTime = formatTimeInput(timeInput);
      
      if (formattedDate.length < 10 || !formattedTime) {
        setConvertedResult("Please enter valid date and time");
        setPythonCode("");
        return;
      }
      
      const dateStr = `${formattedDate} ${formattedTime}`;
      const date = new Date(dateStr.replace(/-/g, '/'));
      
      if (isNaN(date.getTime())) {
        setConvertedResult("Invalid date or time format");
        setPythonCode("");
        return;
      }
      
      let ts = Math.floor(date.getTime() / 1000);
      let result = String(ts);
      
      if (timestampType === "milliseconds") {
        result = String(ts * 1000);
      } else if (timestampType === "iso8601") {
        result = date.toISOString();
      }
      
      setConvertedResult(result);
      setTimestamp(result);
      generatePythonCodeToTimestamp(formattedDate, formattedTime);
    } catch (error) {
      setConvertedResult("Error converting to timestamp");
      setPythonCode("");
    }
  };

  const convertFromTimestamp = () => {
    if (!timestamp) {
      setConvertedResult("Please enter a timestamp");
      setPythonCode("");
      return;
    }
    
    try {
      let date: Date;
      
      if (timestampType === "seconds") {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
          setConvertedResult("Invalid timestamp");
          setPythonCode("");
          return;
        }
        date = fromUnixTime(ts);
      } else if (timestampType === "milliseconds") {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
          setConvertedResult("Invalid timestamp");
          setPythonCode("");
          return;
        }
        date = fromUnixTime(ts / 1000);
      } else { // iso8601
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        setConvertedResult("Invalid timestamp");
        setPythonCode("");
        return;
      }
      
      const formattedDate = format(date, "yyyy-MM-dd");
      const formattedTime = format(date, "HH:mm:ss");
      
      setDateInput(formattedDate);
      setTimeInput(formattedTime);
      setConvertedResult(`${formattedDate} ${formattedTime}`);
      generatePythonCodeFromTimestamp();
    } catch (error) {
      setConvertedResult("Error converting from timestamp");
      setPythonCode("");
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    
    if (timestampType === "milliseconds") {
      setTimestamp(String(now.getTime()));
    } else if (timestampType === "seconds") {
      setTimestamp(String(Math.floor(now.getTime() / 1000)));
    } else if (timestampType === "iso8601") {
      setTimestamp(now.toISOString());
    }
    
    const formattedDate = format(now, "yyyy-MM-dd");
    const formattedTime = format(now, "HH:mm:ss");
    
    setDateInput(formattedDate);
    setTimeInput(formattedTime);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const generatePythonCodeToTimestamp = (dateStr: string, timeStr: string) => {
    const pythonCode = `
from datetime import datetime

def datetime_to_timestamp(date_str="${dateStr}", time_str="${timeStr}", output_format="${timestampType}"):
    # Combine date and time
    dt_str = f"{date_str} {time_str}"
    
    # Create datetime object
    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    
    # Convert to timestamp based on format
    if output_format == "seconds":
        return int(dt.timestamp())
    elif output_format == "milliseconds":
        return int(dt.timestamp() * 1000)
    elif output_format == "iso8601":
        return dt.isoformat()

# Example usage
result = datetime_to_timestamp()
print(f"Timestamp: {result}")
`.trim();
    
    setPythonCode(pythonCode);
  };
  
  const generatePythonCodeFromTimestamp = () => {
    const pythonCode = `
from datetime import datetime

def timestamp_to_datetime(timestamp="${timestamp}", type="${timestampType}"):
    if type == "seconds":
        dt = datetime.fromtimestamp(int(timestamp))
    elif type == "milliseconds":
        dt = datetime.fromtimestamp(int(timestamp) / 1000)
    else:  # ISO 8601
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    
    return dt.strftime("%Y-%m-%d %H:%M:%S")

# Example usage
result = timestamp_to_datetime()
print(f"Datetime: {result}")
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
        <ArrowUpDown className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Timestamp Converter</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select value={timestampType} onValueChange={setTimestampType}>
            <SelectTrigger className="w-full sm:w-40 bg-black/20 border-purple-500/20 text-gray-100">
              <SelectValue placeholder="Timestamp type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Unix (seconds)</SelectItem>
              <SelectItem value="milliseconds">Milliseconds</SelectItem>
              <SelectItem value="iso8601">ISO 8601</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={getCurrentTimestamp} 
            size="sm" 
            className="w-full sm:w-auto bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Current
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Timestamp
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              onKeyDown={(e) => {
                // For ISO 8601, allow all characters
                if (timestampType === "iso8601") return;
                
                // For timestamp types, allow only digits and control keys
                if (!/\d/.test(e.key) && 
                    e.key !== 'Backspace' && 
                    e.key !== 'Delete' && 
                    e.key !== 'ArrowLeft' && 
                    e.key !== 'ArrowRight' &&
                    e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              placeholder={timestampType === "iso8601" ? "YYYY-MM-DDTHH:mm:ssZ" : "Enter timestamp"}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
            <Button
              variant="outline"
              className="sm:shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
              onClick={() => copyToClipboard(timestamp)}
            >
              <Copy className="h-4 w-4 mr-1 text-gray-300" /> Copy
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date (yyyy-MM-dd)
            </label>
            <Input
              type="text"
              placeholder="yyyy-MM-dd"
              value={dateInput}
              onChange={handleDateChange}
              onKeyDown={(e) => {
                // Allow digits, hyphens, backspace, delete, arrow keys and tab
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
              Time (HH:mm:ss)
            </label>
            <Input
              type="text"
              placeholder="HH:mm:ss"
              value={timeInput}
              onChange={handleTimeChange}
              onKeyDown={(e) => {
                // Allow digits, colons, backspace, delete, arrow keys and tab
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={convertToTimestamp}
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Date/Time ➔ Timestamp
          </Button>
          <Button
            onClick={convertFromTimestamp}
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            Timestamp ➔ Date/Time
          </Button>
        </div>

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
                variant="outline"
                onClick={() => copyToClipboard(convertedResult)}
                className="sm:shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
              >
                <Copy className="h-4 w-4 mr-1 text-gray-300" /> Copy
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

export default TimestampConverter;
