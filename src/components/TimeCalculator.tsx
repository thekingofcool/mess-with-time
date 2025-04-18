
import { useState } from "react";
import { addDays, addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Plus, Minus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TimeCalculator = () => {
  // For time difference calculation
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [diffResult, setDiffResult] = useState<string>("");
  
  // For date addition/subtraction
  const [baseDate, setBaseDate] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [value, setValue] = useState<string>("1");
  const [unit, setUnit] = useState<string>("days");
  const [addResult, setAddResult] = useState<string>("");

  const calculateDifference = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setDiffResult("Please enter valid dates");
        return;
      }
      
      const days = differenceInDays(end, start);
      const hours = differenceInHours(end, start) % 24;
      const minutes = differenceInMinutes(end, start) % 60;
      const seconds = differenceInSeconds(end, start) % 60;
      
      setDiffResult(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    } catch (error) {
      setDiffResult("Error calculating difference");
    }
  };

  const calculateDateAddition = () => {
    try {
      const date = new Date(baseDate);
      const numValue = parseInt(value);
      
      if (isNaN(date.getTime()) || isNaN(numValue)) {
        setAddResult("Please enter valid inputs");
        return;
      }
      
      let resultDate: Date;
      
      if (operation === "add") {
        if (unit === "days") {
          resultDate = addDays(date, numValue);
        } else if (unit === "hours") {
          resultDate = addHours(date, numValue);
        } else {
          resultDate = addMinutes(date, numValue);
        }
      } else {
        if (unit === "days") {
          resultDate = addDays(date, -numValue);
        } else if (unit === "hours") {
          resultDate = addHours(date, -numValue);
        } else {
          resultDate = addMinutes(date, -numValue);
        }
      }
      
      setAddResult(resultDate.toISOString().slice(0, 19).replace("T", " "));
    } catch (error) {
      setAddResult("Error calculating new date");
    }
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date and Time
            </label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date and Time
            </label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button onClick={calculateDifference} className="w-full">
            Calculate Difference
          </Button>
          
          {diffResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Result</div>
              <div className="text-lg font-medium">{diffResult}</div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="addition" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Date and Time
            </label>
            <Input
              type="datetime-local"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={operation} 
              onValueChange={(v) => setOperation(v as "add" | "subtract")}
            >
              <SelectTrigger className="w-24">
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
              className="flex-1"
              min="1"
            />
            
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={calculateDateAddition} className="w-full">
            Calculate New Date
          </Button>
          
          {addResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Result</div>
              <div className="text-lg font-medium">{addResult}</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeCalculator;
